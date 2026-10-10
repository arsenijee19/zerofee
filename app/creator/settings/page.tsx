import type { Metadata } from "next";
import Link from "next/link";
import { setPublishedAction, updateSellerProfileAction } from "@/app/actions";
import { Avatar, Panel, ProductShell } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorProfileByUser, applicationState } from "@/lib/server/profile-service";
import { absoluteUrl } from "@/lib/server/email";

export const metadata: Metadata = { title: "Seller profile" };

const categories = ["education", "research", "art & design", "music", "video", "writing", "gaming", "software", "fitness", "business", "other"];
const linkSlots = 6;

export default async function CreatorSettingsPage() {
  const user = await requireRole("CREATOR");
  const profile = await getCreatorProfileByUser(user.id);
  if (!profile) {
    return <ProductShell kind="creator" title="Seller profile" user={user}><Panel title="Create your creator profile"><p>Start your application to create your seller profile.</p><Link className="primary-button" href="/creator/application">Start application</Link></Panel></ProductShell>;
  }
  const state = await applicationState(profile.id);
  const approved = state === "APPROVED_FOR_PAYOUT_ONBOARDING";
  const links = [...profile.links, ...Array.from({ length: Math.max(0, linkSlots - profile.links.length) }, () => ({ id: "", label: "", url: "" }))];
  const publicUrl = absoluteUrl(`/c/${profile.slug}`);

  return (
    <ProductShell kind="creator" title="Seller profile" user={user}>
      <Panel title="Your public page" eyebrow={profile.published ? "Live" : "Not published"}>
        <div className="detail-list">
          <div><span>Address</span><a href={`/c/${profile.slug}`}>{publicUrl}</a></div>
          <div><span>Status</span><strong>{profile.published ? "Visible to everyone" : "Hidden. Only you can preview it."}</strong></div>
          <div><span>Application</span><strong>{state ? state.replaceAll("_", " ").toLowerCase() : "not submitted"}</strong></div>
        </div>
        <div className="cta-row space-top">
          <Link className="secondary-button" href={`/c/${profile.slug}`}>{profile.published ? "View page" : "Preview page"}</Link>
          <form action={setPublishedAction}>
            <input type="hidden" name="creatorId" value={profile.id} />
            <input type="hidden" name="published" value={profile.published ? "false" : "true"} />
            <button className={profile.published ? "secondary-button" : "primary-button"} disabled={!profile.published && !approved}>{profile.published ? "Unpublish page" : "Publish page"}</button>
          </form>
        </div>
        {!profile.published && !approved && <p className="muted">Publishing unlocks once your creator application is approved.</p>}
      </Panel>

      <Panel title="Profile details" eyebrow="What members see">
        <form className="form-stack wide-form" action={updateSellerProfileAction}>
          <input type="hidden" name="creatorId" value={profile.id} />
          <fieldset>
            <legend>Photo and banner</legend>
            <div className="image-fields">
              <div>
                <Avatar assetId={profile.avatar_asset_id} name={profile.display_name} size={96} />
                <label>Profile photo<input name="avatar" type="file" accept="image/png,image/jpeg,image/webp" aria-describedby="avatar-help" /></label>
                <small id="avatar-help">Square works best. PNG, JPG or WebP, up to 2 MB.</small>
                {profile.avatar_asset_id && <label className="check"><input type="checkbox" name="remove_avatar" /> Remove current photo</label>}
              </div>
              <div>
                <div className="banner-preview" role="img" aria-label={profile.banner_asset_id ? "Current banner" : "No banner yet"} style={profile.banner_asset_id ? { backgroundImage: `url(/api/media/${profile.banner_asset_id})` } : undefined} />
                <label>Banner image<input name="banner" type="file" accept="image/png,image/jpeg,image/webp" aria-describedby="banner-help" /></label>
                <small id="banner-help">Wide image, ideally 1600×400. Up to 5 MB.</small>
                {profile.banner_asset_id && <label className="check"><input type="checkbox" name="remove_banner" /> Remove current banner</label>}
              </div>
            </div>
          </fieldset>

          <label>Display name<input name="displayName" required minLength={2} maxLength={80} defaultValue={profile.display_name} /></label>
          <label>Tagline<input name="tagline" maxLength={140} defaultValue={profile.tagline} placeholder="One line about what members get" /></label>
          <label>Category
            <select name="category" defaultValue={categories.includes(profile.category) ? profile.category : "other"}>{categories.map((category) => <option key={category}>{category}</option>)}</select>
          </label>
          <label>About<textarea name="bio" rows={7} maxLength={2000} defaultValue={profile.bio} placeholder="Tell members who you are and what they will get. Separate paragraphs with a blank line." /></label>
          <label>Support email<input name="supportEmail" type="email" maxLength={254} defaultValue={profile.support_email ?? ""} placeholder="support@your-domain.com" /></label>
          <label>Website<input name="websiteUrl" type="url" maxLength={300} defaultValue={profile.website_url ?? ""} placeholder="https://your-site.com" /></label>

          <fieldset>
            <legend>Links</legend>
            <p className="muted">Shown as buttons on your page. HTTPS addresses only. Leave a row empty to skip it.</p>
            <div className="link-rows">
              {links.map((link, index) => (
                <div className="link-row" key={link.id || `new-${index}`}>
                  <label>Label {index + 1}<input name="linkLabel" maxLength={40} defaultValue={link.label} placeholder="Instagram" /></label>
                  <label>Address {index + 1}<input name="linkUrl" type="url" maxLength={300} defaultValue={link.url} placeholder="https://" /></label>
                </div>
              ))}
            </div>
          </fieldset>
          <button className="primary-button" type="submit">Save profile</button>
        </form>
      </Panel>
    </ProductShell>
  );
}
