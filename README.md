![pr1](https://github.com/user-attachments/assets/bf47b035-8cba-4415-a2df-01364df831e9)

## Environment Variables

| Environment Variable       | Type     | Required | Default Value    | Description                                                              |
| -------------------------- | -------- | :------: | ---------------- | ------------------------------------------------------------------------ |
| **NODE_ENV**               | string   |    ❌    | "development"    | Application environment mode (e.g., "development", "production").        |
| **PORT**                   | int      |    ❌    | 5000             | Application port number.                                                 |
| **JWT_TOKEN**              | string   |    ✅    |                  | Secret key for generating and validating JSON Web Tokens (JWT).          |
| **MONGODB**                | string   |    ✅    |                  | MongoDB connection string URI.                                           |
| **CLOUDINARY_CLOUD_NAME**  | string   |    ✅    |                  | Cloudinary account's cloud name used for image storage.                  |
| **CLOUDINARY_API_KEY**     | string   |    ✅    |                  | Cloudinary API key for authenticating API requests.                      |
| **CLOUDINARY_API_SECRET**  | string   |    ✅    |                  | Cloudinary API secret for securing API requests.                         |

### Example `.env` file

```env
NODE_ENV=development
PORT=5000
JWT_TOKEN=your_jwt_secret_key
MONGODB=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/khmaladze/connect-app-deploy.git
    ```

2. Navigate to the project directory and run the setup script:

    ```bash
    npm run setup
    ```

---

## Scripts

| Script       | Description                                                        |
| ------------ | ------------------------------------------------------------------ |
| **start**    | Starts the server in production mode.                              |
| **dev**      | Starts the server in development mode with live reloading.         |
| **setup**    | Installs backend and frontend dependencies.                        |
| **prettier** | Runs Prettier to format code.                                      |
| **test**     | Runs the test suite using Jest.                                    |
| **deploy**   | Installs dependencies, builds the frontend, and prepares for deploy. |

### Example Commands

- Start the server in development mode:

    ```bash
    npm run dev
    ```

- Format code using Prettier:

    ```bash
    npm run prettier
    ```

- Run tests:

    ```bash
    npm run test
    ```

- Build the project for deployment:

    ```bash
    npm run deploy
    ```
