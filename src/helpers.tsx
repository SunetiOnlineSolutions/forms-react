import crypto from "crypto";
import React from 'react';

export const id = () => crypto.randomBytes(20).toString('hex');

export const onEnter = (callback: () => void) => (event: React.KeyboardEvent) => {
  if (event.key === "Enter") {
    callback();
  }
};

export const preventDefault = (callback: () => void) => (event: React.FormEvent) => {
  event.preventDefault();

  callback();
}

export const isValidJson = (value: string) => {
  try {
    JSON.parse(value);

    return true;
  } catch (error) {
    return false;
  }
}

export const toPromise = <T,>(value: T) => new Promise<T>(resolve => resolve(value));

/**
 * source: https://stackoverflow.com/a/50918777/7610761
 */
export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;


export const error = (msg: string = "") => { throw new Error(msg); }

export const areObjectsDeepEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

export const formatDate = (date: Date, format: string) => {
  return format
    .replace(/yyyy/g, date.getFullYear().toString())
    .replace(/yy/g, (date.getFullYear() % 100).toString())
    .replace(/MM/g, (date.getMonth() + 1).toString().padStart(2, '0'))
    .replace(/dd/g, date.getDate().toString().padStart(2, '0'))
    .replace(/hh/g, date.getHours().toString().padStart(2, '0'))
    .replace(/mm/g, date.getMinutes().toString().padStart(2, '0'))
    .replace(/ss/g, date.getSeconds().toString().padStart(2, '0'));
}

export const isObject = (value: any): value is object => (value && typeof value === 'object' && !Array.isArray(value));

type IObject = { [key: string]: any };

export const deepMerge = <T extends IObject>(...sources: [T, ...Partial<T>[]]): T => {
  if (sources.length < 1) {
    return {} as T;
  }

  return sources.reduce((merged: IObject, Obj: IObject) => {
    Object.keys(Obj).forEach(key => {
      const pVal = merged[key];
      const oVal = Obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        merged[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        merged[key] = deepMerge(pVal, oVal);
      } else {
        merged[key] = oVal;
      }
    });

    return merged;
  }, {}) as T;
};
