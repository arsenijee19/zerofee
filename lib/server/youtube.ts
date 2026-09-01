const idPattern = /^[a-zA-Z0-9_-]{11}$/;

export function parseYouTubeVideoId(input: string) {
  if (input.includes("<") || input.includes(">") || input.toLowerCase().includes("javascript:")) throw new Error("Unsafe YouTube input");
  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    throw new Error("Invalid YouTube URL");
  }
  const host = parsed.hostname.replace(/^www\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = parsed.pathname.split("/").filter(Boolean)[0] ?? null;
  if (host === "youtube.com" || host === "m.youtube.com") {
    if (parsed.pathname === "/watch") id = parsed.searchParams.get("v");
    if (parsed.pathname.startsWith("/shorts/") || parsed.pathname.startsWith("/embed/")) id = parsed.pathname.split("/")[2] ?? null;
  }
  if (!id || !idPattern.test(id)) throw new Error("Unsupported or malformed YouTube video ID");
  return id;
}

export function youtubeEmbedUrl(videoId: string) {
  if (!idPattern.test(videoId)) throw new Error("Invalid YouTube video ID");
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}
