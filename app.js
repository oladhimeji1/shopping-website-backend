const express = require ("express");
const bodyParser = require ("body-parser");
const router = require ("./route/route");
const multer = require('multer');
const path = require('path')
const fs = require('fs')
var cors = require("cors");

const app = express();
// express.urlencoded({extended:true})
app.use(cors());
const port = process.env.Port || 8080;

  // bodypaser midleware
app.use(express.urlencoded({extended: true,}));
app.use(express.json());


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
      // cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

// Middleware to parse JSON bodies
app.use(express.json());


app.get("/get-items", (req, res) => {
  fs.readFile(`json/items.json`, { encoding: "utf8" }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(data);
      res.send(data);
    }
  });
});


// Endpoint to handle form data and file uploads

app.post('/add-item', upload.array('files', 10), (req, res) => {

  // Access files from req.files
  const files = req.files;
  // console.log('Files:', files);
  fs.readFile(`json/items.json`, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Internal server error");
    }

    try {
      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Add the new user to the 'users' array
      jsonData.items.push(req.body);

      // Convert the modified data back to JSON
      const updatedJsonData = JSON.stringify(jsonData, null, 2);
      // console.log(updatedJsonData);

      // Write the updated JSON data back to the file
      fs.writeFile(`json/items.json`, updatedJsonData, "utf8", (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return res.status(500).send("Internal server error");
        } else{
          // res.json("New record added successfully");
        }
      });
    } catch (parseError) {
      // console.error("Error parsing JSON data:", parseError);
    }
  });

  res.json({ message: 'Form data and files received successfully!' });
});

app.get('/images/:id', (req, res) => {
  // console.log(req.url)
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url)

  let contentType = 'text/html'

  let mimeType = path.extname(filePath)

  switch (mimeType) {
    case '.png': contentType = 'image/png'; break;
    case '.jpg': contentType = 'image/jpg'; break;
    case '.jpeg': contentType = 'image/jpeg'; break;
  }

  fs.readFile(filePath, (error, data) => {
    // stop the execution and send nothing if the requested file path does not exist.
    if (error) return
    
    // otherwise, fetch and show the target image
    res.writeHead(200, { 'Content-Type': contentType })
    return res.end(data, 'utf8')
  })

});

// app.get("*", (req, res) => {
//   res.send("<h2> Page not found</h2>");
// });

app.listen(port, () => {
  console.log(`Server is running on PORT ${port} `);
});