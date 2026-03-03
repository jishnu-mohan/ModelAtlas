// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("theme logic", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
  });

  it("applies dark class when localStorage is dark", () => {
    localStorage.setItem("theme", "dark");
    applyTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class when localStorage is light", () => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "light");
    applyTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("uses system preference when no localStorage value", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
    applyTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});

function applyTheme() {
  const stored = localStorage.getItem("theme");
  if (stored === "dark") {
    document.documentElement.classList.add("dark");
  } else if (stored === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
  }
}
