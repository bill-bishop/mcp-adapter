export const esc = (str: string) => str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
