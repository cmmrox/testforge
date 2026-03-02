'use strict';
const router = require('express').Router();
const { db } = require('../store');

function findEnv(req, res) {
  const e = db.environments.find(x => x.id === req.params.id);
  if (!e) { res.status(404).json({ error: 'NotFound', message: 'Environment not found' }); return null; }
  return e;
}

router.get('/environments/:id', (req, res) => {
  const e = findEnv(req, res);
  if (e) res.json(e);
});

router.patch('/environments/:id', (req, res) => {
  const e = findEnv(req, res);
  if (!e) return;
  Object.assign(e, req.body);
  res.json(e);
});

router.delete('/environments/:id', (req, res) => {
  const idx = db.environments.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'NotFound', message: 'Environment not found' });
  db.environments.splice(idx, 1);
  res.status(204).end();
});

router.post('/environments/:id/test-connection', (req, res) => {
  const e = findEnv(req, res);
  if (!e) return;
  res.json({ reachable: true, latencyMs: 42, statusCode: 200 });
});

module.exports = router;
