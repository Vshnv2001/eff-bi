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
  const rgbBaseColor = hexToRgb(baseColor);
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
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max === min) {
    s = 0;
  } else {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

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
    const hue = (baseHue + i * 30) % 360;
    colors.push(`hsl(${hue}, 70%, 50%)`);
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

  colors.push(`hsl(${baseHue}, 70%, 50%)`);
  colors.push(`hsl(${(baseHue + 180) % 360}, 70%, 50%)`);

  for (let i = 2; i < count; i++) {
    const lightness = i % 2 === 0 ? 40 : 60;
    colors.push(`hsl(${baseHue}, 70%, ${lightness}%)`);
  }

  return colors;
}

function generateTriadicColors(baseColor: string, count: number): string[] {
  const rgbBaseColor = hexToRgb(baseColor);
  const [baseHue] = rgbToHsl(rgbBaseColor);
  const colors: string[] = [];

  for (let i = 0; i < 3; i++) {
    const hue = (baseHue + i * 120) % 360;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }

  for (let i = 3; i < count; i++) {
    const hue = (baseHue + (i % 3) * 120) % 360;
    const lightness = 40 + (i % 2) * 10;
    colors.push(`hsl(${hue}, 70%, ${lightness}%)`);
  }

  return colors;
}
