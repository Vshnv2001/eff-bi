// colorUtils.tsx

type ColorTheme = "homogeneous" | "analogous" | "complementary" | "triadic";

export function generateColors(
  count: number,
  theme: ColorTheme,
  baseColor: string
): string[] {
  const baseColors = {
    homogeneous: generateHomogeneousColors(baseColor, count),
    analogous: generateAnalogousColors(baseColor, count),
    complementary: generateComplementaryColors(baseColor, count),
    triadic: generateTriadicColors(baseColor, count),
  };

  return baseColors[theme] || baseColors["homogeneous"];
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace(/^#/, "");

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
}

function generateHomogeneousColors(baseColor: string, count: number): string[] {
  const rgbBaseColor = hexToRgb(baseColor); // Convert hex to RGB
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const factor = i / count;
    const color = rgbBaseColor.map((value) => Math.round(value * (1 - factor)));
    colors.push(`rgb(${color.join(",")})`);
  }

  return colors;
}

function rgbToHsl(rgb: number[]): number[] {
  const [r, g, b] = rgb.map((value) => value / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, // Initialize with a default value
    s = 0, // Initialize with a default value
    l = (max + min) / 2;

  if (max === min) {
    // If max equals min, the color is achromatic
    s = 0; // Saturation is 0
  } else {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    // Calculate hue based on which RGB component is the max
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function generateAnalogousColors(baseColor: string, count: number): string[] {
  const rgbBaseColor = hexToRgb(baseColor);
  const [baseHue] = rgbToHsl(rgbBaseColor);
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const hue = (baseHue + i * 30) % 360; // Shift hue for analogous colors
    colors.push(`hsl(${hue}, 70%, 50%)`); // HSL for vibrant colors
  }

  return colors;
}

function generateComplementaryColors(
  baseColor: string,
  count: number
): string[] {
  const rgbBaseColor = hexToRgb(baseColor);
  const [baseHue] = rgbToHsl(rgbBaseColor);
  const colors: string[] = [];

  colors.push(`hsl(${baseHue}, 70%, 50%)`); // Base color
  colors.push(`hsl(${(baseHue + 180) % 360}, 70%, 50%)`); // Complementary color

  // Generate additional colors by modifying lightness
  for (let i = 2; i < count; i++) {
    const lightness = i % 2 === 0 ? 40 : 60; // Alternate between two lightness values
    colors.push(`hsl(${baseHue}, 70%, ${lightness}%)`);
  }

  return colors;
}

function generateTriadicColors(baseColor: string, count: number): string[] {
  const rgbBaseColor = hexToRgb(baseColor);
  const [baseHue] = rgbToHsl(rgbBaseColor);
  const colors: string[] = [];

  for (let i = 0; i < 3; i++) {
    const hue = (baseHue + i * 120) % 360; // Shift hue for triadic colors
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }

  // Generate additional colors by adjusting the lightness
  for (let i = 3; i < count; i++) {
    const hue = (baseHue + (i % 3) * 120) % 360;
    const lightness = 40 + (i % 2) * 10; // Alternate lightness
    colors.push(`hsl(${hue}, 70%, ${lightness}%)`);
  }

  return colors;
}
