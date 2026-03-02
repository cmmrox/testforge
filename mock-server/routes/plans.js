'use strict';

const router = require('express').Router();
const { db } = require('../store');

function findPlan(req, res) {
  const p = db.testPlans.find((x) => x.id === req.params.id);
  if (!p) {
    res.status(404).json({ error: 'NotFound', message: 'Test plan not found' });
    return null;
  }
  return p;
}

router.get('/test-plans/:id', (req, res) => {
  const p = findPlan(req, res);
  if (!p) return;

  // Minimal detail shape (OpenAPI: TestPlanDetail adds recommendedCases + risks)
  res.json({
    ...p,
    recommendedCases: [],
    risks: [],
  });
});

router.patch('/test-plans/:id', (req, res) => {
  const p = findPlan(req, res);
  if (!p) return;
  Object.assign(p, req.body);
  res.json(p);
});

router.delete('/test-plans/:id', (req, res) => {
  const p = findPlan(req, res);
  if (!p) return;
  p.status = 'archived';
  res.status(204).end();
});

router.post('/test-plans/:id/approve', (req, res) => {
  const p = findPlan(req, res);
  if (!p) return;
  p.status = 'approved';
  res.json(p);
});

router.get('/test-plans/:id/items', (req, res) => {
  const planId = req.params.id;
  const items = db.planItems.filter((x) => x.planId === planId);
  res.json({ data: items });
});

module.exports = router;
