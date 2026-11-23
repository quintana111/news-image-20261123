// news-image-20261123 — entry point (Node 22, stdlib only).
// Copies the committed entry.png to /output/entry.png, deterministically.
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "entry.png");
const OUT_DIR = "/output";
const OUT = join(OUT_DIR, "entry.png");

const bytes = readFileSync(SRC);
mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(SRC, OUT);

const sha = createHash("sha256").update(bytes).digest("hex");

// Verify: the output must be byte-identical to the committed entry.png.
const written = readFileSync(OUT);
const writtenSha = createHash("sha256").update(written).digest("hex");
if (written.length !== bytes.length || writtenSha !== sha) {
  console.error(
    `VERIFY FAILED: output ${written.length} bytes sha256 ${writtenSha}, ` +
      `expected ${bytes.length} bytes sha256 ${sha}`,
  );
  process.exit(1);
}
console.log(`verified: output matches committed entry.png (${bytes.length} bytes, sha256 ${sha})`);
console.log(`wrote ${OUT}`);
