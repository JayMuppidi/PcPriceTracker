const { pool } = require("./db");
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const Fuse = require( "fuse.js");

const app = express();
const port = 3000;

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/api/processor', async (req, res) => {
    try {
    const data = req.body;
    const companies = data.output_data.companies;
    const lowerCoreNum = data.output_data.lowerCoreNum;
    const upperCoreNum = data.output_data.upperCoreNum;
    const search = data.output_data.search;
    const lowerBaseClock = data.output_data.lowerBaseClock;
    const upperBaseClock = data.output_data.upperBaseClock;

    const placeCompanies = companies.map((d) => `'${d}'`).join(',');

    const processors = await pool.query(
      `SELECT * FROM Processor WHERE (company IN (${placeCompanies}) OR company IS NULL) AND ((num_cores >= ${lowerCoreNum} AND num_cores <= ${upperCoreNum}) OR num_cores IS NULL) AND ((base_clock >= ${lowerBaseClock} AND base_clock <= ${upperBaseClock}) OR base_clock IS NULL)`
    );
    // initialize Fuse with the processors data and search options
    const fuse = new Fuse(processors.rows, {
      keys: ['name'],
      ignoreCase: true,
      include: ['matches'], 
    });
    const matchedObjects = fuse.search(search);
    let results = matchedObjects.map((matchedObject) => matchedObject.item);
    if(search === "")
    {
        results= processors.rows
    }
    console.log(results)
    res.json({ success: true, completedata: results });
  } catch (err) {
    console.log(err);
    res.json({ success: false, error: err });
  }
});


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/api/monitor', async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    // const companies = data.output_data.companies;
    const companies = data.output_data.companies;
    const respi = await pool.query(`
          SELECT *
          FROM Monitor 
          WHERE company IN (${companies.map((d, i) => `$${i + 1}`).join(',')})
            AND (
              brightness = '' 
              OR (
                CAST(
                  LEFT(
                    brightness, 
                    POSITION(' cd/m² (candela per square meter)' IN brightness) - 1
                  ) 
                  AS FLOAT
                ) >= ${data.output_data.brightness.min} 
                AND CAST(
                  LEFT(
                    brightness, 
                    POSITION(' cd/m² (candela per square meter)' IN brightness) - 1
                  ) 
                  AS FLOAT
                ) <= ${data.output_data.brightness.max}
              )
            )
            AND (
              model_year = -1 
              OR (
                model_year != '-1' 
                AND model_year >= ${data.output_data.years.min} 
                AND model_year <= ${data.output_data.years.max}
              )
            )
            AND (
              size_class = '' 
              OR (
                CAST(
                  LEFT(
                    size_class, 
                    POSITION(' in (inches)' IN size_class) - 1
                  ) 
                  AS FLOAT
                ) >= ${data.output_data.sizes.min} 
                AND CAST(
                  LEFT(
                    size_class, 
                    POSITION(' in (inches)' IN size_class) - 1
                  ) 
                  AS FLOAT
                ) <= ${data.output_data.sizes.max}
              )
            )
        `, companies);

    const new_rows = respi.rows.sort((a, b) => {
      if (a.brightness == '' && b.brightness != '') {
        return 1;
      }
      else if (a.brightness != '' && b.brightness == '') {
        return -1;
      }
      else {
        return 0;
      }
    })

    const fuse = new Fuse(new_rows, {
      keys: ['name', 'modelid']
    })

    // Search
    console.log(data.output_data.searchword)
    var result = fuse.search(data.output_data.searchword)
    result = result.map((obj)=>obj.item)

    if(result.length == 0)
    {
      result = new_rows
    }
    
    console.log(result)
    // result = result.forEach((re)=>re.item)
    res.json({ success: true, completedata: result });

  }
  catch (err) {
    console.log(err);
    res.json({ success: false, error: err });
  }
});


app.post('/api/memory', async (req, res) => {

  const data = req.body;
  console.log(data.output_data.freq);

  try {
const companies = data.output_data.companies;

const respi = await pool.query(`
  SELECT * FROM Memory
  WHERE 
    company IN (${companies.map((d, i) => `$${i + 1}`).join(',')})
    AND ((size >= ${data.output_data.sizes.min} AND size <= ${data.output_data.sizes.max}) OR size = -1)
    AND ((frequency >= ${data.output_data.freq.min} AND frequency <= ${data.output_data.freq.max}) OR frequency = -1)
`, companies);

  
    var new_rows = respi.rows
    const fuse = new Fuse(new_rows, {
      keys: ['name', 'modelid']
    })

    var result = fuse.search(data.output_data.searchword)
    result = result.map((obj)=>obj.item)

    if(result.length == 0)
    {
      result = new_rows
    }
    // console.log(result)
    res.json({success: true, completedata: result})

  }
  catch (err) {
    console.log(err);
    res.json({ success: false, error: err });
  }
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});