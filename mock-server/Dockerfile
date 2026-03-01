FROM node:20-alpine
WORKDIR /app
COPY mock-server/package*.json ./
RUN npm install --omit=dev && mkdir -p openapi
COPY mock-server/server.js ./
COPY openapi/testforge.v1.yaml ./openapi/testforge.v1.yaml
ENV PORT=8080
ENV PRISM_PORT=4010
ENV SPEC_PATH=/app/openapi/testforge.v1.yaml
EXPOSE 8080
CMD ["node", "server.js"]
