```
...
mongoClient.connect(mongoUri)
.then((db) => {
  return collection.find(
    { owner_fname: { $eq: 'Roger' } });
})
.then((cursor) => {
  return cursor.sort({ owner_lname: 1 });
})
.then((cursor) => {
  cursor.each((error, anAccount) => {
    if (anAccount === null) {
      log.writeLog('normal', response,
        'Simplequery test successfully completed');
      return;
    }
    log.addEntry(`Account: ${anAccount.account_no} 
      owner_fname:${anAccount.owner_fname}
      owner_mi:${anAccount.owner_mi} 
      owner_lname:${anAccount.owner_lname}
      created_on:${anAccount.created_on}  
      updated_on:${anAccount.updated_on}`);
  });
  accountsDb.close();
})   
.catch((error) => { 
  // Handle connection error  
});   
...
```