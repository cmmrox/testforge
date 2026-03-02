'use strict';
const { v4: uuidv4 } = require('uuid');
const seedData = require('./seed');

// Deep clone seed collections into mutable state
const db = {
  users: JSON.parse(JSON.stringify(seedData.USERS)),
  projects: JSON.parse(JSON.stringify(seedData.PROJECTS)),
  environments: JSON.parse(JSON.stringify(seedData.ENVIRONMENTS)),
  domains: JSON.parse(JSON.stringify(seedData.DOMAINS)),
  testPlans: JSON.parse(JSON.stringify(seedData.TEST_PLANS)),
  testCases: JSON.parse(JSON.stringify(seedData.TEST_CASES)),
  testCaseVersions: JSON.parse(JSON.stringify(seedData.TEST_CASE_VERSIONS)),
  planItems: JSON.parse(JSON.stringify(seedData.PLAN_ITEMS)),
  runs: JSON.parse(JSON.stringify(seedData.RUNS)),
  runItems: JSON.parse(JSON.stringify(seedData.RUN_ITEMS)),
};

// Helper: generate new UUID
function newId() {
  return uuidv4();
}

// Helper: paginate with cursor (simple offset-based — cursor = base64(index))
function paginate(items, cursor, limit = 20) {
  const offset = cursor ? parseInt(Buffer.from(cursor, 'base64').toString(), 10) : 0;
  const slice = items.slice(offset, offset + limit);
  const nextOffset = offset + slice.length;
  const nextCursor = nextOffset < items.length
    ? Buffer.from(String(nextOffset)).toString('base64')
    : undefined;
  return { data: slice, nextCursor };
}

module.exports = { db, newId, paginate };
