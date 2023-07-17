// １文字目がマイナスかどうか
export function isFirstCharDigit(s: string): boolean {
  return /^\d/.test(s);
}

// arr に search が含まれているかどうか
export function includesValue(arr: string[], search: string): boolean {
  return arr.includes(search);
}

// ３文字ごとにカンマで表示
export function formatNumberWithComma(numStr: string): string {
  const endsWithDot = numStr.endsWith(".");
  if (endsWithDot) {
    numStr = numStr.slice(0, -1);
  }
  const [whole, fractional] = numStr.split(".");
  const reversedWhole = [...whole].reverse().join("");
  const reversedWithCommas = reversedWhole.replace(/(\d{3}(?=\d))/g, "$&,");
  const wholeWithCommas = [...reversedWithCommas].reverse().join("");
  let result = fractional
    ? `${wholeWithCommas}.${fractional}`
    : wholeWithCommas;
  if (endsWithDot) {
    result += ".";
  }
  return result;
}
// 文字を15桁に制限
export function getFirst15Chars(str: string): string {
  return str.substring(0, 15);
}
