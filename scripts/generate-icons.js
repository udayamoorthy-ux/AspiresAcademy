import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePNG(width, height, drawFn) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const rowSize = width * 4;
  const rawData = Buffer.alloc(height * (rowSize + 1));
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Drawing function for ASPIRES Academy brand icon
function drawAspiresLogo(x, y, width, height, isMaskable = false) {
  // Normalize coords to [-1, 1]
  const scale = isMaskable ? 0.72 : 0.88;
  const cx = width / 2;
  const cy = height / 2;
  const nx = ((x - cx) / (width / 2)) / scale;
  const ny = ((y - cy) / (height / 2)) / scale;
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Deep premium navy gradient background
  const bgGrad = (y / height);
  const bgR = Math.round(15 + bgGrad * 10);
  const bgG = Math.round(23 + bgGrad * 15);
  const bgB = Math.round(42 + bgGrad * 25);

  // If outside circle in non-maskable or in rounded rect
  if (!isMaskable && dist > 0.98) {
    // Subtle antialiased edge
    if (dist <= 1.0) {
      const alpha = Math.round((1 - (dist - 0.98) / 0.02) * 255);
      return [bgR, bgG, bgB, alpha];
    }
    return [0, 0, 0, 0];
  }

  // Draw Graduation Cap / Academy Torch
  // Cap Diamond: Top peak (0, -0.42), Left (-0.58, -0.2), Right (0.58, -0.2), Bottom (0, 0.02)
  const isCapTop = (ny >= -0.42 && ny <= 0.02) &&
    (Math.abs(nx) <= (ny <= -0.2 ? (ny + 0.42) * 2.6 : (0.02 - ny) * 2.6));

  // Cap Skull base: -0.28 <= nx <= 0.28 and 0.0 <= ny <= 0.28
  const isCapBase = (Math.abs(nx) <= 0.32 && ny >= -0.05 && ny <= 0.25) &&
    (Math.abs(nx) <= 0.28 || (ny >= 0.05 && Math.abs(nx) <= 0.32));

  // Golden Torch / Flame / Star emblem in the center (ny between -0.3 and 0.1)
  const flameDist = Math.sqrt(nx * nx * 1.5 + (ny + 0.15) * (ny + 0.15));
  const isFlame = flameDist < 0.22 && (ny < 0.05);

  if (isFlame) {
    // Glowing radiant amber / gold
    return [245, 158, 11, 255]; // Amber 500
  }

  if (isCapTop) {
    // Golden border or crisp white/emerald cap
    const edgeDist = Math.min(
      Math.abs(ny - (-0.42)),
      Math.abs(ny - 0.02),
      Math.abs(Math.abs(nx) - (ny <= -0.2 ? (ny + 0.42) * 2.6 : (0.02 - ny) * 2.6))
    );
    if (edgeDist < 0.04) {
      return [251, 191, 36, 255]; // Gold outline
    }
    return [248, 250, 252, 255]; // White cap top
  }

  if (isCapBase) {
    return [226, 232, 240, 255]; // Slate-200 base
  }

  // Tassel hanging to right: nx from 0.0 to 0.45, ny around -0.1 to 0.18
  const tasselX = 0.38;
  const isTassel = (Math.abs(nx - tasselX) < 0.035 && ny >= -0.2 && ny <= 0.22);
  if (isTassel) {
    return [245, 158, 11, 255]; // Amber gold tassel
  }

  // Golden Ring / Accent arc around icon
  if (dist > 0.86 && dist < 0.93) {
    return [245, 158, 11, 220];
  }

  return [bgR, bgG, bgB, 255];
}

const outDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate PWA Icons
console.log('Generating PWA icons in /public...');

// 1. 192x192
const pwa192 = generatePNG(192, 192, (x, y, w, h) => drawAspiresLogo(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), pwa192);

// 2. 512x512
const pwa512 = generatePNG(512, 512, (x, y, w, h) => drawAspiresLogo(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), pwa512);

// 3. Maskable 512x512 with safe-zone margin
const pwaMaskable = generatePNG(512, 512, (x, y, w, h) => drawAspiresLogo(x, y, w, h, true));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), pwaMaskable);

// 4. Apple Touch Icon 180x180
const appleIcon = generatePNG(180, 180, (x, y, w, h) => drawAspiresLogo(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), appleIcon);

// 5. Favicon 48x48
const faviconPng = generatePNG(48, 48, (x, y, w, h) => drawAspiresLogo(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'favicon.png'), faviconPng);
fs.writeFileSync(path.join(outDir, 'favicon.ico'), faviconPng);

// 6. SVG Icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)" />
  <!-- Golden outer ring -->
  <circle cx="256" cy="256" r="220" stroke="url(#goldGrad)" stroke-width="8" stroke-dasharray="16 8" opacity="0.6" />
  <!-- Mortarboard Cap -->
  <polygon points="256,120 420,180 256,240 92,180" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="8" />
  <path d="M160,225 L160,300 C160,335 352,335 352,300 L352,225" fill="#f1f5f9" stroke="url(#goldGrad)" stroke-width="6" />
  <!-- Tassel -->
  <path d="M400,185 L425,270 L410,270" stroke="url(#goldGrad)" stroke-width="6" stroke-linecap="round" />
  <circle cx="417" cy="275" r="8" fill="url(#goldGrad)" />
  <!-- Star / Torch Center -->
  <circle cx="256" cy="285" r="28" fill="url(#goldGrad)" />
  <polygon points="256,230 264,250 286,252 270,266 274,288 256,276 238,288 242,266 226,252 248,250" fill="#ffffff" />
</svg>`;
fs.writeFileSync(path.join(outDir, 'icon.svg'), svgIcon);

console.log('PWA icons successfully created!');
