module.exports = (app) => {
const statement=require('../controllers/statement');
var multer = require("multer");

var storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    var file_name_ext = file.originalname.split(".");
    cb(null, Date.now() + "." + file_name_ext[file_name_ext.length - 1]);
  },
});

  
var upload = multer({ storage: storage });
  
let bulkUpload = upload.fields([{name:"file"}])
//listing the Statments
app.get('/mcp/statements/description', statement.statementDescriptionListing);
app.get('/mcp/statements/listing',statement.statementListing);
app.post('/mcp/statements/bulkupload',bulkUpload,statement.bulkUpload);
app.post('/mcp/statements/listingFilter',statement.statementListingFilter);
app.get('/mcp/statements/debitchart', statement.debitDonut);
app.get('/mcp/statements/creditchart', statement.creditDonut);

}