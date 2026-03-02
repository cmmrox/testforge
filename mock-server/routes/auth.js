'use strict';

const router = require('express').Router();
const { db } = require('../store');

// Any login succeeds. If email matches a seeded user, return that user; otherwise return the admin.
router.post('/auth/login', (req, res) => {
  const { email } = req.body || {};
  const user = (email && db.users.find((u) => u.email === email)) || db.users[0];

  res.cookie('testforge_session', 'mock', { httpOnly: true, path: '/' });
  res.json({
    user,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
});

router.post('/auth/logout', (_req, res) => {
  res.clearCookie('testforge_session', { path: '/' });
  res.status(204).end();
});

router.get('/auth/me', (_req, res) => {
  res.json(db.users[0]);
});

module.exports = router;
