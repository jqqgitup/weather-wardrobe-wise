
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bd69fc22e9ee41859f1c402c933c204c',
  appName: 'weather-wardrobe-wise',
  webDir: 'dist',
  server: {
    url: "https://bd69fc22-e9ee-4185-9f1c-402c933c204c.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2196F3",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#ffffff",
    }
  }
};

export default config;
