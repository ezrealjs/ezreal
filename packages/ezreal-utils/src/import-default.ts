export function importDefault(path: string) {
  const obj = require(path);

  return obj.default || obj;
}
