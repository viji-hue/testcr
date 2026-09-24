import { describe, expect, it } from "vitest";
import {
  ASSESSMENT_DURATION_SECONDS,
  formatRemaining,
  remainingSeconds,
  serverClockOffset,
  warningForTransition,
} from "./timing";
import { isAssessmentLanguage } from "./types";

describe("assessment timing", () => {
  it("uses a fixed thirty minute duration", () => {
    expect(ASSESSMENT_DURATION_SECONDS).toBe(1800);
  });

  it("restores remaining time from an authoritative expiry", () => {
    expect(remainingSeconds("2026-01-01T00:30:00.000Z", Date.parse("2026-01-01T00:10:00.000Z"))).toBe(1200);
    expect(remainingSeconds("2026-01-01T00:30:00.000Z", Date.parse("2026-01-01T00:31:00.000Z"))).toBe(0);
  });

  it("emits each warning only when its threshold is crossed", () => {
    expect(warningForTransition(601, 600)).toBe(600);
    expect(warningForTransition(600, 599)).toBeNull();
    expect(warningForTransition(301, 299)).toBe(300);
    expect(warningForTransition(61, 60)).toBe(60);
  });

  it("formats countdown and computes server offset", () => {
    expect(formatRemaining(65)).toBe("1:05");
    expect(serverClockOffset("2026-01-01T00:00:10.000Z", Date.parse("2026-01-01T00:00:00.000Z"))).toBe(10_000);
  });
});

describe("assessment language", () => {
  it("accepts only configured languages", () => {
    expect(isAssessmentLanguage("java")).toBe(true);
    expect(isAssessmentLanguage("javascript")).toBe(true);
    expect(isAssessmentLanguage("python")).toBe(false);
  });
});
