Agrolense — Smart Crop Management System

An AI-powered web application that helps farmers detect crop diseases from images and provides treatment suggestions, fertilizer recommendations, and disease timelines — available in 30+ Indian regional languages.


Live Demo

https://agrolense.vercel.app


Tech Stack

Frontend


Angular 18
TypeScript
SCSS
Angular Material UI


Backend


ASP.NET Core Web API (.NET 10)
Entity Framework Core 9
C#
Swagger / OpenAPI
BCrypt.Net (Password Hashing)


AI / Machine Learning


ONNX Runtime (Microsoft.ML.OnnxRuntime)
Microsoft ML.NET
OpenCvSharp4 (Image Preprocessing)
Hierarchical Inference — Router + Specialist ONNX model pattern


Database


PostgreSQL (via Npgsql EF Core Provider)
Hosted on Neon.tech (Free tier)


Authentication & Security


JWT Bearer Authentication
Role-based Authorization (Farmer / Admin)
CORS Policy configured for Angular frontend


DevOps & Deployment


Docker (multi-stage build)
Docker Hub (image registry)
GitHub Actions (CI/CD pipeline)
Railway (backend hosting)
Vercel (frontend hosting)
Hugging Face (ONNX model hosting — 750MB)



Project Modules

1. User Management Module

Farmer registration, login, authentication, and profile management with JWT-secured sessions. Role-based access for Farmer and Admin.

2. Disease Detection Module

Accepts crop images and performs disease classification using a trained ONNX model. Implements a Router–Specialist hierarchical inference pattern to handle 100+ plant diseases across multiple crops.

3. Vision Analysis Engine Module

A custom multi-modal AI pipeline that processes raw plant images and produces structured diagnostic outputs including disease descriptions, treatment suggestions, fertilizer recommendations, and disease timelines.

4. Recommendation Module

Generates disease descriptions, treatment suggestions (cure and prevention), fertilizer recommendations, and disease timelines.

5. Scan History Module

Stores and retrieves previous scan records for authenticated users, enabling farmers to track crop health over time.

6. Translation Module

Converts advisory content into the farmer's selected regional language. Supports 30+ Indian languages including Hindi, Marathi, Gujarati, Telugu, Tamil, Bengali, Kannada, and more.

7. Admin Dashboard Module

Allows administrators to manage crops, diseases, fertilizer records, users, and system diagnostics.


Project Structure

Agrolense/
├── Frontend/                          # Angular 18 app
│   ├── src/
│   │   ├── environments/
│   │   │   ├── environment.ts         # Development config
│   │   │   └── environment.prod.ts    # Production config
│   │   └── app/
│   └── package.json
│
├── Backend/
│   └── SmartCropAPI/                  # .NET 10 Web API
│       ├── Controllers/
│       ├── Models/
│       ├── Services/
│       ├── Data/
│       ├── Middleware/
│       ├── AIModels/                  # ONNX model location
│       ├── Program.cs
│       ├── appsettings.json
│       └── SmartCropAPI.csproj
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml                  # GitHub Actions pipeline
│
├── Dockerfile                         # .NET 10 multi-stage build
├── DEPLOYMENT.md                      # Deployment guide
└── README.md


CI/CD Pipeline

Every push to main triggers an automated GitHub Actions pipeline:

Push to main
     │
     ▼
[Job 1] Build & Test .NET Backend
     │
     ▼
[Job 2] Build Docker Image → Push to Docker Hub
     │
     ▼
[Job 3] Deploy Backend → Railway
     │
     ▼
[Job 4] Build Angular App → Deploy Frontend → Vercel

Required GitHub Secrets

SecretDescriptionDOCKER_HUB_USERNAMEDocker Hub usernameDOCKER_HUB_TOKENDocker Hub access tokenRAILWAY_TOKENRailway API tokenVERCEL_TOKENVercel API token


Local Development

Prerequisites


Node.js v20+
.NET SDK 10.0
PostgreSQL 14+
Angular CLI


Backend Setup

bashcd Backend/SmartCropAPI
dotnet restore
dotnet run

API runs at: http://localhost:5063
Swagger UI: http://localhost:5063/swagger

Frontend Setup

bashcd Frontend
npm install
ng serve

App runs at: http://localhost:4200

Database Setup

Update appsettings.json with your local PostgreSQL connection string:

json"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Port=5432;Database=smart_crop_db;User Id=postgres;Password=yourpassword;"
}

Migrations apply automatically on startup.


Environment Variables (Production)

VariableDescriptionConnectionStrings__DefaultConnectionNeon PostgreSQL connection stringJwt__KeyJWT signing key (min 256 bits)Jwt__IssuerJWT issuer nameJwt__AudienceJWT audience nameAI__AgriVisionApiKeyAI vision engine API keyHUGGINGFACE_MODEL_URLURL to download ONNX modelASPNETCORE_ENVIRONMENTSet to Production


Deployment Architecture

Farmer (Browser)
       │
       ▼
   Vercel (Angular 18 Frontend)
       │  HTTPS / REST API + JWT
       ▼
   Railway (.NET 10 Backend + Docker)
       │                    │
       ▼                    ▼
Neon PostgreSQL      Hugging Face
(Database)           (ONNX Model)


API Documentation

Full interactive API documentation available via Swagger:

https://agrolense-production.up.railway.app/swagger

Key endpoints:

EndpointMethodDescription/api/Auth/registerPOSTRegister new farmer/admin account/api/Auth/loginPOSTAuthenticate and receive JWT token/api/CropsGETList supported crops/api/Disease/detectPOSTUpload image for disease detection/api/ScanHistoryGETRetrieve user's scan history/api/Admin/dashboardGETAdmin analytics dashboard


Author

Sanket Sudrik
GitHub


License

This project is developed for academic/college presentation purposes.
