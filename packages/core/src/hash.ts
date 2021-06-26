export function getHashCode(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++)
    hash = Math.imul(31, hash) + s.charCodeAt(i) | 0;

  return hash;
}

export function getHashString(s: string): string {
  return Math.abs(getHashCode(s)).toString();
}

