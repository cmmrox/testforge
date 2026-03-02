const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { createServer } = require('@stoplight/prism-http-server');
const { getHttpOperationsFromSpec } = require('@stoplight/prism-cli/dist/operations');
const { createLogger } = require('@stoplight/prism-core');

const SPEC_PATH = process.env.SPEC_PATH || path.resolve(__dirname, '../openapi/testforge.v1.yaml');
const PRISM_PORT = process.env.PRISM_PORT || 4010;
const APP_PORT = process.env.PORT || 8081;

async function startPrism() {
  const operations = await getHttpOperationsFromSpec(SPEC_PATH);
  const prismServer = createServer(operations, {
    components: { logger: createLogger('testforge-mock') },
    cors: true,
    config: {
      // IMPORTANT: keep responses stable. With OpenAPI `examples` defined,
      // Prism will return those example payloads.
      mock: { dynamic: false },
      validateRequest: true,
      validateResponse: true,
      checkSecurity: true,
      errors: true,
    },
  });
  await prismServer.listen(Number(PRISM_PORT), '127.0.0.1');
  console.log(`Prism mock listening on http://127.0.0.1:${PRISM_PORT}`);
  return prismServer;
}

async function startApp() {
  await startPrism();

  const app = express();
  app.use(cors());
  app.use(morgan('dev'));

  // Serve raw spec
  app.get('/openapi.yaml', (req, res) => {
    res.type('text/yaml');
    fs.createReadStream(SPEC_PATH).pipe(res);
  });

  // Swagger UI
  const specDoc = YAML.parse(fs.readFileSync(SPEC_PATH, 'utf8'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specDoc));

  // Auto cookie for mock auth (skip docs/spec routes)
  app.use((req, _res, next) => {
    if (!req.headers.cookie && !req.path.startsWith('/docs') && req.path !== '/openapi.yaml') {
      req.headers.cookie = 'testforge_session=mock';
    }
    next();
  });

  // Proxy everything else to Prism
  app.use(
    '/',
    createProxyMiddleware({
      target: `http://127.0.0.1:${PRISM_PORT}`,
      changeOrigin: true,
      logLevel: 'warn',
      ws: false,
    })
  );

  app.listen(APP_PORT, () => {
    console.log(`Combined mock/docs server on http://0.0.0.0:${APP_PORT}`);
    console.log(`Swagger UI available at http://localhost:${APP_PORT}/docs`);
  });
}

startApp().catch((err) => {
  console.error('Failed to start mock/docs server', err);
  process.exit(1);
});
