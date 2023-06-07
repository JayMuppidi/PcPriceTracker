const { pool } = require("./db");
const fs = require('fs');
const csv = require('csv-parser');


const paramsSet = new Set();
fs.createReadStream('finalCSVs/memory.csv')
  .pipe(csv())
  .on('data', (row) => {
    //Get the number before GB in size
    let size = row.size.substring(0,row.size.indexOf('GB'))
    paramsSet.add([
      row.company,row.name ,row.model,row.link_x_x,parseInt(size)?parseInt(size):-1 ,parseInt(row.freq)?parseInt(row.freq):-1
    ]);
  })
  .on('end', async () => {
    try {
      // begin a transaction
      const params = Array.from(paramsSet);
      await pool.query('BEGIN');

      // build the SQL statement with a parameterized query and the params array
      const placeholders = params.map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`).join(',');
      // console.log(placeholders)
      const query = `INSERT INTO Memory (company, name, modelid , link , size , frequency ) VALUES ${placeholders}`;

      // execute the query with the params array as the argument
      await pool.query(query, params.flat());

      // commit the transaction
      await pool.query('COMMIT');

      console.log('All rows inserted successfully');
    } catch (error) {
      // rollback the transaction if an error occurs
      await pool.query('ROLLBACK');
      console.error('Error inserting rows:', error);
    } finally {
      // end the database connection pool
      pool.end();
    }
  });

// insertData();