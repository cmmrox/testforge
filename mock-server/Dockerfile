FROM node:20-alpine
WORKDIR /app

# Install deps
COPY mock-server/package*.json ./
RUN npm install --omit=dev && mkdir -p openapi routes

# App files
COPY mock-server/server.js ./server.js
COPY mock-server/store.js ./store.js
COPY mock-server/seed.js ./seed.js
COPY mock-server/routes ./routes

# Spec
COPY openapi/testforge.v1.yaml ./openapi/testforge.v1.yaml

ENV PORT=8081
ENV SPEC_PATH=/app/openapi/testforge.v1.yaml

EXPOSE 8081
CMD ["node", "server.js"]
