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

export function prefetchImages(urls: readonly string[]) {
  for (const href of urls) {
    appendPrefetch(href, "image");
  }
}

export function prefetchAudio(href: string) {
  appendPrefetch(href, "audio");
}

export function prefetchOpenerPlaybackAssets() {
  prefetchImages(["/images/hero-background.png"]);
  prefetchAudio("/audio/wedding-music.mp3");
}
