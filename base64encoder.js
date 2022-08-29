const { log } = require('console');
const fs = require('fs/promises');
const sharp = require('sharp');

(async () => {
  const originalBuffer = await fs.readFile('./image.jpeg');

  const base64 = `data:image/${'jpeg'};base64,${originalBuffer.toString('base64')}`

  await fs.writeFile('./base64.txt', base64);

})().then(process.exit);