const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createAccount,
  viewBalance,
  creditAccount,
  debitAccount,
  processMenuChoice,
  formatCurrency
} = require('../src/accounting/accounting');

test('starts with the default balance of 1000.00', () => {
  const account = createAccount();
  assert.equal(viewBalance(account), 1000);
});

test('credits funds and updates the balance', () => {
  const account = createAccount();
  const result = creditAccount(account, 250.5);
  assert.equal(result.balance, 1250.5);
  assert.equal(result.message, 'Amount credited. New balance: 1250.50');
});

test('debits funds when sufficient funds are available', () => {
  const account = createAccount();
  const result = debitAccount(account, 100);
  assert.equal(result.balance, 900);
  assert.equal(result.message, 'Amount debited. New balance: 900.00');
});

test('rejects a debit when funds are insufficient', () => {
  const account = createAccount();
  const result = debitAccount(account, 5000);
  assert.equal(result.balance, 1000);
  assert.equal(result.message, 'Insufficient funds for this debit.');
});

test('formats balances with two decimal places', () => {
  assert.equal(formatCurrency(1000), '1000.00');
  assert.equal(formatCurrency(1250.5), '1250.50');
});

test('processes the view balance menu option', () => {
  const account = createAccount();
  const result = processMenuChoice('1', account);
  assert.equal(result.action, 'view');
  assert.equal(result.balance, 1000);
  assert.match(result.message, /Current balance/);
});

test('processes the exit menu option', () => {
  const account = createAccount();
  const result = processMenuChoice('4', account);
  assert.equal(result.action, 'exit');
  assert.equal(result.message, 'Exiting the program. Goodbye!');
});

test('handles an invalid menu option', () => {
  const account = createAccount();
  const result = processMenuChoice('9', account);
  assert.equal(result.action, 'invalid');
  assert.equal(result.message, 'Invalid choice, please select 1-4.');
});
