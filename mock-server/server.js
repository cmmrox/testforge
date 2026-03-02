'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const environmentRoutes = require('./routes/environments');
const domainRoutes = require('./routes/domains');
const planRoutes = require('./routes/plans');
const caseRoutes = require('./routes/cases');
const runRoutes = require('./routes/runs');
const auditRoutes = require('./routes/audit');

const PORT = process.env.PORT || 8081;
const SPEC_PATH = process.env.SPEC_PATH || path.resolve(__dirname, '../openapi/testforge.v1.yaml');

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(morgan('dev'));
app.use(express.json());

// Minimal cookie parser (avoid extra dependency)
app.use((req, _res, next) => {
  const raw = req.headers.cookie || '';
  const pairs = raw
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((kv) => {
      const idx = kv.indexOf('=');
      if (idx === -1) return [kv, ''];
      return [kv.slice(0, idx), kv.slice(idx + 1)];
    });

  req.cookies = Object.fromEntries(pairs);
  next();
});

// Auth check middleware (skip auth + docs)
app.use((req, res, next) => {
  const openPrefixes = ['/auth/login', '/openapi.yaml', '/docs'];
  if (openPrefixes.some((p) => req.path.startsWith(p))) return next();

  if (!req.cookies || !req.cookies.testforge_session) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }

  return next();
});

// Routes
app.use('/', authRoutes);
app.use('/', projectRoutes);
app.use('/', environmentRoutes);
app.use('/', domainRoutes);
app.use('/', planRoutes);
app.use('/', caseRoutes);
app.use('/', runRoutes);
app.use('/', auditRoutes);

// Swagger UI + spec
const specDoc = YAML.parse(fs.readFileSync(SPEC_PATH, 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specDoc));
app.get('/openapi.yaml', (_req, res) => {
  res.type('text/yaml');
  fs.createReadStream(SPEC_PATH).pipe(res);
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'NotFound', message: `${req.method} ${req.path} not found` });
});

app.listen(PORT, () => {
  console.log(`TestForge stateful mock server running on http://0.0.0.0:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/docs`);
});
