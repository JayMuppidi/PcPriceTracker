const { pool } = require("./db");

async function createTable() {
//   const [name, color] = process.argv.slice(2);
// company,modelid,link,resolution,model_year,size_class,pixel_pitch,contrast_ratio,diagnol,brightness
  const res = await pool.query(
      "CREATE TABLE IF NOT EXISTS Monitor (company VARCHAR(255), modelid VARCHAR(255) PRIMARY KEY, link VARCHAR(255),name TEXT,url TEXT,resolution VARCHAR(255), model_year INT , size_class VARCHAR(255) , pixel_pitch VARCHAR(255) ,contrast_ratio VARCHAR(255) ,diagnol VARCHAR(255) , brightness VARCHAR(255) );"
    );
  console.log(`CREATED TABLE Monitor`);
}

createTable();

/*
COPY Monitor(company , modelid , link , resoultion , model_year , size_class , pixel_pitch , contrast_ratio , diagnol , brightness)
FROM 'Monitor_data_webScrapped.csv'
DELIMITER ','
CSV HEADER; 
*/

