
export default {
    expo: {
      name: "rn-base",
      slug: "rn-base",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      splash: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      ios: {
        bundleIdentifier: "com.hubin.expo.rnbase",
        buildNumber: "1.0.0"
      },
      android: {
        package: "com.hubin.expo.rnbase",
        versionCode: 1
      },
      extra: {
        eas: {
          projectId: "d5bc21fd-290d-438d-aa72-02f9c924d14d"
        }
      }
    }
  };