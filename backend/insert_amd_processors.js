const { pool } = require("./db");
const fs = require('fs');
const csv = require('csv-parser');


const paramsSet = new Set();
const modelSet = new Set();
paramsSet.clear();

fs.createReadStream('finalCSVs/amd_processors.csv')
.pipe(csv())
.on('data', (row) => {
  if (modelSet.has(row.model_num)) {
      return;
  }
  modelSet.add(row.model_num);
  paramsSet.add([
    'AMD', row.model_num, row.name, row.launch_date?parseInt(row.launch_date):-1, row.num_cores?parseInt(row.num_cores):-1, row.num_threads?parseFloat(row.num_threads):-1,
    row.base_clock?parseFloat(row.base_clock):-1, row.boost_clock?parseFloat(row.boost_clock):-1, null, row.l1_cache?parseFloat(row.l1_cache):-1, row.l2_cache?parseFloat(row.l2_cache):-1, row.l3_cache?parseFloat(row.l3_cache):-1, row.tdp?parseFloat(row.tdp):-1, row.socket, row.pcie_version?parseFloat(row.pcie_version):-1, row.pcie_lanes?parseFloat(row.pcie_lanes):-1, row.mem_type, row.link
  ]);
})
.on('end', async () => {
  try {
    // begin a transaction
    const params = Array.from(paramsSet);
    await pool.query('BEGIN');

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
