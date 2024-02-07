const isObject = (item: any) =>
  item && typeof item === 'object' && !Array.isArray(item);

export const mergeDeep = (
  target: Record<string, any>,
  source: Record<string, any>,
) => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};
