import { readFlash } from "@/lib/server/flash";

export async function Flash() {
  const flash = await readFlash();
  if (!flash) return null;
  return (
    <div className={`flash ${flash.type}`} role={flash.type === "error" ? "alert" : "status"}>
      <span aria-hidden="true">{flash.type === "error" ? "!" : "✓"}</span>
      <p>{flash.message}</p>
    </div>
  );
}
