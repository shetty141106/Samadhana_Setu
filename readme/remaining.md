# Remaining Work

This file contains only items that cannot be completed safely without deployment credentials or external configuration values.

## Production Backend Configuration

- **Variable:** `JWT_SECRET`
- **Why it remains:** A production signing secret must be supplied through the Render environment. The code now reads it from environment configuration and no longer embeds the signing key in source code.
- **What is already implemented:** JWT generation and validation remain unchanged apart from secret externalization.

- **Variable:** `CORS_ALLOWED_ORIGINS`
- **Why it remains:** The final deployed frontend origin has not been provided in the repository configuration.
- **What is already implemented:** Backend CORS is now environment-driven and supports local development origins.

- **Variable:** `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
- **Why it remains:** Production database values are deployment-specific and must remain outside source control.
- **What is already implemented:** Spring Boot is configured to load these values from environment variables.

## AI Service Deployment Credentials

- **Variable:** `GEMINI_API_KEY`
- **Why it remains:** A live Gemini credential is external and was not committed to the repository.
- **What is already implemented:** The FastAPI AI service integration and fallback handling are present; production use requires the credential in the AI service environment.

- **Variable:** `AI_SERVICE_URL`
- **Why it remains:** The deployed FastAPI service URL is deployment-specific.
- **What is already implemented:** Spring Boot reads the AI service URL from environment configuration.

## Frontend Image Upload

- **Variables:** `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`
- **Why it remains:** The Cloudinary account and unsigned upload preset must be created/configured externally.
- **What is already implemented:** The frontend image picker, previews, validation, Cloudinary upload client, and issue `evidenceMedia` integration are implemented.
- **Important:** Never put a Cloudinary API secret in the frontend environment.

## Production Frontend API Configuration

- **Variable:** `VITE_API_BASE_URL`
- **Why it remains:** The final frontend deployment URL/environment must be configured per deployment target.
- **What is already implemented:** The frontend API client uses environment configuration rather than hardcoding the backend URL.

## Verification Limitation

- The current development environment cannot directly execute the deployed Render service from this session, so live production endpoint verification must be completed from the deployed frontend/browser or another network environment.
