// Turn one generated source image into the site's featured-image files.
//
//   node scripts/featured-image-process.mjs <source.png|jpg> <key>
//
// Writes, centre-cropped:
//   public/images/featured/<key>.webp      1200x675 (16:9, page display)
//   public/images/featured/<key>-640.webp   640x360 (16:9, small screens)
//   public/images/og/<key>.jpg              1200x630 (social share card)
// Prints one JSON line with the written paths and byte sizes.
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [src, key] = process.argv.slice(2);
if (!src || !key || !/^[a-z0-9-]+$/.test(key)) {
  console.error("usage: featured-image-process.mjs <source image> <key: a-z0-9 and dashes>");
  process.exit(2);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const featuredDir = path.join(root, "public/images/featured");
const ogDir = path.join(root, "public/images/og");
mkdirSync(featuredDir, { recursive: true });
mkdirSync(ogDir, { recursive: true });

const crop = (w, h) => sharp(src).rotate().resize(w, h, { fit: "cover", position: "attention" });
const out = {
  large: path.join(featuredDir, `${key}.webp`),
  small: path.join(featuredDir, `${key}-640.webp`),
  og: path.join(ogDir, `${key}.jpg`),
};

await crop(1200, 675).webp({ quality: 78, effort: 5 }).toFile(out.large);
await crop(640, 360).webp({ quality: 76, effort: 5 }).toFile(out.small);
await crop(1200, 630).jpeg({ quality: 80, mozjpeg: true }).toFile(out.og);

console.log(
  JSON.stringify({
    key,
    files: Object.fromEntries(
      Object.entries(out).map(([k, p]) => [k, { path: path.relative(root, p), bytes: statSync(p).size }]),
    ),
  }),
);
