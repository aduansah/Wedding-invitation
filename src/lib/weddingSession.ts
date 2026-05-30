const INTRO_KEY = "wedding-intro-done";
const MUSIC_TIME_KEY = "wedding-music-time";
const MUSIC_PLAYING_KEY = "wedding-music-playing";
const MUSIC_PAUSE_SIGNAL_KEY = "wedding-music-pause-signal";

export function isIntroComplete(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(INTRO_KEY) === "1";
}

export function markIntroComplete(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(INTRO_KEY, "1");
}

export function saveMusicState(currentTime: number, wasPlaying: boolean): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(MUSIC_TIME_KEY, String(currentTime));
  sessionStorage.setItem(MUSIC_PLAYING_KEY, wasPlaying ? "1" : "0");
}

export function getMusicResumeState(): {
  currentTime: number;
  wasPlaying: boolean;
} | null {
  if (typeof window === "undefined") return null;

  const wasPlaying = sessionStorage.getItem(MUSIC_PLAYING_KEY) === "1";
  if (!wasPlaying) return null;

  const rawTime = sessionStorage.getItem(MUSIC_TIME_KEY);
  const currentTime = rawTime ? Number.parseFloat(rawTime) : 0;

  return {
    currentTime: Number.isFinite(currentTime) ? currentTime : 0,
    wasPlaying: true,
  };
}

export function clearMusicResumeState(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(MUSIC_TIME_KEY);
  sessionStorage.removeItem(MUSIC_PLAYING_KEY);
}

/** Notifies other tabs (e.g. main site) to pause background music. */
export function signalMusicPause(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MUSIC_PAUSE_SIGNAL_KEY, String(Date.now()));
}

export function getMusicPauseSignalKey(): string {
  return MUSIC_PAUSE_SIGNAL_KEY;
}
