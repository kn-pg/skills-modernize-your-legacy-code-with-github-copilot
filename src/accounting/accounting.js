function createAccount(initialBalance = 1000) {
  return { balance: initialBalance };
}

function formatCurrency(amount) {
  return Number(amount).toFixed(2);
}

function viewBalance(account) {
  return account.balance;
}

function creditAccount(account, amount) {
  account.balance += Number(amount);
  return {
    balance: account.balance,
    message: `Amount credited. New balance: ${formatCurrency(account.balance)}`
  };
}

function debitAccount(account, amount) {
  const parsedAmount = Number(amount);
  if (account.balance >= parsedAmount) {
    account.balance -= parsedAmount;
    return {
      balance: account.balance,
      message: `Amount debited. New balance: ${formatCurrency(account.balance)}`
    };
  }

  return {
    balance: account.balance,
    message: 'Insufficient funds for this debit.'
  };
}

function processMenuChoice(choice, account) {
  switch (choice) {
    case '1':
      return {
        action: 'view',
        balance: viewBalance(account),
        message: `Current balance: ${formatCurrency(viewBalance(account))}`
      };
    case '2':
      return {
        action: 'credit',
        message: 'Credit operation selected.'
      };
    case '3':
      return {
        action: 'debit',
        message: 'Debit operation selected.'
      };
    case '4':
      return {
        action: 'exit',
        message: 'Exiting the program. Goodbye!'
      };
    default:
      return {
        action: 'invalid',
        message: 'Invalid choice, please select 1-4.'
      };
  }
}

function runInteractiveApp() {
  const account = createAccount();
  const readline = require('node:readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function prompt() {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
    rl.question('Enter your choice (1-4): ', (answer) => {
      const result = processMenuChoice(answer, account);
      if (result.action === 'view') {
        console.log(`Current balance: ${formatCurrency(result.balance)}`);
        prompt();
      } else if (result.action === 'credit') {
        rl.question('Enter credit amount: ', (amount) => {
          const creditResult = creditAccount(account, amount);
          console.log(creditResult.message);
          prompt();
        });
      } else if (result.action === 'debit') {
        rl.question('Enter debit amount: ', (amount) => {
          const debitResult = debitAccount(account, amount);
          console.log(debitResult.message);
          prompt();
        });
      } else if (result.action === 'exit') {
        console.log(result.message);
        rl.close();
      } else {
        console.log(result.message);
        prompt();
      }
    });
  }

  prompt();
}

if (require.main === module) {
  runInteractiveApp();
}

module.exports = {
  createAccount,
  formatCurrency,
  viewBalance,
  creditAccount,
  debitAccount,
  processMenuChoice,
  runInteractiveApp
};
