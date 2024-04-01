export const generateColorVariantsArray = (
  colorIdMap: any,
  productDetails: any
) => {
  let colorVariants: {
    id: any;
    label: string;
    option: string;
    color: string;
  }[] = [];
  // const productLength = productDetails.options.length;
  // let id = productLength + 1;

  // colorIdMap.forEach((value: any, key: any, index: any) => {
  //   const colorMatcher = value === "option" + id;
  //   let color = null;
  //   if (colorMatcher) {
  //     color = key;
  //   }
  //   console.log(key, value, colorMatcher, "key value-----------------");
  //   colorVariants.push({
  //     id: id,
  //     label: `Pattern Color ${id}`,
  //     option: randomColors,
  //     color: color,
  //   });
  //   id++;
  // });
  // return colorVariants;
  const productLength = productDetails.options.length;
  let id = productLength + 1;

  Object.entries(colorIdMap).forEach(([key, value]: [any, any]) => {
    // const colorMatcher = value === "option" + id;
    // let color = null;
    // console.log(colorMatcher, key, value, "colorMatcher,key,value");
    // if (colorMatcher) {
    //   color = value;
    // }
    colorVariants.push({
      id: id,
      label: `Pattern Color ${id}`,
      option: randomColors, // Update this to use random colors as per your requirement
      color: value,
    });
    id++;
  });
  return colorVariants;
};

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

export const randomColors = `#FF6347 - Tomato,#4682B4 - Steel Blue,#8A2BE2 - Blue Violet,#20B2AA - Light Sea Green,#CD5C5C - Indian Red,#32CD32 - Lime Green,#F08080 - Light Coral,#4169E1 - Royal Blue,#DC143C - Crimson,#00FFFF - Cyan,#FF4500 - Orange Red,#BA55D3 - Medium Orchid,#2E8B57 - Sea Green,#800000 - Maroon,#FF8C00 - Dark Orange,#FF69B4 - Hot Pink,#B0E0E6 - Powder Blue,#9370DB - Medium Purple,#48D1CC - Medium Turquoise,#800080 - Purple,#20B2AA - Light Sea Green,#00FA9A - Medium Spring Green,#FFD700 - Gold,#228B22 - Forest Green,#8B008B - Dark Magenta,#808080 - Gray,#000080 - Navy,#DAA520 - Goldenrod,#006400 - Dark Green,#FF6347 - Tomato,#708090 - Slate Gray,#7CFC00 - Lawn Green,#4B0082 - Indigo,#00BFFF - Deep Sky Blue,#FFA07A - Light Salmon,#8B0000 - Dark Red,#FF1493 - Deep Pink,#ADFF2F - Green Yellow,#6495ED - Cornflower Blue,#800000 - Maroon,#D2691E - Chocolate,#20B2AA - Light Sea Green,#FF4500 - Orange Red,#DAA520 - Goldenrod,#008080 - Teal,#0000CD - Medium Blue,#FF8C00 - Dark Orange,#7FFF00 - Chartreuse,#48D1CC - Medium Turquoise,#FF0000 - Red
`;
