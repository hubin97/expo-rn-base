

# 📱 MyApp - Expo EAS 打包说明

使用 [Expo](https://expo.dev) 和 [EAS Build](https://docs.expo.dev/build/introduction/)，支持构建 iOS 和 Android 的真机测试包（.ipa / .apk），用于测试或提交至商店。


## 🧰 环境准备

1. 安装 Node.js ≥ 16
2. 安装 EAS CLI：
   `npm install -g eas-cli`
3. 登录：
   `eas login`
4. 初始化 EAS（如未执行过）：
`eas init`

---

## ⚙️ 构建配置

### 创建 `eas.json`

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "ios-dev": {
      "ios": {
        "buildType": "release",
        "distribution": "internal"
      }
    },
    "android-dev": {
      "android": {
        "buildType": "apk"
      }
    },
    "ios-release": {
      "ios": {
        "distribution": "store"
      }
    },
    "android-release": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

### 创建 `app.config.js`

```js
export default {
  expo: {
    name: "MyApp",
    slug: "myapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      bundleIdentifier: "com.yourcompany.myapp",
      buildNumber: "1.0.0"
    },
    android: {
      package: "com.yourcompany.myapp",
      versionCode: 1
    },
    extra: {
      eas: {
        projectId: "YOUR_PROJECT_ID"
      }
    }
  }
};
```

---

## 🚀 构建命令

### 🔵 构建 iOS 真机测试包（.ipa）

```bash
eas build --platform ios --profile ios-dev
```

* 输出 `.ipa` 安装包
* 可通过 OTA 链接、Apple Configurator 或 TestFlight 安装

### 🟢 构建 Android 真机测试包（.apk）

```bash
eas build --platform android --profile android-dev
```

* 输出 `.apk` 可直接安装到 Android 真机

### 📦 构建商店发布版本

#### iOS `.ipa` 用于 App Store

```bash
eas build --platform ios --profile ios-release
```

#### Android `.aab` 用于 Google Play

```bash
eas build --platform android --profile android-release
```

---

## 📥 下载构建产物

```bash
eas build:list
eas build:download --platform ios
eas build:download --platform android
```

---

## 📲 安装方式

### iOS 安装 .ipa 到真机

* 方式一：使用 Expo OTA 安装链接（构建完成页面会提供）
* 方式二：用 Apple Configurator 拖入 iPhone 安装
* 方式三：上传至 TestFlight 分发

### Android 安装 .apk 到真机

```bash
adb install path/to/your-app.apk
```

或直接发送到设备打开安装。

---

## 🧪 测试建议

* iOS：首次构建需注册 Apple 账号，添加 UDID
* Android：构建无需开发者账号
* 修改 JS 代码可用 `eas update` 快速 OTA 更新

---

## 📚 参考链接

* [EAS Build](https://docs.expo.dev/build/introduction/)
* [iOS 内测分发](https://docs.expo.dev/build/internal-distribution/)
* [Android 构建文档](https://docs.expo.dev/build/android/)

```

---

这个 `README.md` 是高度整合的一体化版本，适合放到项目根目录中作为团队构建指南。如果你提供你的项目名、包名、图标等信息，我也可以为你生成更具体定制的版本。是否需要？
```
