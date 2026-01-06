export const truncate = (str, len) =>
  str.length < len ? str : str.slice(0, len) + "...";
