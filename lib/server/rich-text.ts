import sanitizeHtml from "sanitize-html";

const allowed: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "em", "u", "s", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "code", "pre", "hr", "a"],
  allowedAttributes: { a: ["href", "title", "rel", "target"] },
  allowedSchemes: ["https", "mailto"],
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
  transformTags: {
    a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, rel: "nofollow noopener noreferrer ugc", target: "_blank" } })
  }
};

const escapes: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (char) => escapes[char]);
}

/** Server-side allowlist sanitizer. Applied on write and again on render (defence in depth). */
export function sanitizeRichText(input: string) {
  return sanitizeHtml(input, allowed);
}

/**
 * Posts may be stored as plain text (paragraphs separated by blank lines) or as limited HTML.
 * Plain text is escaped and auto-linked; HTML goes through the allowlist.
 */
export function renderBodyHtml(body: string) {
  if (/<\/?[a-z][\s\S]*>/i.test(body)) return sanitizeRichText(body);
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>").replace(/\bhttps:\/\/[^\s<]+/g, (url) => `<a href="${url}" rel="nofollow noopener noreferrer ugc" target="_blank">${url}</a>`)}</p>`)
    .join("");
}

export function plainTextPreview(body: string, max = 160) {
  const text = sanitizeHtml(body, { allowedTags: [], allowedAttributes: {} }).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
