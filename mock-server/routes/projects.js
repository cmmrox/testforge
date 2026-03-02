'use strict';

const router = require('express').Router();
const { db, newId, paginate } = require('../store');

function projectStats(projectId) {
  const environmentCount = db.environments.filter((e) => e.projectId === projectId).length;
  const testPlanCount = db.testPlans.filter((p) => p.projectId === projectId && p.status !== 'archived').length;
  const testCaseCount = db.testCases.filter((c) => c.projectId === projectId && c.status !== 'archived').length;

  const runs = db.runs
    .filter((r) => r.projectId === projectId)
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const lastRun = runs[0]
    ? { id: runs[0].id, status: runs[0].status, finishedAt: runs[0].finishedAt || undefined }
    : undefined;

  return { environmentCount, testPlanCount, testCaseCount, lastRun };
}

function findProject(req, res) {
  const p = db.projects.find((x) => x.id === req.params.id);
  if (!p) {
    res.status(404).json({ error: 'NotFound', message: 'Project not found' });
    return null;
  }
  return p;
}

// ──────────────────────────────────────────────
// Projects CRUD
// ──────────────────────────────────────────────

router.get('/projects', (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;

  const items = db.projects
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((p) => ({ ...p, ...projectStats(p.id) }));

  const paged = paginate(items, cursor, limit);
  res.json(paged);
});

router.post('/projects', (req, res) => {
  const body = req.body || {};
  if (!body.name || String(body.name).trim().length === 0) {
    return res.status(400).json({ error: 'BadRequest', message: 'name is required' });
  }

  const created = {
    id: newId(),
    name: String(body.name),
    description: body.description ? String(body.description) : '',
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    archived: false,
    createdAt: new Date().toISOString(),
  };

  db.projects.push(created);
  res.status(201).json(created);
});

router.get('/projects/:id', (req, res) => {
  const p = findProject(req, res);
  if (!p) return;
  res.json({ ...p, ...projectStats(p.id) });
});

router.patch('/projects/:id', (req, res) => {
  const p = findProject(req, res);
  if (!p) return;
  Object.assign(p, req.body);
  res.json(p);
});

router.delete('/projects/:id', (req, res) => {
  const p = findProject(req, res);
  if (!p) return;
  p.archived = true;
  res.status(204).end();
});

// ──────────────────────────────────────────────
// Environments under project
// ──────────────────────────────────────────────

router.get('/projects/:id/environments', (req, res) => {
  const projectId = req.params.id;
  const data = db.environments.filter((e) => e.projectId === projectId);
  res.json({ data });
});

router.post('/projects/:id/environments', (req, res) => {
  const projectId = req.params.id;
  const body = req.body || {};

  if (!body.name || !body.baseUrl) {
    return res.status(400).json({ error: 'BadRequest', message: 'name and baseUrl are required' });
  }

  const created = {
    id: newId(),
    projectId,
    name: String(body.name),
    baseUrl: String(body.baseUrl),
    loginRecipe: body.loginRecipe || undefined,
    createdAt: new Date().toISOString(),
  };

  db.environments.push(created);
  res.status(201).json(created);
});

// ──────────────────────────────────────────────
// Domains under project
// ──────────────────────────────────────────────

router.get('/projects/:id/domains', (req, res) => {
  const projectId = req.params.id;
  const data = db.domains.filter((d) => d.projectId === projectId);
  res.json({ data });
});

router.post('/projects/:id/domains', (req, res) => {
  const projectId = req.params.id;
  const body = req.body || {};
  if (!body.name || !body.color) {
    return res.status(400).json({ error: 'BadRequest', message: 'name and color are required' });
  }

  const created = {
    id: newId(),
    projectId,
    name: String(body.name),
    color: String(body.color),
    createdAt: new Date().toISOString(),
  };

  db.domains.push(created);
  res.status(201).json(created);
});

// ──────────────────────────────────────────────
// Test plans under project
// ──────────────────────────────────────────────

router.get('/projects/:id/test-plans', (req, res) => {
  const projectId = req.params.id;
  const domainId = typeof req.query.domainId === 'string' ? req.query.domainId : undefined;
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;

  let items = db.testPlans.filter((p) => p.projectId === projectId);
  if (domainId) items = items.filter((p) => p.domainId === domainId);
  if (status) items = items.filter((p) => p.status === status);

  res.json({ data: items });
});

router.post('/projects/:id/test-plans', (req, res) => {
  const projectId = req.params.id;
  const body = req.body || {};
  if (!body.title) {
    return res.status(400).json({ error: 'BadRequest', message: 'title is required' });
  }

  const created = {
    id: newId(),
    projectId,
    domainId: body.domainId || null,
    title: String(body.title),
    description: body.description ? String(body.description) : '',
    status: 'draft',
    generatedBy: 'manual',
    createdBy: db.users[0].id,
    createdAt: new Date().toISOString(),
  };

  db.testPlans.push(created);
  res.status(201).json(created);
});

router.post('/projects/:id/test-plans/generate', (req, res) => {
  const projectId = req.params.id;
  const body = req.body || {};

  const plan = {
    id: newId(),
    projectId,
    domainId: body.domainId || null,
    title: body.title ? String(body.title) : 'Generated Plan',
    description: `Generated from goal: ${body.goal || ''}`.trim(),
    status: 'draft',
    generatedBy: 'agent',
    createdBy: db.users[0].id,
    createdAt: new Date().toISOString(),
  };
  db.testPlans.push(plan);

  const suggestedCases = [
    {
      title: 'Happy path flow',
      objective: 'Verify the primary happy path flow works end-to-end',
      spec: { kind: 'ui', title: 'Happy path flow', steps: [], evidence: { screenshots: 'onFail', video: 'onFail', trace: 'onFail' } },
    },
    {
      title: 'Validation / error handling',
      objective: 'Verify expected validation messages appear on invalid input',
      spec: { kind: 'ui', title: 'Validation / error handling', steps: [], evidence: { screenshots: 'onFail', video: 'onFail', trace: 'onFail' } },
    },
  ];

  res.status(201).json({ plan, suggestedCases, risks: ['Mock generation: replace with real LLM later'] });
});

// ──────────────────────────────────────────────
// Test cases under project
// ──────────────────────────────────────────────

router.get('/projects/:id/test-cases', (req, res) => {
  const projectId = req.params.id;
  const domainId = typeof req.query.domainId === 'string' ? req.query.domainId : undefined;
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : undefined;

  let items = db.testCases.filter((c) => c.projectId === projectId);
  if (domainId) items = items.filter((c) => c.domainId === domainId);
  if (status) items = items.filter((c) => c.status === status);
  if (q) items = items.filter((c) => c.title.toLowerCase().includes(q));

  // Include latestVersion for convenience
  const data = items.map((c) => {
    const versions = db.testCaseVersions.filter((v) => v.testCaseId === c.id);
    const latest = versions.length
      ? versions.reduce((acc, v) => (v.versionNo > acc.versionNo ? v : acc), versions[0])
      : undefined;
    return { ...c, latestVersion: latest };
  });

  res.json({ data, nextCursor: undefined });
});

router.post('/projects/:id/test-cases', (req, res) => {
  const projectId = req.params.id;
  const body = req.body || {};
  if (!body.title) {
    return res.status(400).json({ error: 'BadRequest', message: 'title is required' });
  }

  const created = {
    id: newId(),
    projectId,
    domainId: body.domainId || null,
    title: String(body.title),
    objective: body.objective ? String(body.objective) : '',
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  db.testCases.push(created);

  if (body.spec) {
    const version = {
      id: newId(),
      testCaseId: created.id,
      versionNo: 1,
      spec: body.spec,
      changeNote: 'Initial version',
      createdBy: db.users[0].id,
      createdAt: new Date().toISOString(),
    };
    db.testCaseVersions.push(version);
  }

  res.status(201).json(created);
});

// ──────────────────────────────────────────────
// Runs under project
// ──────────────────────────────────────────────

router.get('/projects/:id/runs', (req, res) => {
  const projectId = req.params.id;
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const environmentId = typeof req.query.environmentId === 'string' ? req.query.environmentId : undefined;

  let items = db.runs.filter((r) => r.projectId === projectId);
  if (status) items = items.filter((r) => r.status === status);
  if (environmentId) items = items.filter((r) => r.environmentId === environmentId);

  res.json({ data: items, nextCursor: undefined });
});

router.post('/projects/:id/runs', (req, res) => {
  const projectId = req.params.id;
  const body = req.body || {};
  if (!body.environmentId) {
    return res.status(400).json({ error: 'BadRequest', message: 'environmentId is required' });
  }

  const created = {
    id: newId(),
    projectId,
    environmentId: body.environmentId,
    triggeredBy: db.users[0].id,
    status: 'queued',
    startedAt: null,
    finishedAt: null,
    durationMs: null,
    summary: { total: 0, passed: 0, failed: 0 },
    createdAt: new Date().toISOString(),
  };

  db.runs.push(created);
  res.status(202).json(created);
});

module.exports = router;
