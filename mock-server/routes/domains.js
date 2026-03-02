'use strict';

const router = require('express').Router();
const { db } = require('../store');

function findDomain(req, res) {
  const d = db.domains.find((x) => x.id === req.params.id);
  if (!d) {
    res.status(404).json({ error: 'NotFound', message: 'Domain not found' });
    return null;
  }
  return d;
}

router.patch('/domains/:id', (req, res) => {
  const d = findDomain(req, res);
  if (!d) return;
  Object.assign(d, req.body);
  res.json(d);
});

router.delete('/domains/:id', (req, res) => {
  const idx = db.domains.findIndex((x) => x.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'NotFound', message: 'Domain not found' });
  }
  db.domains.splice(idx, 1);
  res.status(204).end();
});

module.exports = router;
