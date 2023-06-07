const { pool } = require("./db");
const fs = require('fs');
const csv = require('csv-parser');
const paramsSet = new Set();
fs.createReadStream('finalCSVs/Monitor_data_webScrapped.csv')
  .pipe(csv())
  .on('data', (row) => {
    paramsSet.add([
      row.Company, row.modelId, row.link,row.Name ,row.URL, row.resolution, row.model_year?parseInt(row.model_year):-1,
      row.size_class, row.pixel_pitch, row.contrast_ratio, row.diagnol, row.brightness
    ]);
  })
  .on('end', async () => {
    try {
      // begin a transaction
      const params = Array.from(paramsSet);
      await pool.query('BEGIN');

      // build the SQL statement with a parameterized query and the params array
      const placeholders = params.map((_, i) => `($${i * 12 + 1}, $${i * 12 + 2}, $${i * 12 + 3}, $${i * 12+ 4}, $${i * 12 + 5}, $${i * 12 + 6}, $${i * 12 + 7}, $${i * 12 + 8}, $${i * 12 + 9}, $${i * 12 + 10},$${i*12 + 11},$${i*12 + 12})`).join(',');
      // console.log(placeholders)
      const query = `INSERT INTO Monitor (company, modelid, link,name,url,resolution, model_year, size_class, pixel_pitch, contrast_ratio, diagnol, brightness) VALUES ${placeholders}`;

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