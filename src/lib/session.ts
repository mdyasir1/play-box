let guestMode = false;

export function setGuestMode(enabled: boolean): void {
  guestMode = enabled;
}

export function isGuestMode(): boolean {
  return guestMode;
}

export const SESSION_CHANGE_EVENT = "playbox:session-change";

export function notifySessionChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
  }
}
