import { BigNumber } from 'ethers';

type FieldType = number | string | boolean | Date | BigNumber;
export const compareTwoFields = (a: FieldType, b: FieldType) => {
  if (typeof a !== typeof b) {
    return 0;
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    if (a === b) return 0;
    if (a) return 1;
    if (b) return -1;
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  if (a instanceof BigNumber && b instanceof BigNumber) {
    if (a.gt(b)) return 1;
    if (b.gt(a)) return -1;
    return 0;
  }

  throw new Error(
    `Invalid field types for compare: a = ${a} of type ${typeof a}, b = ${b} of type ${typeof b}`
  );
};
