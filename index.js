// Import the express package
const express = require('express');
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',         // MySQL host (e.g., localhost)
    user: 'root',     // MySQL username
    password: '', // MySQL password
    database: 'node_js_project', // MySQL database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// create instance of express application
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.post('/addJoke', (req, res) => {
    const joke = "HAJAHAHAHHahAJJAJAJAJAA this joke so funnyyy.";
    const current_date = new Date();
    const query = "INSERT into original_jokes (content, created_by, created_at) VALUES (?, ?, ?)";

    pool.query(query, [joke, 1, current_date], (error, results) => {
        if(error){
            console.error("pata nhi ki hoya query ni chaldi payiii. kher, ERROR: ", error);
            res.status(500).json({message: "failed to add joke! "});
        }
        else{
            res.json({ message: 'joke added successfully!'});
        }
    })
})

app.get('/getJokes', (req, res) => {
    const query = "SELECT * FROM original_jokes";

    pool.query(query, (error, results) => {
        if(error){
            console.error("Error: ", error);
            res.status(500).json({message: "Failed to get jokes!"});
        }
        else{
            const jokes_html = results.map(joke => `<p>${joke.content}</p>`).join('');
            console.log("successfully got jokes!");
            res.send(jokes_html);
            // res.json({message: 'successfully got jokes'})
        }
    })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Hello testing. your server is running on port number ${port}`);
});