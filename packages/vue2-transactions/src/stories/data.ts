export const testAccountsState = {
  accounts: [{
    id: 'f1371fcd-e3bd-4e81-897c-d453d76bca35',
    name: "Bank Checking",
    balance: 6232.43
  },
  {
    id: 'ea42cb3b-cb40-436d-a6ec-9e341789101a',
    name: "Bank Savings",
    balance: 23456.43
  },
  {
    id: '4d62ccfe-4454-4d83-b85c-ec16cb30912a',
    name: "Student Loan",
    balance: -12385.65
  }]
};

export const testTransactionsState = {
  transactions: [
    {
      id: 'db868089-0db2-466e-a7cb-d7c2932d498a',
      date: new Date('05/05/2021'),
      amount: 24.23,
      description: 'Transaction 1',
      account: testAccountsState.accounts[0].name
    },
    {
      id: '54e9a511-53ba-4237-9f34-021e5b28fe81',
      date: new Date('05/07/2021'),
      amount: 554.23,
      description: 'Transaction 2',
      account: testAccountsState.accounts[1].name
    },
    {
      id: '78540449-1d28-4951-bb60-a0875b17bd39',
      date: new Date('05/12/2021'),
      amount: 9.23,
      description: 'Transaction 3',
      account: testAccountsState.accounts[0].name
    }
  ],
  actionText: "Expense",
  actionComponent: "add-expense-action",
  actionFunction: "Expenses/addActionActivated",        
}
