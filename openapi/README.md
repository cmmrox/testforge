# TestForge OpenAPI Contract

- **Spec file:** `testforge.v1.yaml`
- **Linting:** `npx @redocly/cli lint Projects/testforge/openapi/testforge.v1.yaml`
- **Mock/docs server:** see `Projects/testforge/mock-server` (combined Swagger UI + Prism mock).
- **Client generation:** use `openapi-generator-cli` or `orval` once the spec stabilizes.
- **Contribution rule:** any backend/UI change that alters the API must update the spec in the same PR.

## Combined mock + Swagger UI server

Build the Docker image from the `Projects/testforge` root as the build context:

```bash
cd /home/ec2-user/.openclaw/workspace  # repository root
docker build -f Projects/testforge/mock-server/Dockerfile -t testforge-mock:latest Projects/testforge
```

Run it (serves both `/docs` and mock API under one port):

```bash
docker run --rm -p 8081:8080 testforge-mock:latest
```

Open `http://localhost:8081/docs` for interactive Swagger UI (Try It Out hits the mock automatically). All API paths—`/projects`, `/runs`, etc.—live under the same base URL.
