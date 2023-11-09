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
