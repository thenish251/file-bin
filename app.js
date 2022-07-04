const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const mustacheExpress = require('mustache-express');
const path = require('path');
const fs = require('fs');
const database = require('./database/db');
const app = express();

const PORT = 3000;

const maxFileSize = 20 * 1024 * 1024; //20MB.
const baseURL = `http://localhost:${PORT}`;


// Set 'views' directory for any views 
app.use(express.static(path.join(__dirname, 'frontend')));
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'frontend'));


//Create mysql database connection....
const dbConnection = mysql.createConnection(database.dbParams);

//Establishing connection...
dbConnection.connect((err) => {
    if(err)
    {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('Database connection established');
});


//Specify the storage.
const storage = multer.diskStorage(
    {
      destination: (req, file, callback) => {
        callback(null, __dirname + '/uploads');
      }
    }
  );

  //Uploading files.
const upload = multer({ storage: storage, limits : {fileSize: maxFileSize}}).single('uploadedFile');


app.get('/', (req, res) => {
    res.render('index.html');
});



app.get('/download/:id', (req,res) => {
    try {
      let savedName = req.params.id;
      let currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      dbConnection.query(
        `UPDATE uploaded_data
        SET downloaded_at = "${currentDate}" \
        WHERE url_key = '${savedName}' \
        AND downloaded_at IS NULL LIMIT 1;`,
        (err, rows, fields) => {
          if (err) {
            console.log(err);
            res.render('error.html', { error: "Something went wrong"});
          } else if (rows.affectedRows == 1) {
            console.log("File not downloaded yet");
            dbConnection.query(
              `SELECT file_name \
              FROM uploaded_data \
              WHERE url_key = '${savedName}';`,
              (err, rows, fields) => {
                if (err) {
                  console.log(err);
                  res.render('error.html', { error: "Something went wrong"});
                }
                 else if (rows.length == 1) 
                 {
                  console.log("Sending files.");
                  let originalName = rows[0].file_name;
                  console.log(rows);
                  const file = `${__dirname}/uploads/${savedName}`;
                  res.download(file, originalName, (err) => {
                    if (err) 
                    {
                      console.log("Couldn't send file.");
                      res.render('error.html', { error: "Something went wrong"});
                    } 
                    else 
                    {
                      fs.unlink(file, (err) => {
                        if (err) {
                          console.log(err);
                        }
                      });
                    }
                  });
                } else {
                  console.log("Couldn't send file");
                  res.render('error.html', { error: "Something went wrong"});
                }
              }
            );
          } else {
            console.log("File already downloaded");
            res.render('error.html', { error: "File not present or already downloaded"});
          }
        }
      );
    }
    catch (e) {
      console.log("catch block");
      console.log(e);
      res.render('error.html', { error: "Something went wrong"});
    }
  });



app.post('/upload', (req,res) => {
    try {
      upload(req,res, (err) => {
          if (err) {
              console.log(err);
              res.render('error.html', { error: "Something went wrong"});
          } else {
            console.log(req.file.originalname);
            console.log(req.file.filename);
            
            let currentDate= new Date().toISOString().slice(0, 19).replace('T', ' ');
            dbConnection.query(
              `INSERT INTO uploaded_data \
              (file_name, url_key, uploaded_at) \
              VALUES \
              ("${req.file.originalname}", "${req.file.filename}", "${currentDate}");`,
              function (err, rows, fields) {
                if (err) {
                  console.log(err);
                  //console.log(__dirname)
                  res.render('error.html', { error: "Something went wrong"});
                }
            });
            res.render('index.html',
             { status: "Upload successful", 
             fileURL: `Share this URL: ${baseURL}/download/${req.file.filename}`
            });
          }
      });
    }
    catch (e) {
      console.log("catch block");
      console.log(e);
      res.render('error.html', { error: "Something went wrong"});
    }
  });


app.use((req, res, next) => {
    res.render('error.html', { error: "Something went wrong"});
  });


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});