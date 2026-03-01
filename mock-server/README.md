# TestForge Mock + Swagger Server

Single Node service that:
- Serves the OpenAPI spec and Swagger UI (`/docs`).
- Proxies all API calls to an embedded Prism mock.

## Run locally

```bash
cd Projects/testforge/mock-server
SPEC_PATH=../openapi/testforge.v1.yaml PORT=8080 PRISM_PORT=4010 node server.js
```

Docs: `http://localhost:8080/docs`

## Docker

Use `Projects/testforge` as the build context so the Dockerfile can access both the mock server code and the OpenAPI spec:

```bash
cd /home/ec2-user/.openclaw/workspace
docker build -f Projects/testforge/mock-server/Dockerfile -t testforge-mock:latest Projects/testforge
docker run --rm -p 8081:8080 testforge-mock:latest
```

Docs: `http://localhost:8081/docs`
APIs: `http://localhost:8081/projects`, etc.
