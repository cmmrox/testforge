'use strict';

// ──────────────────────────────────────────────
// Seed UUIDs — fixed so data is stable across restarts
// ──────────────────────────────────────────────

// Users
const USERS = [
  { id: 'a1b2c3d4-0001-4000-8000-100000000001', email: 'admin@testforge.local', role: 'admin', createdAt: '2025-11-01T08:00:00Z' },
  { id: 'a1b2c3d4-0002-4000-8000-100000000002', email: 'editor@testforge.local', role: 'editor', createdAt: '2025-11-01T08:05:00Z' },
];

// Projects
const PROJECTS = [
  {
    id: 'a1b2c3d4-0001-4000-8000-200000000001',
    name: 'Odoo ERP',
    description: 'End-to-end UI tests for the Odoo 17 ERP deployment',
    tags: ['erp', 'odoo', 'regression'],
    archived: false,
    createdAt: '2025-11-15T09:00:00Z',
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-200000000002',
    name: 'Customer Portal',
    description: 'Automated tests for the customer self-service portal',
    tags: ['portal', 'customer-facing'],
    archived: false,
    createdAt: '2025-12-01T10:00:00Z',
  },
];

// Environments
const ENVIRONMENTS = [
  {
    id: 'a1b2c3d4-0001-4000-8000-300000000001',
    projectId: 'a1b2c3d4-0001-4000-8000-200000000001',
    name: 'Staging',
    baseUrl: 'https://staging-erp.codegen.net',
    loginRecipe: {
      loginUrl: 'https://staging-erp.codegen.net/web/login',
      locatorUsername: 'input[name=login]',
      locatorPassword: 'input[name=password]',
      locatorSubmit: 'button[type=submit]',
      locatorPostLoginAssert: '.o_home_menu',
      totpEnabled: false,
    },
    createdAt: '2025-11-16T09:00:00Z',
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-300000000002',
    projectId: 'a1b2c3d4-0001-4000-8000-200000000001',
    name: 'Production',
    baseUrl: 'https://erp.codegen.net',
    loginRecipe: null,
    createdAt: '2025-11-16T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0003-4000-8000-300000000003',
    projectId: 'a1b2c3d4-0002-4000-8000-200000000002',
    name: 'Staging',
    baseUrl: 'https://staging-portal.codegen.net',
    loginRecipe: null,
    createdAt: '2025-12-02T09:00:00Z',
  },
];

// Domains
const DOMAINS = [
  { id: 'a1b2c3d4-0001-4000-8000-400000000001', projectId: 'a1b2c3d4-0001-4000-8000-200000000001', name: 'Authentication', color: '#3b82f6', createdAt: '2025-11-16T11:00:00Z' },
  { id: 'a1b2c3d4-0002-4000-8000-400000000002', projectId: 'a1b2c3d4-0001-4000-8000-200000000001', name: 'Sales', color: '#22c55e', createdAt: '2025-11-16T11:05:00Z' },
  { id: 'a1b2c3d4-0003-4000-8000-400000000003', projectId: 'a1b2c3d4-0001-4000-8000-200000000001', name: 'Inventory', color: '#f97316', createdAt: '2025-11-16T11:10:00Z' },
  { id: 'a1b2c3d4-0004-4000-8000-400000000004', projectId: 'a1b2c3d4-0001-4000-8000-200000000001', name: 'Accounting', color: '#a855f7', createdAt: '2025-11-16T11:15:00Z' },
  { id: 'a1b2c3d4-0005-4000-8000-400000000005', projectId: 'a1b2c3d4-0002-4000-8000-200000000002', name: 'Onboarding', color: '#14b8a6', createdAt: '2025-12-02T10:00:00Z' },
  { id: 'a1b2c3d4-0006-4000-8000-400000000006', projectId: 'a1b2c3d4-0002-4000-8000-200000000002', name: 'Dashboard', color: '#6366f1', createdAt: '2025-12-02T10:05:00Z' },
];

// Test Plans
const TEST_PLANS = [
  {
    id: 'a1b2c3d4-0001-4000-8000-500000000001',
    projectId: 'a1b2c3d4-0001-4000-8000-200000000001',
    domainId: 'a1b2c3d4-0001-4000-8000-400000000001',
    title: 'Login & Session Management',
    description: 'All tests covering user login, logout, and session behaviour.',
    status: 'approved',
    generatedBy: 'manual',
    createdBy: 'a1b2c3d4-0001-4000-8000-100000000001',
    createdAt: '2025-11-20T09:00:00Z',
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-500000000002',
    projectId: 'a1b2c3d4-0001-4000-8000-200000000001',
    domainId: 'a1b2c3d4-0002-4000-8000-400000000002',
    title: 'Sales Order Flow',
    description: 'Create lead → quotation → sale order → invoice.',
    status: 'approved',
    generatedBy: 'agent',
    createdBy: 'a1b2c3d4-0001-4000-8000-100000000001',
    createdAt: '2025-11-25T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0003-4000-8000-500000000003',
    projectId: 'a1b2c3d4-0001-4000-8000-200000000001',
    domainId: 'a1b2c3d4-0003-4000-8000-400000000003',
    title: 'Inventory Receipts',
    description: 'Receive stock, validate moves, check quant.',
    status: 'draft',
    generatedBy: 'agent',
    createdBy: 'a1b2c3d4-0002-4000-8000-100000000002',
    createdAt: '2025-12-05T14:00:00Z',
  },
  {
    id: 'a1b2c3d4-0004-4000-8000-500000000004',
    projectId: 'a1b2c3d4-0002-4000-8000-200000000002',
    domainId: 'a1b2c3d4-0005-4000-8000-400000000005',
    title: 'Customer Registration',
    description: 'New customer signup and profile completion.',
    status: 'approved',
    generatedBy: 'manual',
    createdBy: 'a1b2c3d4-0001-4000-8000-100000000001',
    createdAt: '2025-12-10T09:00:00Z',
  },
];

// Test Cases
const TEST_CASES = [
  {
    id: 'a1b2c3d4-0001-4000-8000-600000000001',
    projectId: 'a1b2c3d4-0001-4000-8000-200000000001',
    domainId: 'a1b2c3d4-0001-4000-8000-400000000001',
    title: 'Admin login with valid credentials',
    objective: 'Verify admin can log in successfully',
    tags: ['smoke', 'auth'],
    status: 'active',
    createdAt: '2025-11-20T09:30:00Z',
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-600000000002',
    projectId: 'a1b2c3d4-0001-4000-8000-200000000001',
    domainId: 'a1b2c3d4-0001-4000-8000-400000000001',
    title: 'Login with invalid password shows error',
    objective: 'Verify error message on wrong password',
    tags: ['auth', 'negative'],
    status: 'active',
    createdAt: '2025-11-20T09:45:00Z',
  },
  {
    id: 'a1b2c3d4-0003-4000-8000-600000000003',
    projectId: 'a1b2c3d4-0001-4000-8000-200000000001',
    domainId: 'a1b2c3d4-0002-4000-8000-400000000002',
    title: 'Create sales quotation from lead',
    objective: 'Verify a lead can be converted to a quotation',
    tags: ['sales', 'smoke'],
    status: 'active',
    createdAt: '2025-11-25T10:30:00Z',
  },
  {
    id: 'a1b2c3d4-0004-4000-8000-600000000004',
    projectId: 'a1b2c3d4-0001-4000-8000-200000000001',
    domainId: 'a1b2c3d4-0002-4000-8000-400000000002',
    title: 'Confirm sale order and check invoice',
    objective: 'Confirm SO and verify invoice is generated',
    tags: ['sales'],
    status: 'active',
    createdAt: '2025-11-25T11:00:00Z',
  },
  {
    id: 'a1b2c3d4-0005-4000-8000-600000000005',
    projectId: 'a1b2c3d4-0002-4000-8000-200000000002',
    domainId: 'a1b2c3d4-0005-4000-8000-400000000005',
    title: 'New customer registers via email',
    objective: 'Verify registration form and confirmation email',
    tags: ['onboarding', 'smoke'],
    status: 'active',
    createdAt: '2025-12-10T09:30:00Z',
  },
];

// Test Case Versions
const TEST_CASE_VERSIONS = [
  {
    id: 'a1b2c3d4-0001-4000-8000-700000000001',
    testCaseId: 'a1b2c3d4-0001-4000-8000-600000000001',
    versionNo: 1,
    spec: {
      kind: 'ui',
      title: 'Admin login with valid credentials',
      preconditions: ['Admin account exists with email admin@erp.local'],
      steps: [
        { type: 'navigate', url: '${BASE_URL}/web/login' },
        { type: 'fill', locator: 'input[name=login]', value: '${ENV_USERNAME}' },
        { type: 'fill', locator: 'input[name=password]', value: '${ENV_PASSWORD}', mask: true },
        { type: 'click', locator: 'button[type=submit]' },
        { type: 'assertVisible', locator: '.o_home_menu', locatorHint: 'Odoo home menu visible after login' },
      ],
      evidence: { screenshots: 'onFail', video: 'onFail', trace: 'onFail' },
    },
    changeNote: 'Initial version',
    createdBy: 'a1b2c3d4-0001-4000-8000-100000000001',
    createdAt: '2025-11-20T09:30:00Z',
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-700000000002',
    testCaseId: 'a1b2c3d4-0002-4000-8000-600000000002',
    versionNo: 1,
    spec: {
      kind: 'ui',
      title: 'Login with invalid password shows error',
      preconditions: [],
      steps: [
        { type: 'navigate', url: '${BASE_URL}/web/login' },
        { type: 'fill', locator: 'input[name=login]', value: 'admin@erp.local' },
        { type: 'fill', locator: 'input[name=password]', value: 'wrongpassword', mask: true },
        { type: 'click', locator: 'button[type=submit]' },
        { type: 'assertVisible', locator: '.o_error_dialog', locatorHint: 'Error dialog visible' },
        { type: 'assertText', locator: '.o_error_dialog', assertion: 'Wrong login/password' },
      ],
      evidence: { screenshots: 'always', video: 'onFail', trace: 'onFail' },
    },
    changeNote: 'Initial version',
    createdBy: 'a1b2c3d4-0001-4000-8000-100000000001',
    createdAt: '2025-11-20T09:45:00Z',
  },
  {
    id: 'a1b2c3d4-0003-4000-8000-700000000003',
    testCaseId: 'a1b2c3d4-0003-4000-8000-600000000003',
    versionNo: 1,
    spec: {
      kind: 'ui',
      title: 'Create sales quotation from lead',
      preconditions: ['User has access to CRM module'],
      steps: [
        { type: 'navigate', url: '${BASE_URL}/odoo/crm' },
        { type: 'click', locator: 'button[name=action_new_quotation]' },
        { type: 'fill', locator: 'div[name=partner_id] input', value: 'Test Customer' },
        { type: 'click', locator: '.o_m2o_dropdown_option' },
        { type: 'click', locator: 'button[name=action_confirm]' },
        { type: 'assertVisible', locator: '.o_statusbar_status .o_arrow_button_current', locatorHint: 'Status bar shows Sales Order' },
      ],
      evidence: { screenshots: 'onFail', video: 'onFail', trace: 'onFail' },
    },
    changeNote: 'Initial version',
    createdBy: 'a1b2c3d4-0002-4000-8000-100000000002',
    createdAt: '2025-11-25T10:30:00Z',
  },
];

// Test Plan → Test Case links
const PLAN_ITEMS = [
  { planId: 'a1b2c3d4-0001-4000-8000-500000000001', testCaseId: 'a1b2c3d4-0001-4000-8000-600000000001', latestVersionId: 'a1b2c3d4-0001-4000-8000-700000000001' },
  { planId: 'a1b2c3d4-0001-4000-8000-500000000001', testCaseId: 'a1b2c3d4-0002-4000-8000-600000000002', latestVersionId: 'a1b2c3d4-0002-4000-8000-700000000002' },
  { planId: 'a1b2c3d4-0002-4000-8000-500000000002', testCaseId: 'a1b2c3d4-0003-4000-8000-600000000003', latestVersionId: 'a1b2c3d4-0003-4000-8000-700000000003' },
  { planId: 'a1b2c3d4-0002-4000-8000-500000000002', testCaseId: 'a1b2c3d4-0004-4000-8000-600000000004', latestVersionId: null },
];

// Runs
const RUNS = [
  {
    id: 'a1b2c3d4-0001-4000-8000-800000000001',
    projectId: 'a1b2c3d4-0001-4000-8000-200000000001',
    environmentId: 'a1b2c3d4-0001-4000-8000-300000000001',
    triggeredBy: 'a1b2c3d4-0001-4000-8000-100000000001',
    status: 'passed',
    startedAt: '2026-01-10T08:00:00Z',
    finishedAt: '2026-01-10T08:04:32Z',
    durationMs: 272000,
    summary: { total: 2, passed: 2, failed: 0 },
    createdAt: '2026-01-10T07:59:55Z',
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-800000000002',
    projectId: 'a1b2c3d4-0001-4000-8000-200000000001',
    environmentId: 'a1b2c3d4-0001-4000-8000-300000000001',
    triggeredBy: 'a1b2c3d4-0001-4000-8000-100000000001',
    status: 'failed',
    startedAt: '2026-01-15T09:30:00Z',
    finishedAt: '2026-01-15T09:33:12Z',
    durationMs: 192000,
    summary: { total: 2, passed: 1, failed: 1 },
    createdAt: '2026-01-15T09:29:50Z',
  },
];

const RUN_ITEMS = [
  { id: 'a1b2c3d4-0001-4000-8000-900000000001', runId: 'a1b2c3d4-0001-4000-8000-800000000001', testCaseVersionId: 'a1b2c3d4-0001-4000-8000-700000000001', status: 'passed', startedAt: '2026-01-10T08:00:05Z', finishedAt: '2026-01-10T08:02:10Z', durationMs: 125000, failureSummary: null },
  { id: 'a1b2c3d4-0002-4000-8000-900000000002', runId: 'a1b2c3d4-0001-4000-8000-800000000001', testCaseVersionId: 'a1b2c3d4-0002-4000-8000-700000000002', status: 'passed', startedAt: '2026-01-10T08:02:15Z', finishedAt: '2026-01-10T08:04:30Z', durationMs: 135000, failureSummary: null },
  { id: 'a1b2c3d4-0003-4000-8000-900000000003', runId: 'a1b2c3d4-0002-4000-8000-800000000002', testCaseVersionId: 'a1b2c3d4-0001-4000-8000-700000000001', status: 'passed', startedAt: '2026-01-15T09:30:05Z', finishedAt: '2026-01-15T09:31:50Z', durationMs: 105000, failureSummary: null },
  { id: 'a1b2c3d4-0004-4000-8000-900000000004', runId: 'a1b2c3d4-0002-4000-8000-800000000002', testCaseVersionId: 'a1b2c3d4-0002-4000-8000-700000000002', status: 'failed', startedAt: '2026-01-15T09:31:55Z', finishedAt: '2026-01-15T09:33:10Z', durationMs: 75000, failureSummary: 'assertVisible failed: .o_error_dialog not found within 5000ms' },
];

module.exports = { USERS, PROJECTS, ENVIRONMENTS, DOMAINS, TEST_PLANS, TEST_CASES, TEST_CASE_VERSIONS, PLAN_ITEMS, RUNS, RUN_ITEMS };
