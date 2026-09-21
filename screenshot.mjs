import puppeteer from 'puppeteer';
import { mkdir, readdir } from 'node:fs/promises';

const url = process.argv[2];
const label = process.argv[3];
const width = parseInt(process.argv[4], 10) || 1440;
const height = parseInt(process.argv[5], 10) || 900;

if (!url) {
  console.error('Usage: node screenshot.mjs <url> [label] [width] [height]');
  process.exit(1);
}

const dir = './temporary screenshots';
await mkdir(dir, { recursive: true });

const existing = await readdir(dir).catch(() => []);
const nums = existing
  .map((f) => f.match(/^screenshot-(\d+)/))
  .filter(Boolean)
  .map((m) => parseInt(m[1], 10));
const next = nums.length ? Math.max(...nums) + 1 : 1;

const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath = `${dir}/${filename}`;

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width, height });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outPath}`);
