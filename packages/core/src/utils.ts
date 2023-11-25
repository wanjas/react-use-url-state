import { useRef } from 'react';
import { DefaultSchema } from './types';

export function urlParamsToObject(params: URLSearchParams) {
  const object: Record<string, string | string[]> = {};

  for (const [key, value] of params.entries()) {
    if (!object[key]) {
      object[key] = value;
      continue;
    }

    const currentValue = object[key];
    if (typeof currentValue === 'string') {
      object[key] = [currentValue, value];
    } else {
      currentValue.push(value);
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
    ref.current = value;
  }
  return ref.current;
}

export function serializeObjectToUrlParams(object: Record<string, any>) {
  const updatedObject = { ...object };

  Object.keys(updatedObject).forEach((key) => {
    const value = updatedObject[key];
    if (value === undefined || value === null) {
      delete updatedObject[key];
    }

    if (typeof value === 'object') {
      if (value instanceof Date) {
        updatedObject[key] = value.toISOString();
      } else {
        updatedObject[key] = value?.toString?.();
      }
    }
  });

  const params = new URLSearchParams(updatedObject);
  return `?${params.toString()}`;
}
