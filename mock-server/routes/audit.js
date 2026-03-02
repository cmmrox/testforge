'use strict';

const router = require('express').Router();

router.get('/audit/logs', (_req, res) => {
  res.json({ data: [], nextCursor: undefined });
});

module.exports = router;
