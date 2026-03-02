'use strict';

const router = require('express').Router();
const { db } = require('../store');

function findRun(req, res) {
  const r = db.runs.find((x) => x.id === req.params.id);
  if (!r) {
    res.status(404).json({ error: 'NotFound', message: 'Run not found' });
    return null;
  }
  return r;
}

router.get('/runs/:id', (req, res) => {
  const r = findRun(req, res);
  if (!r) return;
  const items = db.runItems.filter((it) => it.runId === r.id);
  res.json({
    ...r,
    items,
    artifacts: [],
  });
});

// Worker hook: merge updates
router.post('/runs/:id', (req, res) => {
  const r = findRun(req, res);
  if (!r) return;
  Object.assign(r, req.body);
  res.json(r);
});

router.get('/runs/:id/items', (req, res) => {
  const runId = req.params.id;
  const items = db.runItems.filter((it) => it.runId === runId);
  res.json({ data: items });
});

router.get('/runs/:id/artifacts', (_req, res) => {
  res.json({ data: [] });
});

router.get('/artifacts/:id', (_req, res) => {
  res.status(404).json({ error: 'NotFound', message: 'Artifact not found' });
});

module.exports = router;
