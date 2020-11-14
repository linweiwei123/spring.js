/**
 * 判断类型
 * @param obj
 * @param type
 */
export function isType(obj: any, type: string) {
  return (
    Object.prototype.toString.call(obj).toLowerCase() === `[object ${type}]`
  );
}
