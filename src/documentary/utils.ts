export const pad2 = (value: number) => String(value).padStart(2, "0");

export const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const chunkWords = <T,>(items: T[], size: number) => {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
};

export const toSrtTime = (seconds: number) => {
  const ms = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const millis = ms % 1000;
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(secs)},${String(millis).padStart(3, "0")}`;
};
