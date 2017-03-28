# DBDesign - Adventures in MongoDB & Mongoose

## Overview

This repo contains the components of a MongoDB/Express/NodeJS application 
which demonstrates the use and power of both MongoDB and Mongoose. It's purpose 
is to be a guide showing how to build applications from simple MongoDB-only 
applications up to more complex, real-world applications that leverage the 
power of Mongoose.

## A Little Historical Context

Databases fall into several different categories. The earliest databases, up
through the mid-1980's, were so-called [CODASYL](https://en.wikipedia.org/wiki/CODASYL) 
databases which organized data into records and related record occurrances of 
one type to another using hashes to form a network. Although generally efficient 
CODASYL-style databases, like [IDMS](https://en.wikipedia.org/wiki/IDMS) from 
Cullinet Software and 
[IMS](https://en.wikipedia.org/wiki/IBM_Information_Management_System) from IBM, 
the context and navigation required that the application bet exposed to the 
physical relationship between records. 

This had the impact of increasing the complexity of applications. In
addition, the embedded dependency of the physical database schema into the
application meant that database changes required extensive application 
modification and testing.

For example, a common relationship is that of a parent and child where a
parent record occurrance owns one or more occurrances of child records. This
type of relationship is used to maintain Savings Account records for an
individual and connect them with individual Transaction records representing
activity against it.

The following seudo-code shows  how an application accesses the records for 
this type of relationship in a CODASYL database, in this case CA-IDMS:

```
    INITIALIZE ACCOUNT
    Move account number '111111' to the Account field in record
    OBTAIN CALC ACCOUNT
    Do-Forever
      OBTAIN NEXT Transaction WITHIN Account-Transaction
      If no more Transaction records then break
      If transaction-type = 'deposit'
        then
          <<do something with the data>>
      End-If
    End-Do
```

In the early 1980's a new type of database based on the [Structured Query
Language (SQL)](https://en.wikipedia.org/wiki/SQL) begain to take hold. 
The main advantage of a SQL database had
over a CODASYL database is that manipulating data was simpler since data
in a SQL database is organized relationally rather than physically. This
meant that application programs became simpler to write and maintain.

```
    SELECT account-no, transaction-date, transaction-type, transaction-amount
      FROM ACCOUNT, TRANSACTION
      WHERE account-no = '111111'
        AND transaction-account-no = account-no
        AND transaction-type = 'deposit'
```

The SQL example above demonstrates the power of SQL. Rather than requiring
navigational logic in the application to traverse the database, data is
retrived based on a shared key value between the Account and Transaction.
Namely, the account number. The SELECT directive results in the database
management system returning a the exact set of data required by the program.

With the rise of the Internet in the late 1990's applications shifted from
dealing strictly with highly *structured* data, like accounts and transactions,
to also dealing with *unstructured* data like plain text. Just as important
was the fact that applications needed to be able to quickly adapt to new
requirements and to scale to support transactional volumes which far exceeded
what was seen in older mainframe and distributed computing environments.

[NoSQL](https://en.wikipedia.org/wiki/NoSQL) database were developed to provide 
an environment that supported change without requiring radical reengineering 
of the underlying data model, high volumes of data, and an architecture that 
was easy to scale.

## What is MongoDB?

[MongoDB](https://www.mongodb.com/) is an Open Source, NoSQL database management 
system that contains the following features:

- Ad hoc queries
- Indexing
- Load Balancing
- Replicated file storage over multiple servers
- Data aggregation
- Server-side Javascript execution
- Capped collections

MongoDB is a *document-based* database management system which leverages a
[JSON](https://en.wikipedia.org/wiki/JSON)-style storage format known as 
*binary JSON*, or [BSON](https://en.wikipedia.org/wiki/BSON), 
to achieve high throughput. BSON makes it easy for applications to extract 
and manipulate data, as well as allowing properties to be efficiently 
indexed, mapped, and nested in support of complex query operations and 
experssions.

For example, using the Account example above all Transactions for account
'111111' that are deposits can be retrieved using:

```
    db.transaction.find({
      transaction-account-no:/'111111',
      transaction-type: /'deposit'/
    })
```

### MongoDB Application Structure

MongoDB applications consist of the three basic components:

1. Establish a connection to a MongoDB instance
2. Logic to access and manipulate database data
3. Close the connection to the MongoDB instance

#### Establish a connection to a MongoDB instance

Before any requests can be made to MongoDB a connection must first be
created. Establishing a connection is similar to placing a telephone
call in that you need the "phone number" of the MongoDB instance and
database the application is to interact with. This "phone number"
is made up of the following:

   - Host name of the MongoDB instance
   - Database name

In addition to the "phone number" the following connection parameters 
may also be specified.

   - User id and password
   - Options

The host name and database name are required, but the remaining 
connection parameters are optional. For simplicity the examples that
follow use only the host and database names. However, in a production
environment you will always want to secure database access by 
requiring that users and applications authenticate by specifying an
authorized user id and password.

Since database access is typically distributed across more than one
source file in an application a best practice is to isolate the 
host and database names into a `config.js` file that is shared across
all application components. The advantage of this is that altering 
either or both of these only requires an update to the `config.js`
file rather than to each application source file that requires a
connection.

The contents of the `config.js` file are:

```
let config = {};
config.db = {};

// Create properties on the config.db object for the host and database names
config.db.host = 'localhost:27017';
config.db.name = 'account';

module.exports = config;
```

To establish a MongoDB connection using the properties in the `config.js` file 
a `require` must be issued to allow the properties in it to be referenced from 
within the source file creating the connection. These properties are then used
to create the URI connection string and a [MongoClient](http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html) reference 
that subsequent database requests will be issued through. The first such request 
is `mongoClient.connect(mongoUri)` which creates the connection
and returns a reference to the client instance.

```
const config = require('../config');
const mongodb = require('mongodb');
    ...
// Establish a mongo connection using settings from the config.js file
const mongoUri = `mongodb://${config.db.host}/${config.db.name}`;
const mongoClient = mongodb.MongoClient;
    ...
mongoClient.connect(mongoUri)
  .then((db) => {
    ...
  })
  .catch((err) => {
    ...
  });
```

#### Logic to access and manipulate database data

Once a connection has been established the application is ready to access and
manipulate documents in the database. The first step in this process is to define
the document collection within the database. This is conceptually similar to a 
table in a relational database (RDBMS). Unlike tables in an RDBMS whose rows all
have a the same format a collection can contain different types of documents, each
having a different format.

In our example the collection is created by the function call: 

```collection = accountsDb.collection('accounts');``` 

   which defines a reference to the collection ```accounts```.  

Once the collection is created it can be used to invoke MongoDB 
function calls to access documents in the database. For example, 
```collection.count()``` returns the number of documents in the collection.

```
    ...
  mongoClient.connect(mongoUri)
  .then((db) => {
    accountsDb = db;
    collection = accountsDb.collection('accounts');
    log.addEntry('Successfully connected to MongoDB');
    return collection.count();
  })
  .then((count) => {
    log.addEntry(`Existing record count: ${count}`);
    return collection.find();
  })
  .then((cursor) => {
    cursor.each((error, anAccount) => {
      if (anAccount === null) {
        log.writeLog('normal', response, 'Findall test successfully completed');
        return;
      }
      log.addEntry(`Account: account_no:${anAccount.account_no} 
        owner_fname:${anAccount.owner_fname} 
        owner_mi:${anAccount.owner_mi} 
        owner_lname:${anAccount.owner_lname}`);
    });
    ...
  })
  .catch((err) => {
    ...
  });
```

It's important to make note of the fact that instead of using callbacks in our MongoDB
function calls we are instead using Javascript [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
This has been done to avoid falling into the ["callback Hell"](http://callbackhell.com/)
that can result from nested callbacks. The main attribute of "callback Hell" is the source 
code takes on a pyramidial shape and the impact is it becomes increasingly difficult to
understand and maintain as the number of levels increase.

Promises help to eliminating the "nest", which serves to simplify the code making it easier 
to ready and thus easier to maintain. The way this works is the logic in the ```.then()```
is executed only when the associated Promise has been resolved. Conversely, the ```.catch()```
is executed only if the Promise was rejected. In other words, if an error was detected.

#### Close the connection to the MongoDB instance 

After when the application has completed its goal and no more data is to be retrieved from 
the MongoDB it's a good practice to gracefully terminate the connection to the MongoDB 
instance. This is accomplished by closing the connection. In the example above this is
done by calling the ```accountsDb.close()``` function to stop the connection and free up
any resources devoted to it.

```
    ...
  mongoClient.connect(mongoUri)
  .then((db) => {
    accountsDb = db;
    ...
  })
  .then((count) => {
    ...
  })
  .then((cursor) => {
    ...
    accountsDb.close();
  })
  .catch((err) => {
    ...
  });
```

You may have noticed that in the first ```.then(db)``` function the value of 
```db``` was saved to a variable called ```accountDb```. This was done in 
anticipation of it being needed later in the application logic to close the 
connection. This was necessary since the scope of ```db``` is limited to that
first ```.then(db)``` function.

One additional consideration is there are cases where you may not want to 
close the connection. Since opening and closing connections are relatively
expensive high volume applications might want to use [connection pooling](https://blog.mlab.com/2013/11/deep-dive-into-connection-pooling/) to 
reuse connections rather than continually opening and closing new ones.

## What is Mongoose?

MongooseJS is an [Object Document Mapper (ODM)](https://dzone.com/articles/era-object-document-mapping) 
that makes using MongoDB easiser by translating documents in a MongoDB database
to objects in the program. Besides MongooseJS there are several other ODM's
that have been developed for MongoDB including [Doctrine](https://github.com/doctrine),
[MongoLink](http://mongolink.org/), and [Mandango](https://mandango.org/).

The three main advantages of using Mongoose versus native MongoDB are:

1. MongooseJS provides an abstraction layer on top of MongoDB that eliminates the
need to use named collections. 
2. Models in Mongoose perform the bulk of the work of establishing up default values for
document properties and validating data. 
3. Functions may be attached to Models in MongooseJS. This allows for seamless 
incorporation of new functionality.
4. Queries use function chaining rather than embedded mnemonics which result in code
that is more flexible and readable, therefore more maintainable as well.

The net result of these is the simplification of database access from applications.

The main disadvantage of Mongoose is that abstraction comes at the cost of [performance](https://codeandcodes.com/tag/mongoose-vs-mongodb-native/)
compared to that of native MongoDB.

### Mongoose Concepts

Mongoose uses schemas to model the data an application
wishes to store and manipulate in MongoDb. This includes features such as 
type casting, validation, query building, and more.

The *schema* describes the attributes of the properties (aka fields) the application will 
manipulate. These attributes include such things as:

- Data type (e.g. String, Number, etc.).
- Whether or not it is required or optional.
- Is it's value unique, meaning that the database is allowed to contain only one 
document with that value in that property.

A *model* is generated from the schema and  defines a document the application 
will operating on. More precisely, a model is a class that defines a document 
with the properties and behaviors as declared in our schema. All database operations
performed on a document using Mongoose must reference a model.

### How Does Mongoose Code Differ from MongoDB?

The first difference between a Mongoose and a native-MongoDB application is that 
a module containing the schema and model must be created in the `models` directory.

The schema definition is quite interesting and useful since it can specify attributes
of each property. Attributes include specifications such as the properties data type,
whether it is required or optional on an insert or update, and whether its value is
unique or not.

A best practice is for this file to have the same name as the model. The first 
character of this file is in uppercase since a model is a class built from the 
schema. Like any class it's first character should therefore be an uppercase
letter.

For our example the following file, `Account.js`, contains the Mongoose schema and 
model definitions.

```
// Mongoose schema and model definitions

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the schema for the Account database
const accountSchema = new Schema({
  account_no: { type: Number, required: true, unique: true },
  owner_fname: { type: String, required: true, unique: false },
  owner_mi: { type: String, required: true, unique: false },
  owner_lname: { type: String, required: true, unique: false },
  created_on: { type: Date, required: false, unique: false },
  updated_on: { type: Date, required: false, unique: false },
});

// Create a model for the schema
const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
```

The second major difference, although arguably relative to each developer, is that queries 
are easier to construct and read in Mongoose than in native-MongoDb. MongoDB queries are 
consist of structured BSON specifying document property names, 
[operators](https://docs.mongodb.com/manual/reference/operator/query/), and values, which 
together specify how documents are to be filtered.

MongoDB provides a rich set of query operators which fall into one of the following high 
level categories:

- Comparison operators
- Logical operators
- Element operators
- Evaluation operators
- Geospacial operators
- Array operators
- Bitwise operators
- Projection operators 

An example of a MongoDB query that selects documents where the `owner_fname` is equal ("$eq")
to a value of "Roger" is shown below.

```
collection.find({ owner_fname: { $eq: 'Roger' } });
```

Compare this to Mongoose which uses the combination of functions and function chaining, rather 
than operators to filter documents. Although longer than its MongoDB equivalent the Mongoose
version of the query is clearer to the reader and can end up being shorter as queries become
more complex and more properties are required in the BSON. 

```
const query = Account.find({})
  .where('owner_fname').equals('Roger');
query.exec();
```

A line-by-line comparison of the code for a native-MongoDB program and its Mongoose equivalent 
is shown below.

```
MongoDB Application Code                                        Mongoose Application Code
...                                                  | ...
                                                     | mongoose.Promise = global.Promise;
mongoClient.connect(mongoUri)                        | mongoose.connect(mongoUri)
.then((db) => {                                      | .then(() => {
  return collection.find(                            |   const query = Account.find({})
    { owner_fname: { $eq: 'Roger' } });
})                                                   |   .where('owner_fname').equals('Roger')
.then((cursor) => {                                  |   
  return cursor.sort({ owner_lname: 1 });            |   .sort('owner_lname');
})                                                   |   query.exec()
.then((cursor) => {                                  |   .then((accounts) => {
  cursor.each((error, anAccount) => {                |     accounts.forEach((anAccount) => {
    if (anAccount === null) {                        |
      log.writeLog('normal', response,               |
        'Simplequery test successfully completed');  |
      return;                                        |
    }                                                |
    log.addEntry(`Account: ${anAccount.account_no}   |       log.addEntry(`Account: ${anAccount.account_no}
      owner_fname:${anAccount.owner_fname}           |         owner_fname:${anAccount.owner_fname}
      owner_mi:${anAccount.owner_mi}                 |         owner_mi:${anAccount.owner_mi}
      owner_lname:${anAccount.owner_lname}           |         owner_lname:${anAccount.owner_lname}
      created_on:${anAccount.created_on}             |         created_on:${anAccount.created_on}
      updated_on:${anAccount.updated_on}`);          |         updated_on:${anAccount.updated_on}`);
  });                                                |     });
  accountsDb.close();                                |     mongoose.disconnect();
})                                                   |     log.writeLog('normal', response, 'simplequery test successfully completed');
                                                     |   })
                                                     |   .catch((error) => {
                                                     |     // Handle document retrieval error
                                                     |     mongoose.disconnect();
                                                     |   });
                                                     | })
.catch((error) => {                                  | .catch((error) => {
  // Handle connection error                         |   // Handle connection error
});                                                  | });
  ...
```

## Conclusion

All of the sample code used in this article can be found
on [GitHub](https://github.com/jdmedlock/dbdesign).

I hope this information useful and I also look forward to any questions and comments you
might have. If you like this article, please hit the 💚 button below, Tweet, and 
share the post with your friends. Remember to follow me on Medium to get notified when 
new posts are published.

Have a good day and do great things!