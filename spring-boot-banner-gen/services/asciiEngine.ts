import { AsciiOptions, CHAR_SETS } from '../types';
// @ts-ignore
import figlet from 'figlet';

// Cache for loaded fonts to prevent re-fetching
const loadedFonts = new Set<string>();

/**
 * Manually loads a font from the CDN and registers it with Figlet.
 * This avoids issues with Figlet's internal fetch mechanism and allows
 * proper URL encoding for fonts with spaces.
 */
const loadFont = async (fontName: string): Promise<void> => {
  if (loadedFonts.has(fontName)) {
    return;
  }

  // Encode font name to handle spaces (e.g., "3D Diagonal" -> "3D%20Diagonal")
  const url = `https://cdn.jsdelivr.net/npm/figlet@1.7.0/fonts/${encodeURIComponent(fontName)}.flf`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load font "${fontName}" (${response.status} ${response.statusText})`);
    }
    const fontData = await response.text();
    
    // Parse and register the font manually
    figlet.parseFont(fontName, fontData);
    loadedFonts.add(fontName);
  } catch (error) {
    console.error(`Error loading font ${fontName}:`, error);
    throw error;
  }
};

/**
 * Converts text to stylized ASCII using FIGlet.
 * Ensure the font is loaded before rendering.
 */
export const generateFigletAscii = async (text: string, font: string): Promise<string> => {
  // Pre-load the font
  await loadFont(font);

  return new Promise((resolve, reject) => {
    figlet.text(text, { font: font, width: 90, whitespaceBreak: true }, (err: any, data: string) => {
      if (err) {
        console.error('Figlet render error:', err);
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

/**
 * Converts an image file to an ASCII string using HTML Canvas.
 */
export const convertImageToAscii = (
  file: File,
  options: AsciiOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const ascii = processImage(img, options);
          resolve(ascii);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = (e) => reject(new Error("Failed to load image"));
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  });
};

const processImage = (img: HTMLImageElement, options: AsciiOptions): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Canvas context unavailable");
  }

  // Calculate dimensions
  // Font aspect ratio correction (characters are usually approx 0.55 width of height)
  const fontAspectRatio = 0.55; 
  const width = options.width;
  const height = Math.floor(width * (img.height / img.width) * fontAspectRatio);

  canvas.width = width;
  canvas.height = height;

  // Draw image to canvas with resizing
  ctx.drawImage(img, 0, 0, width, height);
  
  // Get pixel data
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  let asciiStr = '';
  const charSet = CHAR_SETS[options.charSet];
  const charSetLen = charSet.length;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const offset = (i * width + j) * 4;
      const r = pixels[offset];
      const g = pixels[offset + 1];
      const b = pixels[offset + 2];
      const a = pixels[offset + 3];

      // Alpha check
      if (a === 0) {
        asciiStr += ' ';
        continue;
      }

      // Grayscale conversion
      let gray = (r * 0.299 + g * 0.587 + b * 0.114);

      // Apply contrast
      // Formula: factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
      // contrast range usually -128 to 128. Let's map our 0.5-2 input roughly.
      const contrastFactor = options.contrast; 
      gray = ((gray - 128) * contrastFactor) + 128 + options.brightness;

      // Clamp
      gray = Math.max(0, Math.min(255, gray));

      // Invert if needed
      if (options.inverted) {
        gray = 255 - gray;
      }

      // Map to char
      const charIndex = Math.floor((gray / 255) * (charSetLen - 1));
      asciiStr += charSet[charSetLen - 1 - charIndex];
    }
    asciiStr += '\n';
  }

  return asciiStr;
};