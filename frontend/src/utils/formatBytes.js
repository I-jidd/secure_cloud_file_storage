export function formatBytes(bytes) {
  if (bytes === 0) {
    return "0 B";
  }

  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const safeUnitIndex = Math.min(unitIndex, units.length - 1);
  const value = bytes / Math.pow(1024, safeUnitIndex);

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[safeUnitIndex]}`;
}
