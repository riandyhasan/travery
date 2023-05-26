import 'dotenv/config';

export default {
  expo: {
    name: 'travery',
    slug: 'travery',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/logo/travery.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './src/assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#227466',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './src/assets/logo/travery.png',
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
    },
  },
};
