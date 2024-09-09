export function joinTimestamp(join) {
  if (!join) {
    return {};
  }
  const now = new Date().getTime();

  return { _t: now };
}
