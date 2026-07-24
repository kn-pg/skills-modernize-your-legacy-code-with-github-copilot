const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createAccount,
  viewBalance,
  creditAccount,
  debitAccount,
  processMenuChoice,
  formatCurrency
} = require('../accounting');

test('TC-001: application menu is displayed with the expected options', () => {
  const account = createAccount();
  const result = processMenuChoice('1', account);
  assert.equal(result.action, 'view');
  assert.match(result.message, /Current balance/);
});

test('TC-002: user can view the current balance', () => {
  const account = createAccount();
  const balance = viewBalance(account);
  assert.equal(balance, 1000);
  assert.equal(formatCurrency(balance), '1000.00');
});

test('TC-003: user can credit funds and the balance increases', () => {
  const account = createAccount();
  const result = creditAccount(account, 250.5);
  assert.equal(result.balance, 1250.5);
  assert.equal(result.message, 'Amount credited. New balance: 1250.50');
});

test('TC-004: user can debit funds when sufficient funds are available', () => {
  const account = createAccount();
  const result = debitAccount(account, 100);
  assert.equal(result.balance, 900);
  assert.equal(result.message, 'Amount debited. New balance: 900.00');
});

test('TC-005: debit is rejected when funds are insufficient', () => {
  const account = createAccount();
  const result = debitAccount(account, 5000);
  assert.equal(result.balance, 1000);
  assert.equal(result.message, 'Insufficient funds for this debit.');
});

test('TC-006: invalid menu options are handled correctly', () => {
  const account = createAccount();
  const result = processMenuChoice('9', account);
  assert.equal(result.action, 'invalid');
  assert.equal(result.message, 'Invalid choice, please select 1-4.');
});

test('TC-007: exit option terminates the application flow', () => {
  const account = createAccount();
  const result = processMenuChoice('4', account);
  assert.equal(result.action, 'exit');
  assert.equal(result.message, 'Exiting the program. Goodbye!');
});

test('TC-008: balance remains consistent across consecutive operations', () => {
  const account = createAccount();
  const first = creditAccount(account, 100);
  const second = debitAccount(account, 50);
  assert.equal(first.balance, 1100);
  assert.equal(second.balance, 1050);
  assert.equal(viewBalance(account), 1050);
});

test('TC-009: happy path flow updates the balance correctly', () => {
  const account = createAccount();
  const viewBefore = viewBalance(account);
  const creditResult = creditAccount(account, 250);
  const balanceAfterCredit = viewBalance(account);
  const debitResult = debitAccount(account, 100);
  const balanceAfterDebit = viewBalance(account);

  assert.equal(viewBefore, 1000);
  assert.equal(creditResult.balance, 1250);
  assert.equal(balanceAfterCredit, 1250);
  assert.equal(debitResult.balance, 1150);
  assert.equal(balanceAfterDebit, 1150);
});

test('TC-010: numeric transaction amounts are accepted and processed', () => {
  const account = createAccount();
  const result = creditAccount(account, '300.25');
  assert.equal(result.balance, 1300.25);
  assert.equal(result.message, 'Amount credited. New balance: 1300.25');
});
