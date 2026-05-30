const prefetched = new Set<string>();

function appendPrefetch(href: string, as: string) {
  if (prefetched.has(href)) return;
  prefetched.add(href);

  if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = as;
  link.href = href;
  document.head.appendChild(link);
}

export function prefetchOpenerPlaybackAssets() {
  appendPrefetch("/images/hero-background.png", "image");
  appendPrefetch("/audio/wedding-music.mp3", "audio");
}
