#DBDesign - Adventures in MongoDB & Mongoose

##Overview

This repo contains the components of a MEAN application which demonstrates the
use and power of both MongoDB and Mongoose. It's purpose is to be a guide
showing how to build applications from simple MongoDB-only applications up to
more complex, real-world applications that leverage the power of Mongoose.

##A Little Historical Context

Databases fall into several different categories. The earliest databases, up
through the mid-1980's, were so-called *CODASYL databases* which organized data
into records and related record occurrances of one type to another using
hashes to form a network. Although generally efficient CODASYL-style databases,
like IDMS from Cullinet Software and IMS from IBM, the context and navigation 
required that the application bet exposed to the physical relationship between 
records. 

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

In the early 1980's a new type of database based on the Structured Query
Language (SQL) begain too take hold. The main advantage of a SQL database had
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

NoSQL database were developed to provide an environment that supported change
without requiring radical reengineering of the underlying data model, high
volumes of data, and an architecture that was easy to scale.

##What is MongoDB?

MongoDB is a Open Source, NoSQL database management system that supports:

- Ad hoc queries
- Indexing
- Load Balancing
- Replicated file storage over multiple servers
- Data aggregation
- Server-side Javascript execution
- Capped collections

MongoDB is a *document-based* database management system which leverages a
JSON-style storage format known as *binary JSON*, or BSON, to achieve high
throughput. BSON makes it easy for applications to extract and manipulate data,
as well as allowing properties to be efficiently indexed, mapped, and nested
in support of complex query operations and experssions.

For example, using the Account example above all Transactions for account
'111111' that are deposits can be retrieved using:

```
    db.transaction.find({
      transaction-account-no:/'111111',
      transaction-type: /'deposit'/
    })
```

##What is Mongoose?

MongooseJS is an *Object Document Mapper (ODM)* that makes MongoDB easier to
use from Javascript applications by translating documents in a MongoDB database
to objects in the program. Rather than describing what this means let's
demonstrate it though a few examples.

###A Simple MongoDB-only Application

###A Simple Mongoose Equivalent Application
