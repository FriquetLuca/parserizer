const pattern = /^(public|private) something (\w+)(?: \w+)*\(/;

const input = 'public something theName(...)';
const match = input.match(pattern);

if (match) {
  console.log(match)
  const visibility = match[1];
  const secondWord = match[2];

  console.log('Visibility:', visibility);
  console.log('Second word:', secondWord);
} else {
  console.log('No match found.');
}