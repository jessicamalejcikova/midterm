 //Data Driven Apps Midterm
//Name: Jessica Malejcikova
//Date: 03/19/2024

//Importing the neccessary modules for interacting with Google Cloud Storage and BigQuery
const { Storage } = require('@google-cloud/storage');
const { BigQuery } = require('@google-cloud/bigquery');

//Creating a new instance of BigQuery
const bq = new BigQuery();

//Exporting an asynchronous function for sorting files
exports.sortTheFiles = async (file, context) => {

     // Entry point function
     const theUploadedFile = file;

     //Creating a new instance of Storage
     const storage = new Storage();

     //Getting the source, malicious and benign buckets
     const sourceBucket = storage.bucket(theUploadedFile.bucket);
     const maliciousBucket = storage.bucket('sp24-41200-jmalejci-malicious');
     const benignBucket = storage.bucket('sp24-41200-jmalejci-benign');

    //Getting the source file and defining temp file path
     const sourceFile = sourceBucket.file(theUploadedFile.name);
    const tempFilePath = `/tmp/${theUploadedFile.name}`;

    //Downloading the source file name without ext
    await sourceFile.download({ destination: tempFilePath });

    //Extracting the fileName without ext
     const fileName = theUploadedFile.name.replace('.pdf', '');

     //SQL Query to retrieve file classification from BigQuery
     const sqlQuery = "SELECT Class FROM `data-driven-apps-sp24-midterm.midtermclassification.Classifyingfiles` where filename = @fileName";

     //Query options including parameters
     const options = {
        query: sqlQuery,
        params: {
            filename: fileName
        }
      };

      //Extracting the query to fetch the classification
      const [rows] = await bq.query(options);
      const row = rows[0];
  
      //Logging the classification
      console.log(row);

      //Uploading the file to the appropriate bucket based on the classification name
      if (row.Class == "Malicious") {
          console.log("Oh no, this file is malicious..")
          await maliciousBucket.upload(tempFilePath, { destination: theUploadedFile.name});
      } else {
          console.log("Yay, this file is benign!")
          await benignBucket.upload(tempFilePath, { destination: theUploadedFile.name});
      }
      
      //Deleting the source file from the source bucket
      await sourceBucket.file(theUploadedFile.name).delete();
      console.log(`Deleted uploaded file: ${theUploadedFile.name}`);

};

































