import type { Metadata } from "next";
import { PostForm } from "@/components/post-form";
import { Panel, ProductShell } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { listCreatorMedia } from "@/lib/server/media-service";
import { getCreatorForUser, listCreatorTiers } from "@/lib/server/route-data";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return <ProductShell kind="creator" title="New post" user={user}><Panel title="Create your profile first"><a className="primary-button" href="/creator/application">Start application</a></Panel></ProductShell>;
  const [tiers, assets] = await Promise.all([listCreatorTiers(creator.id), listCreatorMedia(creator.id)]);
  return <ProductShell kind="creator" title="New post" user={user}><Panel title="Write a post"><PostForm creatorId={creator.id} tiers={tiers} assets={assets} /></Panel></ProductShell>;
}
