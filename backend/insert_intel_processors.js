const { pool } = require("./db");
const fs = require('fs');
const csv = require('csv-parser');


const paramsSet = new Set();
const modelSet = new Set();
paramsSet.clear();
fs.createReadStream('finalCSVs/intel_processors.csv')
  .pipe(csv())
  .on('data', (row) => {
    if (modelSet.has(row.model_num)) {
      return;
    }
    modelSet.add(row.model_num);
    paramsSet.add([
      'Intel', row.model_num, row.name, row.launch_date?parseInt(row.launch_date):-1, row.num_cores?parseInt(row.num_cores):-1, row.num_threads?parseFloat(row.num_threads):-1,
      row.base_clock?parseFloat(row.base_clock):-1, row.turbo_clock?parseFloat(row.turbo_clock):-1, row.cache?parseFloat(row.cache):-1, null, null, null, row.tdp?parseFloat(row.tdp):-1, null, null, null, null, row.link
    ]);
  })
  .on('end', async () => {
    try {
      // begin a transaction
      const params = Array.from(paramsSet);
      await pool.query('BEGIN');
      // console.log(params);
      // build the SQL statement with a parameterized query and the params array
      const placeholders = params.map((_, i) => `($${i * 18 + 1}, $${i * 18 + 2}, $${i * 18 + 3}, $${i * 18 + 4}, $${i * 18 + 5}, $${i * 18 + 6}, $${i * 18 + 7}, $${i * 18 + 8}, $${i * 18 + 9}, $${i * 18 + 10}, $${i * 18 + 11}, $${i * 18 + 12}, $${i * 18 + 13}, $${i * 18 + 14}, $${i * 18 + 15}, $${i * 18 + 16}, $${i * 18 + 17}, $${i * 18 + 18} )`).join(',');
      const query = `INSERT INTO Processor (company, model_num, name, launch_date, num_cores, num_threads, base_clock, turbo_clock, cache, l1_cache, l2_cache, l3_cache, tdp, socket, pcie_version, pcie_lanes, mem_type, link) VALUES ${placeholders}`;

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



