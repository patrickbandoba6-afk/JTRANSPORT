import * as SecureStore from "expo-secure-store";

const KEY = "jt_onboarded";

export async function hasOnboarded(): Promise<boolean> {
  return (await SecureStore.getItemAsync(KEY)) === "1";
}

export async function setOnboarded(): Promise<void> {
  await SecureStore.setItemAsync(KEY, "1");
}
