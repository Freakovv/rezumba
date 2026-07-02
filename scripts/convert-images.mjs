import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public");

const sources = [
  { input: "hero-bg.png", output: "hero-bg.avif", options: { quality: 62 } },
  {
    input: "hero-figure-cutout.png",
    output: "hero-figure-cutout.avif",
    options: { quality: 68 },
  },
];

async function convertHeroAssets() {
  for (const { input, output, options } of sources) {
    const inputPath = path.join(publicDir, input);
    const outputPath = path.join(publicDir, output);

    if (!fs.existsSync(inputPath)) {
      console.warn(`skip: ${input} not found`);
      continue;
    }

    await sharp(inputPath).avif({ effort: 6, ...options }).toFile(outputPath);

    const before = fs.statSync(inputPath).size;
    const after = fs.statSync(outputPath).size;
    console.log(`${input} → ${output} (${formatKb(before)} → ${formatKb(after)})`);
  }
}

async function createOgImage() {
  const inputPath = path.join(publicDir, "hero-bg.avif");
  const fallbackInput = path.join(publicDir, "hero-bg.png");

  const source = fs.existsSync(inputPath)
    ? inputPath
    : fs.existsSync(fallbackInput)
      ? fallbackInput
      : null;

  if (!source) {
    console.warn("skip: no hero source found for og images");
    return;
  }

  const resized = sharp(source).resize(1200, 630, {
    fit: "cover",
    position: "centre",
  });

  await resized.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(publicDir, "og.jpg"));
  await resized.clone().avif({ quality: 58, effort: 6 }).toFile(path.join(publicDir, "og.avif"));

  console.log(`og.jpg created (${formatKb(fs.statSync(path.join(publicDir, "og.jpg")).size)})`);
  console.log(`og.avif created (${formatKb(fs.statSync(path.join(publicDir, "og.avif")).size)})`);
}

function formatKb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

await convertHeroAssets();
await createOgImage();
