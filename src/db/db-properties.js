// const mongoose = require('mongoose')
// require('dotenv').config()
// let connection;
// if(process.env.NODE_ENV == 'development') {
//      connection = mongoose.connect(process.env.DB_DEV_URL, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//        poolSize: 10,
//         useFindAndModify: false,
//         useUnifiedTopology: true
//     },
//     (err) => {
//      if (err) {
//         console.error('database connection failure: \n' + err.stack);
//         process.exit(1);
//      }
//      console.log('Connected to the db');
//     })
// }
const mongoose = require('mongoose');
require('dotenv').config();

let connection;

if (process.env.NODE_ENV == 'development') {
  connection = mongoose.connect(process.env.DB_DEV_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  
    .then(() => {
      console.log('Connected to the db');
    })
    .catch((err) => {
      console.error('database connection failure: \n' + err.stack);
      process.exit(1);
    });
}
