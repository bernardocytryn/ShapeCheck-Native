import AsyncStorage from "@react-native-async-storage/async-storage";

const cache = {};

export async function getItem(key) {
  if (cache[key] !== undefined) {
    return cache[key];
  }
  const value = await AsyncStorage.getItem(key);
  cache[key] = value;
  return value;
}

export async function setItem(key, value) {
  cache[key] = value;
  await AsyncStorage.setItem(key, value);
}

export async function removeItem(key) {
  delete cache[key];
  await AsyncStorage.removeItem(key);
}

export function getItemSync(key) {
  return cache[key] ?? null;
}

export function setItemSync(key, value) {
  cache[key] = value;
  AsyncStorage.setItem(key, value).catch(console.error);
}

export function removeItemSync(key) {
  delete cache[key];
  AsyncStorage.removeItem(key).catch(console.error);
}

export async function preloadStorage(keys) {
  const pairs = await AsyncStorage.multiGet(keys);
  pairs.forEach(([key, value]) => {
    cache[key] = value;
  });
}
