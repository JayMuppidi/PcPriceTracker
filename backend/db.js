const { Pool } = require("pg");

const pool = new Pool({
  user: "me",
  database: "dass",
  password: "12345678",
  port: 5432,
  host: "localhost",
});

module.exports = { pool };
