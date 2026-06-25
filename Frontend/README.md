# Smart Crop Management System - Frontend

The frontend of the Smart Crop Management System is built using **Angular 20 Standalone Components**, offering a lightning-fast, highly responsive, and farmer-friendly user interface.

## 📁 Directory Structure

```text
Frontend/src/
│
├── app/
│   ├── components/      # Reusable UI elements (Navbar, Sidebar, Layout)
│   ├── guards/          # Route guards for authentication/role protection
│   ├── interceptors/    # HTTP Interceptors (JWT Auth injection)
│   ├── models/          # TypeScript interfaces (User, Prediction, etc.)
│   ├── pages/           # Main route views (Dashboard, Upload, Result, Auth)
│   ├── services/        # Logic & API communication (AuthService, PredictionService)
│   ├── shared/          # Shared utilities and Material design imports
│   ├── app.routes.ts    # Application routing definitions
│   └── app.config.ts    # Application-wide configuration and providers
│
├── assets/              # Static assets (images, icons, translation files)
├── environments/        # Environment-specific configuration
├── styles.scss          # Global styling and responsive grid system
└── main.ts              # Application bootstrap logic
```

## 🚀 Key Features

1. **Standalone Architecture**: Utilizes Angular's modern standalone components (no `NgModules`) for improved performance and simpler structure.
2. **Farmer-Friendly UI**: A fully fluid, responsive design with large touch targets, highly legible typography, and a "glassmorphism" aesthetic. Scales perfectly across mobile, tablet, and desktop screens.
3. **Multi-Language Support**: Integrated with `ngx-translate` to allow localization for farmers in different regions.
4. **Seamless Diagnostic Flow**: An intuitive crop image upload system featuring live previews, AI scanning animations, and dynamic loading states.
5. **Secure Authentication**: JWT-based login and registration, fully guarded routing for Admin and Farmer roles.

## 🛠️ Setup & Run Instructions

1. **Prerequisites**: 
   - Node.js (v18+)
   - Angular CLI (`npm install -g @angular/cli`)

2. **Installation**:
   Navigate to the `Frontend` directory and install dependencies:
   ```bash
   npm install
   ```

3. **Configuration**:
   - Update `src/environments/environment.ts` with your backend API URL if it differs from the default `http://localhost:5063/api`.

4. **Run Application**:
   ```bash
   ng serve
   ```
   The application will run at `http://localhost:4200/`.

5. **Production Build**:
   ```bash
   ng build --configuration production
   ```
