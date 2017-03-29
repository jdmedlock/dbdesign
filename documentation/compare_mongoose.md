```
...
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri)
.then(() => {
  const query = Account.find({})
    .where('owner_fname').equals('Roger')
    .sort('owner_lname');
  query.exec()
  .then((accounts) => {
    accounts.forEach((anAccount) => {
      log.addEntry(`Account: ${anAccount.account_no}
        owner_fname:${anAccount.owner_fname}
        owner_mi:${anAccount.owner_mi}
        owner_lname:${anAccount.owner_lname}
        created_on:${anAccount.created_on}
        updated_on:${anAccount.updated_on}`);
    });
    mongoose.disconnect();
    log.writeLog('normal', response, 'simplequery test successfully completed');
  })
  .catch((error) => {
    // Handle document retrieval error
    mongoose.disconnect();
  });
})
.catch((error) => {
  // Handle connection error
});
...
```