import { closePool, transaction } from "@/lib/server/db";
import { seedUser } from "@/lib/server/auth";

async function main() {
  await transaction(async (client) => {
  const adminId = await seedUser(client, "ops@example.test", "Password123!", "ZeroFee Ops", ["ADMIN"]);
  const creatorUserId = await seedUser(client, "mila@example.test", "Password123!", "Mila Novak", ["CREATOR"]);
  const fanId = await seedUser(client, "ana@example.test", "Password123!", "Ana Member", ["MEMBER"]);
  const otherCreatorUserId = await seedUser(client, "other@example.test", "Password123!", "Other Creator", ["CREATOR"]);

  await client.query(`
    INSERT INTO country_capabilities
    (code, launch_status, individual_supported, company_supported, charges_enabled, payouts_enabled, supported_presentment_currencies, supported_settlement_currencies, guaranteed_earnings_enabled, tax_readiness, legal_review_state, provider_approval_state, evidence)
    VALUES
    ('US','BETA',true,true,true,true,ARRAY['USD','EUR'],ARRAY['USD'],true,'TEST_ONLY','LEGAL_REVIEW_REQUIRED','TEST_ONLY','Seed test market'),
    ('IE','BETA',true,true,true,true,ARRAY['EUR'],ARRAY['EUR'],true,'TEST_ONLY','LEGAL_REVIEW_REQUIRED','TEST_ONLY','Seed test market'),
    ('GB','WAITLIST',true,true,false,false,ARRAY['GBP'],ARRAY['GBP'],false,'LEGAL_REVIEW_REQUIRED','LEGAL_REVIEW_REQUIRED','NOT_CONFIGURED','Waitlist'),
    ('BR','UNSUPPORTED',false,false,false,false,ARRAY[]::text[],ARRAY[]::text[],false,'UNSUPPORTED','UNSUPPORTED','NOT_CONFIGURED','Unsupported')
    ON CONFLICT (code) DO UPDATE SET launch_status = EXCLUDED.launch_status
  `);

  const creator = await client.query<{ id: string }>(
    `INSERT INTO creator_profiles (user_id, slug, display_name, country_code, category, bio, support_email, published)
     VALUES ($1,'mila-nova','Mila Novak','IE','research','Independent paid research briefings and templates','support@example.test',true)
     ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name RETURNING id`,
    [creatorUserId]
  );
  const otherCreator = await client.query<{ id: string }>(
    `INSERT INTO creator_profiles (user_id, slug, display_name, country_code, category, bio, published)
     VALUES ($1,'other-creator','Other Creator','US','education','Separate tenant',true)
     ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name RETURNING id`,
    [otherCreatorUserId]
  );

  const application = await client.query<{ id: string }>(
    `INSERT INTO creator_applications (creator_id,state,country_code,business_type,offering,rights_attested,aup_accepted,submitted_at,decided_at)
     VALUES ($1,'APPROVED_FOR_PAYOUT_ONBOARDING','IE','individual','Paid research briefings, Discord office hours, downloadable templates',true,true,now(),now())
     RETURNING id`,
    [creator.rows[0].id]
  );
  await client.query("INSERT INTO creator_review_notes (application_id, admin_user_id, note) VALUES ($1,$2,'Seed approval')", [application.rows[0].id, adminId]);

  await client.query(
    `INSERT INTO creator_connected_accounts (creator_id, provider, external_account_id, onboarding_state, charges_enabled, payouts_enabled, dashboard_url)
     VALUES ($1,'mock',$2,'READY',true,true,'/api/mock/connect/dashboard') ON CONFLICT (creator_id) DO UPDATE SET onboarding_state = 'READY', charges_enabled = true, payouts_enabled = true`,
    [creator.rows[0].id, `acct_mock_${creator.rows[0].id.slice(0, 8)}`]
  );

  const plans = [
    ["starter", "Starter", 1900, 100],
    ["creator", "Creator", 4900, 1000],
    ["pro", "Pro", 9900, 5000],
    ["business", "Business", 19900, 25000]
  ] as const;
  let creatorPlanVersion = "";
  for (const [code, name, price, limit] of plans) {
    const plan = await client.query<{ id: string }>("INSERT INTO platform_plans (code,name) VALUES ($1,$2) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name RETURNING id", [code, name]);
    const version = await client.query<{ id: string }>(
      `INSERT INTO platform_plan_versions (plan_id,version,monthly_price_minor,currency,active_member_limit,storage_mb_limit,broadcast_limit,api_quota)
       VALUES ($1,1,$2,'USD',$3,1024,10000,100000)
       ON CONFLICT (plan_id,version) DO UPDATE SET monthly_price_minor = EXCLUDED.monthly_price_minor RETURNING id`,
      [plan.rows[0].id, price, limit]
    );
    if (code === "creator") creatorPlanVersion = version.rows[0].id;
  }
  await client.query(
    `INSERT INTO platform_subscriptions (creator_id,plan_version_id,provider,state,current_period_end)
     VALUES ($1,$2,'mock','ACTIVE',now()+interval '1 month')
     ON CONFLICT (creator_id) DO UPDATE SET state = 'ACTIVE', plan_version_id = EXCLUDED.plan_version_id`,
    [creator.rows[0].id, creatorPlanVersion]
  );

  await client.query(
    `INSERT INTO provider_pricing_rules
    (version,provider,source_type,source_reference,creator_account_country,issuer_region,payment_method_family,card_class,presentment_currency,settlement_currency,percentage_bps,fixed_fee_minor,billing_fee_minor,cross_border_bps,fx_bps,fee_payer,fee_confidence,status,production_enabled,verified_at,revalidate_by)
    VALUES
    ('mock-ie-eea-card-consumer-eur-v1','mock','test_only','Deterministic mock catalog','IE','eea','card','consumer','EUR','EUR',150,25,10,35,0,'creator_connected_account','VERIFIED_UPPER_BOUND','VERIFIED',false,now(),now()+interval '120 days'),
    ('mock-us-domestic-commercial-fx-v1','mock','test_only','Deterministic mock catalog','US','domestic','card','commercial','EUR','USD',290,30,12,0,100,'creator_connected_account','EXACT_FORMULA','VERIFIED',false,now(),now()+interval '120 days')
    ON CONFLICT (version) DO UPDATE SET
      status = 'VERIFIED',
      verified_at = now(),
      revalidate_by = now()+interval '120 days'`
  );
  await client.query(
    `INSERT INTO guarantee_eligibility_profiles
    (version,provider,creator_country,issuer_region,presentment_currency,settlement_currency,payment_method_family,card_class,pricing_rule_version,fee_confidence,status,evidence,effective_from,effective_to)
    VALUES
    ('mock-ie-eea-card-consumer-eur-v1-eligibility','mock','IE','eea','EUR','EUR','card','consumer','mock-ie-eea-card-consumer-eur-v1','VERIFIED_UPPER_BOUND','ELIGIBLE','Seed upper bound',now(),now()+interval '120 days'),
    ('mock-us-domestic-commercial-fx-v1-eligibility','mock','US','domestic','EUR','USD','card','commercial','mock-us-domestic-commercial-fx-v1','EXACT_FORMULA','ELIGIBLE','Seed exact formula',now(),now()+interval '120 days')
    ON CONFLICT (version) DO UPDATE SET
      status = 'ELIGIBLE',
      effective_from = now(),
      effective_to = now()+interval '120 days'`
  );

  const tier = await client.query<{ id: string }>(
    `INSERT INTO creator_tiers (creator_id,name,description,benefits,state,sort_order)
     VALUES ($1,'Signal Room','Weekly research membership','Weekly paid briefings, template vault, Discord office hours','PUBLISHED',1)
     ON CONFLICT (creator_id,name) DO UPDATE SET state = 'PUBLISHED' RETURNING id`,
    [creator.rows[0].id]
  );
  await client.query(
    `INSERT INTO tier_price_versions (tier_id,version,pricing_mode,billing_interval,currency,creator_target_minor)
     VALUES ($1,1,'GUARANTEED_EARNINGS','monthly','EUR',1000)
     ON CONFLICT (tier_id,version) DO NOTHING`,
    [tier.rows[0].id]
  );
  await client.query(
    `INSERT INTO creator_tiers (creator_id,name,description,benefits,state,sort_order)
     VALUES ($1,'Other Tier','Private other tenant','Other content','PUBLISHED',1)
     ON CONFLICT (creator_id,name) DO NOTHING`,
    [otherCreator.rows[0].id]
  );
  await client.query(
    `INSERT INTO posts (creator_id,title,slug,body,visibility,state,youtube_video_id)
     VALUES ($1,'Weekly signal brief','weekly-signal-brief','Members-only briefing body','ALL_PAID','PUBLISHED','dQw4w9WgXcQ')
     ON CONFLICT (creator_id,slug) DO UPDATE SET body = EXCLUDED.body`,
    [creator.rows[0].id]
  );
  await client.query("INSERT INTO notifications (user_id, kind, title, body) VALUES ($1,'seed','Seed complete','Your deterministic ZeroFee account is ready')", [fanId]);
  await client.query(
    `INSERT INTO integration_connections (creator_id,provider,external_reference,state,metadata)
     VALUES
     ($1,'discord','guild_mock_signal','CONNECTED','{"roleMap":{"Signal Room":"Research"}}'::jsonb),
     ($1,'telegram','chat_mock_signal','CONNECTED','{"access":"invite_link"}'::jsonb),
     ($1,'email','test_mailbox','CONNECTED','{"mode":"mock"}'::jsonb)
     ON CONFLICT (creator_id,provider) DO UPDATE SET state = EXCLUDED.state, metadata = EXCLUDED.metadata`,
    [creator.rows[0].id]
  );
  await client.query(
    `INSERT INTO broadcasts (creator_id,subject,body,audience,state,sent_at)
     VALUES ($1,'September update','A deterministic test broadcast for active members.','all','SENT',now())
     ON CONFLICT DO NOTHING`,
    [creator.rows[0].id]
  );
  });
}

main()
  .then(() => console.log("Deterministic ZeroFee seed rows written to PostgreSQL"))
  .finally(closePool)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
