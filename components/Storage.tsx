import * as SecureStore from 'expo-secure-store';

export const Storage = {
  /** 存字符串 */
  set: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  },

  /** 取字符串 */
  getString: async (key: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(key);
  },

  /** 存布尔值 */
  setBoolean: async (key: string, value: boolean): Promise<void> => {
    await SecureStore.setItemAsync(key, value ? 'true' : 'false');
  },

  /** 取布尔值 */
  getBoolean: async (key: string): Promise<boolean | null> => {
    const value = await SecureStore.getItemAsync(key);
    if (value === null) return null;
    return value === 'true';
  },

  /** 存数字 */
  setNumber: async (key: string, value: number): Promise<void> => {
    await SecureStore.setItemAsync(key, value.toString());
  },

  /** 取数字 */
  getNumber: async (key: string): Promise<number | null> => {
    const value = await SecureStore.getItemAsync(key);
    if (value === null) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  },

  /** 删除某个 key */
  delete: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  },

  /** 判断 key 是否存在 */
  contains: async (key: string): Promise<boolean> => {
    const value = await SecureStore.getItemAsync(key);
    return value !== null;
  },

  /** ⚠️ 清空所有（不推荐在生产使用，除非自己维护 key 列表） */
  clearAll: async (): Promise<void> => {
    console.warn('Storage.clearAll is not fully supported: SecureStore does not expose all keys. Maintain your own key registry if needed.');
    // 推荐维护一个自定义的 key 列表来清除
    // const keys = ['key1', 'key2']; for (const key of keys) { await delete(key); }
  },
};
