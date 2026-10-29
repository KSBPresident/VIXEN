export function secondsUntilStoryExpires(expiresAt: string): number {
  return Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
}
