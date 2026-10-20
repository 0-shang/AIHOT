import sharp from 'sharp';

async function main() {
  const circleMask = Buffer.from('<svg width="512" height="512"><circle cx="256" cy="256" r="256" fill="#fff"/></svg>');
  const squircleMask = Buffer.from('<svg width="512" height="512"><rect width="512" height="512" rx="115" ry="115" fill="#fff"/></svg>');

  await sharp('temp_pristine_icon512.png')
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toFile('temp_test_pristine_circle.png');

  await sharp('temp_pristine_icon512.png')
    .composite([{ input: squircleMask, blend: 'dest-in' }])
    .png()
    .toFile('temp_test_pristine_squircle.png');

  console.log('Saved test pristine circle and squircle icons');
}

main().catch(console.error);
