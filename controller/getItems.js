
const fs = require('fs');
const getItemsRouter = async (req, res) => {
    fs.readFile(`json/items.json`, { encoding: "utf8" }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(data);
          res.send(data);
        }
    });
};

module.exports = getItemsRouter;