// Generates PWA PNG icons from a branded SVG.
// Run: node scripts/generate-icons.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicIconsDir = join(__dirname, '..', 'public', 'icons');

// Branded icon: orange gradient rounded square + white wrench
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <g transform="translate(128,128) scale(10.6667)" fill="none" stroke="#0b0f19" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </g>
</svg>`;

const sizes = [
  { name: 'apple-touch-icon-180.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-512-maskable.png', size: 512, maskable: true },
];

await mkdir(publicIconsDir, { recursive: true });

for (const { name, size, maskable } of sizes) {
  const svg = maskable
    ? iconSvg.replace('<rect width="512" height="512" rx="112"', '<rect width="512" height="512" rx="0"')
    : iconSvg;
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(join(publicIconsDir, name));
  console.log(`Generated: public/icons/${name} (${size}x${size})`);
}

// Also generate favicon PNG (32x32) for broader compatibility
await sharp(Buffer.from(iconSvg))
  .resize(32, 32)
  .png()
  .toFile(join(__dirname, '..', 'public', 'favicon-32.png'));
console.log('Generated: public/favicon-32.png (32x32)');

console.log('All icons generated successfully.');
