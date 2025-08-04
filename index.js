// Setup and Middleware: Configure the app to use EJS for views, parse incoming data, and serve static files.
// Home Route (/): Displays a list of all files in the files directory.
// View File (/file/:filename): Displays the contents of a specific file.
// Edit File (/edit/:filename): Shows a page to rename a file.
// Rename File (POST /edit): Renames a file based on the submitted form data.
// Create File (POST /create): Creates a new file with specified title and content.
// Delete File (DELETE /delete/:filename): Deletes a specific file and sends success or error responses.
// Start Server: Listens for requests on port 3000.


// Import required modules
const express = require('express'); // Express framework for building web applications
const app = express(); // Create an Express application instance
const path = require('path'); // Node.js module to work with file and directory paths
const fs = require('fs'); // Node.js module to interact with the file system

// Set the view engine to EJS for rendering dynamic HTML templates
app.set("view engine", "ejs");

// Middleware to parse JSON data in incoming requests
app.use(express.json());

// Middleware to parse URL-encoded data from HTML forms
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files (CSS, JS, images) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route: Home page
app.get("/", function (req, res) {
    // Read the contents of the "files" directory
    fs.readdir(`./files`, function (err, files) {
        // Render the "index.ejs" view, passing the list of files as data
        res.render("index", { files: files });
    });
});

// Route: View a specific file's contents
app.get("/file/:filename", function (req, res) {
    // Read the specified file's contents from the "files" directory
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
        // Render the "show.ejs" view, passing the filename and its contents
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

// Route: Render the edit file page
app.get("/edit/:filename", function (req, res) {
    // Render the "edit.ejs" view, passing the filename to be edited
    res.render('edit', { filename: req.params.filename });
});

// Route: Handle file renaming (POST request)
app.post("/edit", function (req, res) {
    // Rename the specified file (old name: req.body.previous, new name: req.body.new)
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function (err) {
        // Redirect to the home page after renaming
        res.redirect("/");
    });
});

// Route: Handle file creation (POST request)
app.post("/create", function (req, res) {
    // Create a new file with the provided title and content
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function (err) {
        // Redirect to the home page after creating the file
        res.redirect("/");
    });
});

// Route: Handle file deletion (DELETE request)
app.delete("/delete/:filename", function (req, res) {
    // Delete the specified file from the "files" directory
    fs.unlink(`./files/${req.params.filename}`, function (err) {
        if (err) {
            // Send an error response if the deletion fails
            console.error(err);
            res.status(500).send("Failed to delete the file");
        } else {
            // Send a success response if the file is deleted successfully
            res.status(200).send("File deleted");
        }
    });
});

// Start the server on port 3000 and listen for incoming requests
app.listen(3000);
