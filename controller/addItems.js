const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
  
// Initialize Multer with the storage configuration
const upload = multer({ storage: storage }).array('files', 10);

const addtemsRouter = async (req, res) => {
  
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading photo:", err);
        return res.status(400).json({ message: "Error uploading photo" });
      }

      if (!req.files) {
        return res.status(403).json({ message: "No file selected" });
      }
    });
  } catch (error) {
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Something went wrong, please try again",
    });
  }
    
  fs.readFile(`json/items.json`, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Internal server error");
    }

    try {
      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Add the new item to the 'items' array
      jsonData.items.push(req.body);

      // Convert the modified data back to JSON
      const updatedJsonData = JSON.stringify(jsonData, null, 2);

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
  
  res.json({ message: 'Form data and files received and saved successfully!' });
};

module.exports = addtemsRouter;