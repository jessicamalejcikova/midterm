 //Data Driven Apps Midterm
//Name: Jessica Malejcikova
//Date: 03/19/2024

//connect to storage buckets using forEACH statements

//Importing the necessary module that needs to interact with Google Cloud Storage
const {Storage} = require('@google-cloud/storage');

//Create an instance of the Storage class
const storage = new Storage();

//Defining an asynchronous function to count the files
exports.countTheFiles = async (req, res) => {
    try {
    //Retreiving the files from the benign and malicous buckets named "sp24-41200-jmalejci-benign" and "sp24-41200-jmalejci-malicious"
    const [benignBucket] = await storage.bucket('sp24-41200-jmalejci-benign').getFiles();
    const [maliciousBucket] = await storage.bucket('sp24-41200-jmalejci-malicious').getFiles();

    //Initializing the count for benign files 
    let benignFileCount = 0;

    //Iterating through each file in the benign bucket and incrementing the count
    benignBucket.forEach(file => {
        benignFileCount++;
    });

    //Logging the number of benign files
    console.log('The number of benign files: ${benignFileCount}');

    
    //Counting the number of files in the malicious bucket

    //Intialize the count for malicious files 
    let maliciousFileCount = 0;

     //Counting/ logging the number of benign files
     //Iterating through each file in the malicious bucket and incrementing the count
     maliciousBucket.forEach(file => {
        maliciousFileCount++;
    });

    //Logging the number of malicious files 
    console.log('The number of malicious files: ${maliciousFileCount}');

    //Sending response to the client with the counts/amount of malicious/benign files in the webpage
    res.send(`There are ${maliciousFileCount} malicious files and there are ${benignFileCount} benign files.`);
    } catch (error) {

        //Handling errors if any occur during the process

        //Logging the error
        console.error(`Error counting the files:, ${error}`);

        //Sending an internal server error response to the client
        res.status(500).send(`Internal server error`);
    }
};

