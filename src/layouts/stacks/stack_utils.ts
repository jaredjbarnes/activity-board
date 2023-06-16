export function throwIfAuto(value?: string) {
  if (value === 'auto') {
    throw new Error('Cannot use auto as the height, it produces undefined behavior.');
  }
}
export function checkAllValuesForAuto(...values: any[]) {
  values.forEach(v => throwIfAuto(v));
}
