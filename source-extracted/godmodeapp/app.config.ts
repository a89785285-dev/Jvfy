import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";
const rawBundleId = "space.manus.godmodeapp.t126564197089379";
const bundleId = rawBundleId.replace(/[-_]/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.+|\.+$/g, "").toLowerCase().split(".").map((segment) => /^[a-zA-Z]/.test(segment) ? segment : `x${segment}`).join(".") || "space.manus.app";
const timestamp = bundleId.split(".").pop()?.replace(/^t/, "") ?? "";
const scheme = `manus${timestamp}`;
const config: ExpoConfig = {
  name: "GODMODE Mobile", slug: "godmodeapp", version: "1.0.0", orientation: "portrait", userInterfaceStyle: "dark", icon: "./assets/images/icon.png", scheme,
  extra: { apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "" },
  ios: { supportsTablet: true, bundleIdentifier: bundleId, infoPlist: { ITSAppUsesNonExemptEncryption: false } },
  android: { adaptiveIcon: { backgroundColor: "#07111f", foregroundImage: "./assets/images/android-icon-foreground.png", backgroundImage: "./assets/images/android-icon-background.png", monochromeImage: "./assets/images/android-icon-monochrome.png" }, predictiveBackGestureEnabled: false, package: bundleId, permissions: [] },
  web: { bundler: "metro", output: "static", favicon: "./assets/images/favicon.png" },
  plugins: ["expo-asset", "expo-router", ["expo-splash-screen", { image: "./assets/images/splash-icon.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#07111f" }], ["expo-build-properties", { android: { buildArchs: ["armeabi-v7a", "arm64-v8a"], minSdkVersion: 24 } }]],
  experiments: { typedRoutes: true, reactCompiler: true },
};
export default config;
