export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function colorDistance(color1: string, color2: string) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return null;
  }

  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );

  return distance;
}

export const extractUniqueFillColors = (svgString: string) => {
  const fillRegex = /fill="([^"]*)"/g;
  const matches = svgString.match(fillRegex);
  const colors = new Set();

  if (matches) {
    matches.forEach((match: any) => {
      const color = match.replace('fill="', "").replace('"', "");
      colors.add(color);
    });
  }

  return Array.from(colors);
};
