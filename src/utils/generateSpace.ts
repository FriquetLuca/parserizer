export function generateSpace(count: number) {
  let spaces = '';
  if(count <= 0) {
    return spaces;
  }

  let base = "\t";
  while(count > 0) {
    if(count % 2 === 1) {
      spaces = `${spaces}${base}`;
    }
    count = Math.floor(count / 2);
    base = `${base}${base}`;
  }
  
  return spaces;
}