// Оптимизация изображений услуг и лого брендов под реальные размеры контейнеров.
// Генерирует две версии: card (для карточек) и full (для страницы услуги).
// Run: node scripts/optimize-service-images.mjs
import sharp from 'sharp';
import { readdir, mkdir, rename, copyFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const servicesDir = join(__dirname, '..', 'public', 'images', 'services');
const backupDir = join(servicesDir, '_originals');

await mkdir(backupDir, { recursive: true });

const files = (await readdir(servicesDir)).filter(
  f => f.endsWith('.webp') && !f.startsWith('logo_')
);

// Конфиг: card — для ServiceCard (h-48=192px, ~480px wide), full — для [slug].astro
const variants = [
  { suffix: '-card', width: 480, height: 320, quality: 72 },
  { suffix: '-full', width: 800, height: 500, quality: 78 },
];

let totalOriginal = 0;
let totalOptimized = 0;

for (const file of files) {
  const src = join(servicesDir, file);
  const backup = join(backupDir, file);

  // Бэкап оригинала (один раз)
  try {
    await copyFile(src, backup);
  } catch {}

  const fs = await import('node:fs/promises');
  const origStat = await fs.stat(src);
  totalOriginal += origStat.size;

  // Генерируем варианты
  for (const v of variants) {
    const outName = file.replace('.webp', `${v.suffix}.webp`);
    const outPath = join(servicesDir, outName);
    await sharp(backup)
      .resize(v.width, v.height, { fit: 'cover', position: 'center' })
      .webp({ quality: v.quality })
      .toFile(outPath);
    const st = await fs.stat(outPath);
    totalOptimized += st.size;
    console.log(`${outName.padEnd(36)} ${v.width}x${v.height}  ${(st.size / 1024).toFixed(1)} KB`);
  }
}

// Лого брендов: только уменьшаем до 200x140 (контейнер h-36=144px)
const logoFiles = (await readdir(servicesDir)).filter(
  f => f.startsWith('logo_') && f.endsWith('.webp')
);
for (const file of logoFiles) {
  const src = join(servicesDir, file);
  const backup = join(backupDir, file);
  try { await copyFile(src, backup); } catch {}

  const fs = await import('node:fs/promises');
  const origStat = await fs.stat(src);
  totalOriginal += origStat.size;

  const outName = file.replace('.webp', '-sm.webp');
  const outPath = join(servicesDir, outName);
  await sharp(backup)
    .resize(200, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 80 })
    .toFile(outPath);
  const st = await fs.stat(outPath);
  totalOptimized += st.size;
  console.log(`${outName.padEnd(36)} 200x140   ${(st.size / 1024).toFixed(1)} KB`);
}

console.log(`\n--- Итого ---`);
console.log(`Оригиналы: ${(totalOriginal / 1024).toFixed(1)} KB`);
console.log(`Оптимизировано: ${(totalOptimized / 1024).toFixed(1)} KB`);
console.log(`Экономия: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(0)}%`);
console.log(`\nОригиналы сохранены в: public/images/services/_originals/`);
