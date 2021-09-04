export const testCategories = [{
  id: '3d106cf7-4b99-43e5-8fdc-f9b3aa68f1d3',
  name: 'Housing'
}];

export const testAccountsState = {
  accounts: [{
    id: 'f1371fcd-e3bd-4e81-897c-d453d76bca35',
    name: "Checking",
    balance: 6232.43
  },
  {
    id: 'ea42cb3b-cb40-436d-a6ec-9e341789101a',
    name: "Savings",
    balance: 23456.43
  },
  {
    id: '4d62ccfe-4454-4d83-b85c-ec16cb30912a',
    name: "Student Loan",
    balance: -12385.65
  }]
};

export const testExpensesState = {
  expenses: [{
    id: '60c2c7a6-0883-48dc-bfa6-9ade9a3df24c',
    date: '2021-05-18T00:00:00+00:00',
    description: 'Expense 1',
    amount: 24.23,
    transaction: {
      id: 'db868089-0db2-466e-a7cb-d7c2932d498a',
      date: new Date('05/05/2021'),
      amount: 24.23,
      description: 'Transaction 1',
      account: testAccountsState.accounts[0].name
    },
    category: testCategories[0].name,
  },
  {
    id: '46782498-1dbc-46a3-8713-72731629b596',
    date: '2021-05-18T00:00:00+00:00',
    description: 'Expense 1',
    amount: 24.23,
    transaction: {
      id: '8105d5db-1f25-406f-a99a-3ffc412b2956',
      date: new Date('05/05/2021'),
      amount: 24.23,
      description: 'Transaction 2',
      account: testAccountsState.accounts[0].name
    },
    category: testCategories[0].name,
  },
  {
    id: 'e483801d-0869-48a7-b0b7-5df94eb24da5',
    date: '2021-05-18T00:00:00+00:00',
    description: 'Expense 1',
    amount: 24.23,
    transaction: {
      id: '3526bdc4-5a58-4bd3-870f-85e6284f23a9',
      date: new Date('05/05/2021'),
      amount: 24.23,
      description: 'Transaction 2',
      account: testAccountsState.accounts[0].name
    },
    category: testCategories[0].name,
  }]
};
