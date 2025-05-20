/**
 * 确保最小加载时间
 * @param start 开始时间戳
 * @param min 最小加载时间（毫秒）
 */
export const ensureMinTime = async (start: number, min: number = 2000) => {
  const elapsed = Date.now() - start;
  if (elapsed < min) {
    await new Promise(resolve => setTimeout(resolve, min - elapsed));
  }
}; 