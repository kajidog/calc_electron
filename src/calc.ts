import { getFirst15Chars, isFirstCharDigit } from "./util";

type Value = string | null;

// 文字を末尾に追加
export const addValue = (value: Value, add: string) => {
  const returnValue = Number((value || "") + add);
  if (isNaN(returnValue)) {
    throw "err";
  }
  return getFirst15Chars(String(returnValue));
};

// 符号切り替え
export const switchSign = (value: Value) => {
  if (value === null) {
    return "-0";
  }
  return isFirstCharDigit(value) ? "-" + value : value.substring(1);
};

// 百分率
export const percentage = (value: Value) => {
  return getFirst15Chars(String(Number(value || "0") / 100));
};

// 小数点追加
export const addDot = (value: Value) => {
  const _value = value || "0";
  if (value?.includes(".")) {
    return value;
  }
  return _value + ".";
};

// 演算子クリックした時の計算
export const CalcOp = (operator: string, sum: Value, value: Value) => {
  if (!sum || !value) {
    return value || sum;
  }
  const _sum = Number(sum || "0");
  const _value = Number(value || "0");

  const action = {
    "/": () => _sum / _value,
    "*": () => _sum * _value,
    "-": () => _sum - _value,
    "+": () => _sum + _value,
    "=": () => _value,
  }[operator];
  if (!action) {
    return value;
  }
  return getFirst15Chars(String(action()));
};
