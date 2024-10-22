// Import necessary modules
var express = require("express");  // Express is a minimal and flexible Node.js web application framework
var fs = require("fs").promises;  // Use the promise-based version of the File system module for cleaner async code

// Initialize the app
var app = express();
app.use(express.urlencoded({ extended: true }));  // Use express's built-in body parser to handle form submissions

// Basic GET route
app.get('/', function(req, res) {
    // Respond with a message when accessing the /about URL
    res.send("hello it is my first express application");
});

// Additional routes
app.get('/about', function(req, res){
    // Respond with a message when accessing the /about URL
    res.send("This is basic express application");
});

app.get('/users/:userId/books/:bookId', function (req, res) { 
    // Validate userId and bookId parameters to ensure they are numeric
    const userId = req.params.userId;
    const bookId = req.params.bookId;

    if(isNaN(userId) || isNaN(bookId)) {
        return res.status(400).send ({
            'status': false,
            'Status_Code': 400,
            'message': 'Invalid userId or bookId. Both should be numeric.'
        });
    }

    // Respond with the userId and bookId parameters from the URL
    // req.params contains route parameters in the path
    res.send(req.params);
});

// Reading Student.json file
app.get('/GetStudents', async function (req, res) {
    try {
        // Read the Student.json file and return its contents as JSON
        const data = await fs.readFile(__dirname + "/" + "Student.json", 'utf8');
        res.json({
            'status': true,
            'Status_Code': 200,
            'requested at': new Date().toISOString(),  // Add timestamp of request
            'requrl': req.url,  // URL requested by the user
            'request Method': req.method,  // HTTP method used for the request
            'studentdata': JSON.parse(data)  // Parsed student data from JSON file
        });
    } catch (err) {
        // Send an error response if there is an issue reading the file
        res.status(500).send("Error reading student data");
    }
});

// Search student by ID
app.get('/GetStudentid/:id', async (req, res) => {
    try {
        // Read the Student.json file and return its contents as JSON
        const data = await fs.readFile(__dirname + "/" + "Student.json", 'utf8');
        var students = JSON.parse(data); // Parse the student data
        var student = students["Student" + req.params.id]; // Find the specific student by ID
        if (student) {
            // If the student exists, send the student data
            res.json(student);
        } else {
            // If the student is not found, send a 404 response
            res.status(404).json({
                'status': false,
                'Status_Code': 404,
                'message': 'Student not found'
            });
        }
    } catch (err) {
        // Send an error response if there is an issue reading the file
        res.status(500).send("Error reading student data");
    }
});

// Serve HTML form for student info
app.get('/studentinfo', function (req, res) {
    // Serve the StudentInfo.html file to the user
    res.sendFile('StudentInfo.html', { root: __dirname });
});

// Handle POST form data
app.post('/submit-data', function (req, res) {
    // Extract data from the form submission
    var name = req.body.firstName + ' ' + req.body.lastName;  // Concatenate first and last name
    var Age = req.body.myAge + ' Gender: ' + req.body.gender;  // Include age and gender information
    var Qual = ' Qualification' + req.body.Qual;  // Qualifications selected by the user

    // Send back the extracted data as a response
    res.send({
        status: true,
        message: 'form Details',
        data: { name: name, age: Age, Qualification: Qual }
    });
});


// Start the server
app.listen(5000, function () {
    // Log a message to the console indicating the server is running
    console.log("server is running on port 5000");
});
