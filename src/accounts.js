const accounts = [
  {
    username: "test1",
    id: 1,
    transactions: [],
},
{
    username: "test2",
    id: 2,
    transactions: [],
},
{
    username: "test3",
    id: 3,
    transactions: [],
},
{
  username: "test4",
  id: 4,
  transactions: [],
},
];

export const getAccounts = () => {
  return accounts;
};

export const addAccount = (username) => {
  const newAccount = { username, id: accounts.length + 1, transactions: [] };
  accounts.push(newAccount);
  return newAccount;
};

export const validateAccount = (accountId) => {
  return accounts.find((acc) => acc.id === accountId);
};

export default { getAccounts, addAccount, validateAccount };
