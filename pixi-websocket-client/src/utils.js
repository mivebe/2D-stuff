
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep(a, b, direction = 'left') {
  if (!isObject(a) || !isObject(b)) {
    throw new TypeError('Cant merge non objects');
  }

  const host = direction === 'left' ? a : b;
  const guest = direction === 'left' ? b : a;
  const result = Object.assign({}, host);

  Object.entries(guest).forEach(([key, val]) => {
    if (!isObject(val) || !(key in host)) {
      result[key] = val
    } else {
      result[key] = mergeDeep(host[key], val, direction);
    }
  });

  return result;
}

export const clamp = (number, min, max) => Math.max(min, Math.min(number, max));