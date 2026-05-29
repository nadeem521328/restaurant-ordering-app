export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function isTenDigitPhone(value: string) {
  return /^\d{10}$/.test(value);
}
