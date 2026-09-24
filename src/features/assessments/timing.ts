export const ASSESSMENT_DURATION_MINUTES = 30 as const;
export const ASSESSMENT_DURATION_SECONDS = ASSESSMENT_DURATION_MINUTES * 60;
export const TIMER_WARNING_SECONDS = [10 * 60, 5 * 60, 60] as const;

export function remainingSeconds(expiresAt: string, nowMs = Date.now()): number {
  const expiryMs = Date.parse(expiresAt);
  if (!Number.isFinite(expiryMs)) return 0;
  return Math.max(0, Math.ceil((expiryMs - nowMs) / 1000));
}

export function formatRemaining(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function warningForTransition(previous: number, current: number): number | null {
  return TIMER_WARNING_SECONDS.find((threshold) => previous > threshold && current <= threshold) ?? null;
}

export function serverClockOffset(serverNow: string, clientNowMs = Date.now()): number {
  const serverMs = Date.parse(serverNow);
  return Number.isFinite(serverMs) ? serverMs - clientNowMs : 0;
}
