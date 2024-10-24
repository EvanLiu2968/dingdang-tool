// hex 转 rgba
export function hexToRgba(hexValue, opacity = 1) {
  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var hex = hexValue.replace(rgx, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!rgb) {
    return hexValue;
  }
  var r = parseInt(rgb[1], 16);
  var g = parseInt(rgb[2], 16);
  var b = parseInt(rgb[3], 16);
  var rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')'
  // console.log(hexValue, opacity, rgba)
  return rgba
}
