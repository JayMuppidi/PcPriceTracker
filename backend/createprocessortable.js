const { pool } = require("./db");

async function createTable() {
  const res = await pool.query(
      "CREATE TABLE IF NOT EXISTS Processor (company VARCHAR(255), model_num VARCHAR(255) PRIMARY KEY , name VARCHAR(255), launch_date INT, num_cores INT, num_threads NUMERIC, base_clock NUMERIC, turbo_clock NUMERIC, cache NUMERIC, l1_cache NUMERIC, l2_cache NUMERIC, l3_cache NUMERIC, tdp NUMERIC, socket VARCHAR(255), pcie_version NUMERIC, pcie_lanes NUMERIC, mem_type VARCHAR(255), link VARCHAR(255));"
    );
  console.log(`CREATED TABLE Processor`);
}



createTable();