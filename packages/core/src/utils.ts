import { useRef } from 'react';
import { DefaultSchema } from './types';

function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function urlParamsToObject(params: URLSearchParams) {
  const object: Record<string, string | string[]> = {};

  for (const [key, value] of params.entries()) {
    if (isNil(object[key])) {
      object[key] = value;
      continue;
    }

    const currentValue = object[key];

    if (Array.isArray(currentValue)) {
      currentValue.push(value);
    } else {
      object[key] = [currentValue, value];
    }
  }

  return object;
}

export function searchIsEmpty(search: string) {
  return !search || search.indexOf('=') === -1;
}

function shallowEqual<T>(a: T, b: T) {
  if (a === b) {
    return true;
  }

  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  if (a === null || b === null) {
    return false;
  }

  const aKeys = Object.keys(a) as (keyof T)[];
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    if (
      'toString' in a &&
      'toString' in b &&
      typeof a.toString === 'function' &&
      typeof b.toString === 'function'
    ) {
      if (a.toString() !== b.toString()) {
        return false;
      }
    } else if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}

export function useShallowEqualValue<T>(value: T) {
  const ref = useRef(value);
  if (!shallowEqual(value, ref.current)) {
    console.log('not equal');
    ref.current = value;
  }
  return ref.current;
}

function serializeValue(
  value: unknown,
): string | undefined | (string | undefined)[] {
  if (isNil(value)) {
    return undefined;
  }

  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value.toISOString();
    } else if (Array.isArray(value)) {
      return value.map((v) => {
        if (typeof v === 'object') {
          return JSON.stringify(v);
        }
        return serializeValue(v) as string;
      });
    } else {
      return value?.toString?.();
    }
  }

  return value?.toString();
}

export function serializeObjectToUrlParams(object: Record<string, any>) {
  const params = new URLSearchParams();

  Object.keys(object).forEach((key) => {
    const value = serializeValue(object[key]);
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (isNil(v)) {
          return;
        }
        params.append(key, v);
      });
      return;
    }

    params.append(key, value);
  });

  return `?${params.toString()}`;
}
