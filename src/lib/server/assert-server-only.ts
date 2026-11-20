import "server-only";

export function assertServerRuntime(): void {
  if (typeof window !== "undefined") {
    throw new Error(
      "A server-only module was imported into client-side code. Move the import into a server component or route handler.",
    );
  }
}
