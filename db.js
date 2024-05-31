// db.js
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'Users';

let db;

const connectDB = async () => {
  if (db) return db;
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db(dbName);
  return db;
};

module.exports = connectDB;
