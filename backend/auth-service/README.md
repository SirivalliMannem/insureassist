# InsureAssist Auth Service

The **Auth Service** is the central authentication and authorization microservice for the InsureAssist platform. It manages user credentials, bcrypt password hashing, JWT token issuance, and role identification across the four enterprise platform personas:

- **Customer** (`customer`)
- **Agent** (`agent`)
- **Underwriter** (`underwriter`)
- **Admin** (`admin`)

---

## Architecture & Directory Structure

```
backend/auth-service/
├── app/
│   ├── core/
│   │   ├── config.py         # Settings & environment variables
│   │   └── security.py       # Password hashing (bcrypt) & JWT issuance/validation
│   ├── models/
│   │   └── user.py           # User database models & UserRole enumeration
│   ├── schemas/
│   │   └── auth.py           # Pydantic request/response schemas
│   ├── services/
│   │   └── auth_service.py   # Auth business logic & in-memory mock repository
│   ├── routes/
│   │   └── auth.py           # Auth endpoints (POST /auth/login, GET /auth/me, GET /auth/demo-users)
│   ├── __init__.py
│   └── main.py               # FastAPI application setup, CORS & health check
├── requirements.txt          # Python dependencies
├── Dockerfile                # Container definition
├── .dockerignore
└── .env                      # Environment configuration
```

---

## Pre-configured Demo Accounts

All mock accounts have the default password: **`password123`**

| Role | Email | Name | Title |
| :--- | :--- | :--- | :--- |
| **Customer** | `sarah.mitchell@email.com` | Sarah Mitchell | Policyholder |
| **Agent** | `alex.rivera@insureassist.com` | Alex Rivera | Senior Account Executive |
| **Underwriter** | `alex.vance@insureassist.com` | Alex Vance | Lead Risk Underwriter |
| **Admin** | `admin@insureassist.com` | Jordan Taylor | Platform Administrator |

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health status check |
| `GET` | `/` | Service root and directory of endpoints |
| `POST` | `/auth/login` | Authenticate with email/password and obtain JWT access token |
| `GET` | `/auth/me` | Fetch authenticated user profile using `Authorization: Bearer <token>` |
| `GET` | `/auth/demo-users` | List all available demo accounts for testing |
| `GET` | `/docs` | Interactive Swagger OpenAPI documentation UI |
| `GET` | `/redoc` | Interactive ReDoc documentation UI |

---

## Running the Service

### 1. Running Locally (Python)

1. Navigate to the service directory:
   ```bash
   cd backend/auth-service
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
   ```

5. Open your browser:
   - Interactive Docs: [http://localhost:8001/docs](http://localhost:8001/docs)
   - Health Check: [http://localhost:8001/health](http://localhost:8001/health)

---

### 2. Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t insureassist-auth-service:latest .
   ```

2. Run the Docker container:
   ```bash
   docker run -d -p 8001:8001 --name insureassist-auth insureassist-auth-service:latest
   ```

3. Test container health:
   ```bash
   curl http://localhost:8001/health
   ```

4. Stop and remove container:
   ```bash
   docker stop insureassist-auth
   docker rm insureassist-auth
   ```
