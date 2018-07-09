// RGB颜色转16进制代码
export function rgb2Hex(aColor) {
  let strHex = '#'
  for (let i = 0; i < aColor.length; i++) {
    let hex = Number(aColor[i]).toString(16)
    if (hex === '0') {
      hex += hex
    }
    strHex += hex
  }
  return strHex
}

// 16进制转RGBA颜色([r, g, b, a])
export function hex2Rgba(hex, opacity) {
  return [
    parseInt(`0x${hex.slice(1, 3)}`, 16),
    parseInt(`0x${hex.slice(3, 5)}`, 16),
    parseInt(`0x${hex.slice(5, 7)}`, 16),
    opacity,
  ]
}
