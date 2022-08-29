const fs = require('fs/promises');
const sharp = require('sharp');

async function checkMaxImageSize(image) {
  const { size } = await image.metadata();

  const sizeInKBytes = size / 1024;

  return sizeInKBytes < 4000;
}

async function resizeImage(image) {
  const { width, height, size } = await image.metadata();

  const sizeInKBytes = size / 1024;

  const maxSizeInKBytes = 4000;

  const resizePercentage = maxSizeInKBytes / sizeInKBytes;

  const resizeConfig = {
    width: parseInt(width * resizePercentage)
  };

  if (height > width) {
    delete resizeConfig.width;
    resizeConfig.height = parseInt(height * resizePercentage);
  }

  return image.resize(resizeConfig);
}

(async () => {
  const originalBuffer = await fs.readFile('./image4.jpeg');

  const originalImage = await sharp(originalBuffer);

  if (await checkMaxImageSize(originalImage)) {
    return originalImage.toBuffer();
  }

  const resizedBuffer = await originalImage.resize().toBuffer();

  const image = await sharp(resizedBuffer);

  if (await checkMaxImageSize(image)) {
    return image.toBuffer();
  }

  const destPath = `./${Date.now()}.jpeg`;

  const res = await resizeImage(image);

  await res.toFile(destPath)

})().then(process.exit);