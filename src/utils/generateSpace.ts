export default function generateSpace(d: number): string {
  let spacing = '';
  for(let i = 0; i < d; i++) {
    spacing = `${spacing}\t`;
  }
  return spacing;
}