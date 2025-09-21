# Environment Setup

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=https://bee-energy-backend.onrender.com/api

# App Configuration
VITE_APP_NAME=Bee Solar Hive
VITE_APP_VERSION=1.0.0

# Payment Configuration (for future implementation)
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
VITE_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key

# Email Configuration (for future implementation)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## Configuration

The app uses a centralized configuration system located in `src/config/environment.js`. This file:

- Provides fallback values for all environment variables
- Centralizes configuration management
- Makes it easy to add new configuration options

## Usage

```javascript
import config from '../config/environment.js';

// Use configuration values
const apiUrl = config.API_URL;
const appName = config.APP_NAME;
```

## Development vs Production

The configuration automatically detects the environment:
- `config.IS_DEVELOPMENT` - true in development
- `config.IS_PRODUCTION` - true in production

This can be used for conditional logic like showing debug information or using different API endpoints.
