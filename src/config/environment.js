// Environment configuration
const config = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || "https://bee-energy-backend.onrender.com/api",
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || "Bee Solar Hive",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  
  // Payment Configuration (for future implementation)
  PAYSTACK_PUBLIC_KEY: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
  FLUTTERWAVE_PUBLIC_KEY: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || "",
  
  // Email Configuration (for future implementation)
  EMAILJS_SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
  EMAILJS_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
  EMAILJS_PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
  
  // Development flags
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

export default config;
