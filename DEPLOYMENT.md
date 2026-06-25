# Deployment Guide - Smart Crop Management System

This guide explains how to prepare and deploy the Smart Crop Management System to a production environment.

## 1. Prerequisites
- **Node.js** (v18 or later)
- **.NET SDK 9.0**
- **PostgreSQL** (v14 or later)
- **ONNX Runtime** (Compatible with your AI model)

## 2. Backend Deployment (.NET)

### Step 1: Update Production Settings
Edit `Backend/SmartCropAPI/appsettings.Production.json`:
- Set your production **Connection String**.
- Set a strong **JWT Key** (at least 32 characters).
- **CRITICAL**: The AgriVision Deep Analysis Engine requires an API token. You MUST set the `AGRIVISION_ENGINE_TOKEN` environment variable on your production server.

### Step 2: Build the Application
Run the following command in the `Backend/SmartCropAPI` directory:
```bash
dotnet publish -c Release -o ./publish
```

### Step 3: Run the Backend
You can run the published app using:
```bash
dotnet ./publish/SmartCropAPI.dll
```
*Tip: Use a process manager like **PM2** or **Systemd** to keep the app running in the background.*

## 3. Frontend Deployment (Angular)

### Step 1: Update Environment
Ensure `Frontend/src/environments/environment.prod.ts` has the correct `apiUrl` of your deployed backend.

### Step 2: Build for Production
Run the following command in the `Frontend` directory:
```bash
npm run build
```
This generates a `dist/` folder.

### Step 3: Host Static Files
Upload the contents of `dist/smart-crop-app/browser` to your web server (e.g., Nginx, Apache, Azure Static Web Apps, or Firebase Hosting).

## 4. Database Setup (PostgreSQL)
The application will automatically attempt to run migrations on startup.
1. Create a new database in PostgreSQL.
2. Ensure the user specified in the connection string has `CREATE` and `UPDATE` permissions.

## 5. CORS Configuration
If your Frontend and Backend are on different domains, ensure the `Program.cs` CORS policy includes your production URL:
```csharp
policy.WithOrigins("https://your-frontend-domain.com")
```

## 6. Important Notes
- **SSL**: Always use HTTPS in production.
- **AI Models**: Ensure the `AIModels` folder contains the necessary `.onnx` files in the production environment.
- **Static Files**: The `wwwroot/uploads` folder must have write permissions for the application process.
