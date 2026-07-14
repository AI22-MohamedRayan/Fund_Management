# Fund Management Backend

This project contains the initial backend structure for a fund management system.

## Structure

- app/api: API endpoints
- app/config: configuration and security
- app/core: shared helpers and exceptions
- app/models: data models
- app/schemas: request/response schemas
- app/services: business logic
- app/repositories: data access logic
- app/scheduler: background jobs
- app/utils: utility functions

## Run locally

1. Install dependencies: `pip install -r requirements.txt`
2. Start the server: `uvicorn app.main:app --reload`
