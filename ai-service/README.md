# InsureAssist AI Microservice

Standalone AI Service for the InsureAssist P&C Insurance platform.
Provides intelligent policy guidance, terminology explanations, application support, and customer assistance powered by Groq's OpenAI-compatible API.

---

## Service Specifications

- **Port**: `8006`
- **Framework**: FastAPI (Python 3.11)
- **Container Name**: `insureassist-ai-container`
- **Network**: `insureassist-network`

---

## Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | `""` | Groq API Key (never logged or exposed) |
| `GROQ_API_URL` | `https://api.groq.com/openai/v1` | Groq API Endpoint (OpenAI-compatible) |
| `GROQ_MODEL` | `openai/gpt-oss-120b` | Target LLM model |
| `USE_MOCK_GROQ` | `false` | When `true` (or if key is empty), returns deterministic mock responses |
| `PORT` | `8006` | HTTP service port |
| `HOST` | `0.0.0.0` | Bind host address |
| `CUSTOMER_SERVICE_URL` | `http://customer-service:8002` | Downstream Customer Service endpoint |

---

## API Endpoints

### 1. Health Check
- **Endpoint**: `GET /health`
- **Response**:
```json
{
  "status": "healthy",
  "service": "ai-service",
  "version": "1.0.0"
}
```

### 2. Customer AI Assistant Chat
- **Endpoint**: `POST /api/v1/ai/customer/chat`
- **Request**:
```json
{
  "message": "What does my deductible mean?",
  "customer_id": "CUST-001",
  "context": {}
}
```
- **Response**:
```json
{
  "success": true,
  "response": "A deductible is the amount of money you are responsible for paying out-of-pocket...",
  "role": "customer",
  "model": "openai/gpt-oss-120b"
}
```

---

## Architecture & Extensibility

The service is modularly structured:
- `app/config.py`: Environment configuration and secret masking.
- `app/services/groq_service.py`: Reusable OpenAI-compatible Groq client with deterministic mock fallback.
- `app/services/customer_ai_service.py`: Customer AI domain rules, anti-hallucination prompt assembly, and context integration.
- `app/routes/customer_ai.py`: Dedicated customer chat router.
- Additional roles (Agent AI, Underwriter AI, Claims AI) can be added as modular services and routes without altering existing layers.
