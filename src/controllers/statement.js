const Statement = require("../models/statement");
const date = require("date-and-time");
var mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const csv = require("csv-parser");
const axios = require("axios");
const fs = require("fs");
exports.statementDescriptionListing = async (req, res) => {
  try {
    const uniqueDescriptions = await Statement.aggregate([
      { $group: { _id: "$description" } },
      { $project: { _id: 0, description: "$_id" } },
    ]);

    const uniqueDescriptionsSet = new Set();

    uniqueDescriptions.forEach((item) => {
      uniqueDescriptionsSet.add(item.description.trim());
    });

    const uniqueDescriptionsArray = Array.from(uniqueDescriptionsSet);

    return res.status(200).json({
      status: "00",
      message: "success",
      response: uniqueDescriptionsArray,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "01",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// exports.statementListing = async (req, res) => {
//   try {
//     const page = req.query.page ? parseInt(req.query.page) : 1;
//     const pageSize = process.env.PAGE_SIZE ? parseInt(process.env.PAGE_SIZE) : 10;
//     const skip = (page - 1) * pageSize;

//     const description = req.query.query; // Extract 'query' directly

//     const filter = {};

//     if (description) {
//       filter.description = description;
//     }

//     const statements = await Statement.find(filter)
//       .skip(skip)
//       .limit(pageSize);

//     return res.status(200).json({
//       status: "00",
//       message: "success",
//       response: statements,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       status: "01",
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };



// exports.statementListingFilter = async (req, res) => {
//   try {
//     const {role, startDate, endDate } = req.body; // Use req.body to retrieve data from the request body
//     let page = req.query.page ? parseInt(req.query.page) : 1;
//     let skip = process.env.PAGE_SIZE * page - process.env.PAGE_SIZE;
//     const filter = {};

//     if (role) {
//       filter.description = role;
//     }

//     if (startDate && endDate) {
//       filter.date = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     }

//     // Perform the query using Mongoose and apply the filters
//     const statements = await Statement.find(filter);

//     return res.status(200).json({
//       status: "00",
//       message: "success",
//       response: statements,
//     });
//   } catch (error) {
//     console.error(error);

//     // Handle errors and return an appropriate error response
//     return res.status(500).json({
//       status: "01",
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };
exports.statementListing = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = process.env.PAGE_SIZE ? parseInt(process.env.PAGE_SIZE) : 10;
    const skip = (page - 1) * pageSize;

    const description = req.query.query; // Extract 'query' directly

    const filter = {};

    if (description) {
      filter.description = description;
    }

    // Use the $facet aggregation to get both documents and the count
    const aggregateResult = await Statement.aggregate([
      { $match: filter },
      { $facet: {
          docs: [
            { $skip: skip },
            { $limit: pageSize },
          ],
          count: [
            { $count: "docs_count" },
          ],
        },
      },
    ]);

    // Extract documents and count from the aggregation result
    const [docsResult] = aggregateResult;
    const documents = docsResult.docs;
    const count = docsResult.count[0].docs_count;

    return res.status(200).json({
      status: "00",
      message: "success",
      response:documents,
      count:  count,
      
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "01",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// exports.statementListingFilter = async (req, res) => {
//   try {
//     const { role, startDate, endDate } = req.body;
//     let page = req.query.page ? parseInt(req.query.page) : 1;
//     const pageSize = process.env.PAGE_SIZE ? parseInt(process.env.PAGE_SIZE) : 10;
//     const skip = (page - 1) * pageSize; // Calculate the 'skip' value based on 'page' and 'pageSize'

//     const filter = {};

//     if (role) {
//       filter.description = role;
//     }

//     if (startDate && endDate) {
//       filter.date = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     }

//     // Perform the query using Mongoose, apply the filters, and use 'skip' and 'limit' for pagination
//     const statements = await Statement.find(filter)
//       .skip(skip)
//       .limit(pageSize);

//     return res.status(200).json({
//       status: "00",
//       message: "success",
//       response: statements,
//     });
//   } catch (error) {
//     console.error(error);

//     // Handle errors and return an appropriate error response
//     return res.status(500).json({
//       status: "01",
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };
exports.statementListingFilter = async (req, res) => {
  try {
    const { role, startDate, endDate } = req.body;
    let page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = process.env.PAGE_SIZE ? parseInt(process.env.PAGE_SIZE) : 10;
    const skip = (page - 1) * pageSize; // Calculate the 'skip' value based on 'page' and 'pageSize'

    const filter = {};

    if (role) {
      filter.description = role;
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Use the $facet aggregation to get both documents and the count
    const aggregateResult = await Statement.aggregate([
      { $match: filter },
      { $facet: {
          docs: [
            { $skip: skip },
            { $limit: pageSize },
          ],
          count: [
            { $count: "docs_count" },
          ],
        },
      },
    ]);

    // Extract documents and count from the aggregation result
    const [docsResult] = aggregateResult;
    const documents = docsResult.docs;
    const count = docsResult.count[0].docs_count;

    return res.status(200).json({
      status: "00",
      message: "success",
      response: documents,
      count: count,
    });
  } catch (error) {
    console.error(error);

    // Handle errors and return an appropriate error response
    return res.status(500).json({
      status: "01",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.bulkUpload = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors.array()");
    console.log(errors.array());
    return res.status(400).send({
      status: "01",
      success: "false",
      msg: "invalid input",
      errors: errors.array(),
    });
  }

  try {
    if (req.files.file == undefined || req.files.file == null) {
      return res.status(400).send({
        status: "01",
        success: "False",
        message: "please upload file to csv file ",
      });
    }

    if (req.files.file[0].size > 1048576) {
      console.log("removing---");
      fs.rm(req.files.file[0].path, (err) => {
        if (err) {
          logger.debug(err);
          console.log(err);
        }
      });
      return res.status(400).send({
        status: "01",
        success: "False",
        message: "upload file size should be less than 1 MB",
      });
    }

    let data = [];

    function processData() {
      return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(`${req.files.file[0].path}`)
          .pipe(csv({}))
          .on("data", (data) => results.push(data))
          .on("end", () => {
            resolve(results);
          })
          .on("error", (error) => {
            reject(error);
          });
      });
    }

    await processData()
      .then((results) => {
        data = results;
      })
      .catch((error) => {
        console.error(error);
      });

    let data_length = 0;
    data_length = data.length;
    console.log("line 81---data_length");
    console.log(data_length);

    for (let row of data) {
      let parsedDate = date.parse(row["Date"], "DD/MM/YYYY");
      let formattedDate = date.format(parsedDate, "YYYY-MM-DDTHH:mm:ss.SSSZ");
      console.log("formattedDate");
      console.log(formattedDate);
      console.log("formattedDate");
      let description = row["Description"].trim(); 
      let userDataRow = {
        date: formattedDate,
        // description: row["Description"],
        description:description ,
        balance: row["Balance"],
        debit:
          "Debit" in row && row["Debit"] !== null && row["Debit"] !== ""
            ? row["Debit"]
            : 0,
        credit:
          "Credit" in row && row["Credit"] !== null && row["Credit"] !== ""
            ? row["Credit"]
            : 0,
      };

      console.log("userDataRow");
      console.log(userDataRow);

      try {
        const data = await new Statement(userDataRow).save();
     
      } catch (err) {
        console.error("An error occurred while saving the data");
        console.error(err);
        if (err.code === 11000) {
          console.log("Duplicate key error");
        }
      }
    }
    fs.rm(req.files.file[0].path, (err) => {
      if (err) {
        console.log("line 108");
        console.log(err);
      }
    });
    res.status(200).json({
      status: "00",
      success: true,
      message: "Bulk Uploaded successfully",
      data: [],
    });
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .send({ status: "01", success: "false", msg: err?.message });
  }
};
exports.debitDonut = async (req, res) => {
  try {
    // Aggregate and calculate the total debit for each description
    const aggregationResult = await Statement.aggregate([
      {
        $group: {
          _id: "$description",
          totalDebit: { $sum: "$debit" }
        }
      },
      {
        $project: {
          _id: 0,
          description: "$_id",
          totalDebit: 1
        }
      }
    ]);

    // Calculate the total debit sum for percentage calculation
    const totalDebitSum = aggregationResult.reduce((acc, curr) => acc + curr.totalDebit, 0);

    // Calculate the percentage for each description
    const pieChartData = aggregationResult.map((item) => ({
      description: item.description,
      percentage: (item.totalDebit / totalDebitSum) * 100
    }));
    return res.status(200).json({
      status: "00",
      message: "success",
      response: pieChartData,
      
    });
   
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "01",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
exports.creditDonut = async (req, res) => {
  try {
    // Aggregate and calculate the total credit for each description
    const aggregationResult = await Statement.aggregate([
      {
        $group: {
          _id: "$description",
          totalCredit: { $sum: "$credit" }
        }
      },
      {
        $project: {
          _id: 0,
          description: "$_id",
          totalCredit: 1
        }
      }
    ]);

    // Calculate the total credit sum for percentage calculation
    const totalCreditSum = aggregationResult.reduce((acc, curr) => acc + curr.totalCredit, 0);

    // Calculate the percentage for each description
    const pieChartData = aggregationResult.map((item) => ({
      description: item.description,
      percentage: (item.totalCredit / totalCreditSum) * 100
    }));

    return res.status(200).json({
      status: "00",
      message: "success",
      response: pieChartData
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "01",
      message: "Internal Server Error",
      error: error.message
    });
  }
};
