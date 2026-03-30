import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const EQUIPO_DIR = '/Users/marcos/Sites/woranz-design/design/equipo';
const OUTPUT_DIR = path.join(__dirname, '../public/images/team');

// Avatar configuration
const AVATAR_SIZE = 156; // 3x for 52px display (retina)

// Photo configurations with manual face detection offsets
// These values are percentages from top-left after rotation
// Format: { name, file, faceX%, faceY%, cropSize% }
// Larger cropSizePercent = more zoomed out = shows more of the face
const photos = [
  {
    name: 'carolina',
    file: 'Carolina.JPG',
    faceXPercent: 0.5,
    faceYPercent: 0.32,
    cropSizePercent: 0.55 // More zoomed out to show full face
  },
  {
    name: 'charlie',
    file: 'Charlie.JPG',
    faceXPercent: 0.5,
    faceYPercent: 0.30,
    cropSizePercent: 0.55
  },
  {
    name: 'gonzalo',
    file: 'Gonzalo.JPG',
    faceXPercent: 0.5,
    faceYPercent: 0.32,
    cropSizePercent: 0.50
  },
  {
    name: 'martina',
    file: 'Martina.JPG',
    faceXPercent: 0.5,
    faceYPercent: 0.30,
    cropSizePercent: 0.55
  }
];

async function processPhoto(config) {
  const inputPath = path.join(EQUIPO_DIR, config.file);
  const outputPath = path.join(OUTPUT_DIR, `${config.name}.webp`);

  console.log(`Processing ${config.file}...`);

  // Load image and auto-orient based on EXIF
  const image = sharp(inputPath).rotate(); // Auto-rotate based on EXIF

  // Get metadata after rotation
  const metadata = await image.toBuffer().then(buffer => sharp(buffer).metadata());
  const { width, height } = metadata;

  console.log(`  Dimensions after rotation: ${width}x${height}`);

  // Calculate crop parameters
  const cropSize = Math.floor(Math.min(width, height) * config.cropSizePercent);
  const centerX = Math.floor(width * config.faceXPercent);
  const centerY = Math.floor(height * config.faceYPercent);

  // Calculate top-left corner of crop, ensuring it stays within bounds
  let left = Math.max(0, centerX - Math.floor(cropSize / 2));
  let top = Math.max(0, centerY - Math.floor(cropSize / 2));

  // Adjust if crop would go out of bounds
  if (left + cropSize > width) left = width - cropSize;
  if (top + cropSize > height) top = height - cropSize;

  console.log(`  Crop: ${cropSize}x${cropSize} at (${left}, ${top})`);

  // Process: rotate, crop, resize
  await sharp(inputPath)
    .rotate() // Auto-rotate based on EXIF
    .extract({ left, top, width: cropSize, height: cropSize })
    .resize(AVATAR_SIZE, AVATAR_SIZE, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 90 })
    .toFile(outputPath);

  console.log(`  Saved to ${outputPath}`);
  return outputPath;
}

async function main() {
  // Ensure output directory exists
  const fs = await import('fs');
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created directory: ${OUTPUT_DIR}`);
  }

  console.log('Processing team photos for avatars...\n');

  for (const photo of photos) {
    try {
      await processPhoto(photo);
    } catch (error) {
      console.error(`Error processing ${photo.file}:`, error.message);
    }
  }

  console.log('\nDone!');
}

main();
