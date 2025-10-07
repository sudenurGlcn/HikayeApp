require('dotenv').config(); // Bu satır .env dosyasındaki değişkenleri yükler

export default {
  "expo": {
    "name": "masal2",
    "slug": "masal2",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "masal2",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true, // Önceki build hatanız çözüldüyse bunu 'false' yapmanızı öneririm.
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.sudegulcan.masal2",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.sudegulcan.masal2"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      // Ortam değişkenlerinden backend API Base URL (tanımlı değilse boş bırak)
      "apiBaseUrl": process.env.API_BASE_URL,
      "adaptyPublicKey":"public_live_TUxYUIzJ.xJM0x2OF3rALiKRDkqXb",
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "1b994f37-0bc6-4176-9568-76b0bfa93673"
      }
    }
  }
};