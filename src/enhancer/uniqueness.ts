export function overlapScore(a: string, b: string): number {
  const tokenize = (s: string) => new Set(s.toLowerCase().match(/\b\w{3,}\b/g) ?? []);
  const setA = tokenize(a);
  const setB = tokenize(b);
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = [...setA].filter(w => setB.has(w)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}
