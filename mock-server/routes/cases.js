'use strict';

const router = require('express').Router();
const { db, newId } = require('../store');

function latestVersionForCase(testCaseId) {
  const versions = db.testCaseVersions.filter((v) => v.testCaseId === testCaseId);
  if (versions.length === 0) return null;
  return versions.reduce((acc, v) => (v.versionNo > acc.versionNo ? v : acc), versions[0]);
}

function findCase(req, res) {
  const c = db.testCases.find((x) => x.id === req.params.id);
  if (!c) {
    res.status(404).json({ error: 'NotFound', message: 'Test case not found' });
    return null;
  }
  return c;
}

router.get('/test-cases/:id', (req, res) => {
  const c = findCase(req, res);
  if (!c) return;
  const latestVersion = latestVersionForCase(c.id);
  res.json({
    ...c,
    latestVersion: latestVersion || undefined,
    versions: undefined,
  });
});

router.patch('/test-cases/:id', (req, res) => {
  const c = findCase(req, res);
  if (!c) return;
  Object.assign(c, req.body);
  res.json(c);
});

router.delete('/test-cases/:id', (req, res) => {
  const c = findCase(req, res);
  if (!c) return;
  c.status = 'archived';
  res.status(204).end();
});

router.get('/test-cases/:id/versions', (req, res) => {
  const testCaseId = req.params.id;
  const versions = db.testCaseVersions
    .filter((v) => v.testCaseId === testCaseId)
    .sort((a, b) => a.versionNo - b.versionNo);
  res.json({ data: versions });
});

router.post('/test-cases/:id/versions', (req, res) => {
  const testCaseId = req.params.id;
  const existing = db.testCaseVersions.filter((v) => v.testCaseId === testCaseId);
  const nextNo = existing.length === 0 ? 1 : Math.max(...existing.map((v) => v.versionNo)) + 1;

  const created = {
    id: newId(),
    testCaseId,
    versionNo: nextNo,
    spec: (req.body && req.body.spec) || { kind: 'ui', steps: [] },
    changeNote: (req.body && req.body.changeNote) || '',
    createdBy: db.users[0].id,
    createdAt: new Date().toISOString(),
  };
  db.testCaseVersions.push(created);
  res.status(201).json(created);
});

router.get('/test-case-versions/:id', (req, res) => {
  const v = db.testCaseVersions.find((x) => x.id === req.params.id);
  if (!v) {
    return res.status(404).json({ error: 'NotFound', message: 'Test case version not found' });
  }
  res.json(v);
});

module.exports = router;
