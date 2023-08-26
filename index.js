// Import the express package
const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');


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
    // const joke = "HAJAHAHAHHahAJJAJAJAJAA this joke so funnyyy isnt it";

    // dynamically get joke from API
    let joke = "";
    const limit = 1;
    const apiKey = 'cCf9DoL/p+eMM+XYRsQ+/w==TjshVa1EhOOHeTf5'; // Replace with your actual API key

    axios.get(`https://api.api-ninjas.com/v1/jokes?limit=${limit}`, {
        headers: {
            'X-Api-Key': apiKey
        }
    })
    .then(response => {
        if (response.status === 200) {
            joke = response.data[0].joke; // Get the joke from the response
            console.log(joke);

            const current_date = new Date();

            const select_query = "SELECT content FROM original_jokes WHERE content = ?";
            pool.query(select_query, [joke], (error, results) => {
                if(error){
                    console.error("Error while selecting in /addJoke: ", error)
                    res.status(500).json({message: "failed to select jokes in /addJoke for checking uniqueness"});
                }
                else{
                    if(results.length === 0){
                        const insert_query = "INSERT into original_jokes (content, created_by, created_at) VALUES (?, ?, ?)";
                        pool.query(insert_query, [joke, 1, current_date], (error, results) => {
                            if(error){
                                console.error("pata nhi ki hoya query ni chaldi payiii. kher, ERROR: ", error);
                                res.status(500).json({message: "failed to add joke! "});
                            }
                            else{
                                res.json({ message: 'joke added successfully!'});
                            }
                        })
                    }
                    else{
                        res.json({message: "Joke already exists"});
                    }
                }
            })

        } else {
            console.error('Error:', response.status, response.statusText);
        }
    })
    .catch(error => {
        console.error('Request failed:', error);
    });

    
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