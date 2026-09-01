import type pg from "pg";
import type { AuthUser } from "@/lib/server/auth";
import { assertAdmin, requireCreatorOwner, requireRole } from "@/lib/server/policies";
import { one, query, transaction } from "@/lib/server/db";

export async function createCreatorProfile(user: AuthUser, input: { slug: string; displayName: string; countryCode: string; category: string }) {
  requireRole(user, "CREATOR");
  const country = await one<{ code: string; launch_status: string }>("SELECT code, launch_status FROM country_capabilities WHERE code = $1", [input.countryCode]);
  if (!country || ["UNSUPPORTED", "PAUSED"].includes(country.launch_status)) throw new Error("Country is not open for creator onboarding");
  return one<{ id: string }>(
    "INSERT INTO creator_profiles (user_id, slug, display_name, country_code, category) VALUES ($1,$2,$3,$4,$5) RETURNING id",
    [user.id, input.slug, input.displayName, input.countryCode, input.category]
  );
}

export async function submitApplication(user: AuthUser, creatorId: string, input: { businessType: "individual" | "company"; offering: string; rightsAttested: boolean; aupAccepted: boolean }) {
  await requireCreatorOwner(user, creatorId);
  return transaction(async (client) => {
    const profile = await client.query<{ country_code: string }>("SELECT country_code FROM creator_profiles WHERE id = $1", [creatorId]);
    const application = await client.query<{ id: string }>(
      `INSERT INTO creator_applications (creator_id, state, country_code, business_type, offering, rights_attested, aup_accepted, submitted_at)
       VALUES ($1,'UNDER_REVIEW',$2,$3,$4,$5,$6,now()) RETURNING id`,
      [creatorId, profile.rows[0].country_code, input.businessType, input.offering, input.rightsAttested, input.aupAccepted]
    );
    await client.query("INSERT INTO creator_application_revisions (application_id, revision_number, snapshot) VALUES ($1,1,$2)", [application.rows[0].id, input]);
    await audit(client, user.id, "creator_application_submitted", "creator_application", application.rows[0].id, {});
    return application.rows[0];
  });
}

export async function reviewApplication(user: AuthUser, applicationId: string, decision: "APPROVED_FOR_PAYOUT_ONBOARDING" | "NEEDS_INFORMATION" | "REJECTED", reason: string) {
  assertAdmin(user);
  if (!reason.trim()) throw new Error("Review reason is required");
  return transaction(async (client) => {
    const app = await client.query<{ creator_id: string; state: string }>("SELECT creator_id, state FROM creator_applications WHERE id = $1 FOR UPDATE", [applicationId]);
    if (!app.rowCount) throw new Error("Application not found");
    if (!["SUBMITTED", "UNDER_REVIEW", "NEEDS_INFORMATION"].includes(app.rows[0].state)) throw new Error("Application is not reviewable");
    await client.query("UPDATE creator_applications SET state = $1, decided_at = now(), updated_at = now() WHERE id = $2", [decision, applicationId]);
    await client.query("INSERT INTO creator_review_notes (application_id, admin_user_id, note) VALUES ($1,$2,$3)", [applicationId, user.id, reason]);
    await client.query("INSERT INTO notifications (user_id, kind, title, body) SELECT user_id, 'application_status', 'Application reviewed', $2 FROM creator_profiles WHERE id = $1", [app.rows[0].creator_id, decision]);
    await audit(client, user.id, `application_${decision.toLowerCase()}`, "creator_application", applicationId, { reason });
    return { id: applicationId, state: decision };
  });
}

export async function audit(client: pg.PoolClient, actorUserId: string | null, action: string, targetType: string, targetId: string, metadata: object) {
  await client.query("INSERT INTO audit_logs (actor_user_id, action, target_type, target_id, metadata) VALUES ($1,$2,$3,$4,$5)", [actorUserId, action, targetType, targetId, metadata]);
}

export async function listApplications(user: AuthUser) {
  assertAdmin(user);
  return query("SELECT * FROM creator_applications ORDER BY created_at DESC");
}
