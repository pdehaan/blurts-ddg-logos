import fs from "node:fs/promises";
import path from "node:path";
import bytes from "bytes";
import sizeOf from "image-size";

const LOGO_DIR = "logo_cache";
const BYTES_OPTS = {
  decimalPlaces: 1,
  unit: "KB",
  unitSeparator: " ",
};

const logos = await fs.readdir("logo_cache");

const errors = [];

for (const logo of logos.filter((logo) => logo.endsWith(".png"))) {
  const logoPath = path.join(LOGO_DIR, logo);
  try {
    const { width, height } = sizeOf(logoPath);
    const { size } = await fs.stat(logoPath);
    console.log(
      `${logo} | ${width}x${height} | ${bytes(size, BYTES_OPTS)}`
    );
  } catch (err) {
    errors.push(`[${logoPath}] ${err.message}`);
  }
}

console.error("\n\n" + errors.join("\n"));
