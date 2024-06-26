const express = require ("express");
const multer = require('multer');
const path = require('path')
const fs = require('fs')


const AddItem = async (req, res) => {

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });


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
        }
        res.status(200).send("New record added successfully");
      
      });
    } catch (parseError) {
      // console.error("Error parsing JSON data:", parseError);
    }
  });

  res.json({ message: 'Form data and files received successfully!' });
});

app.get("*", (req, res) => {
  res.send("<h2> Page not found</h2>");
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port} `);
});
}

module.exports = {AddItem};