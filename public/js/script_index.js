document.getElementById('fetchButton').addEventListener('click', () => {
    var limit = 3;
    fetch('https://api.api-ninjas.com/v1/jokes?limit=' + limit, {
        headers: {
            'X-Api-Key': 'cCf9DoL/p+eMM+XYRsQ+/w==TjshVa1EhOOHeTf5'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // console.log(data);
        let jokes_html = "";
        data.forEach(joke => {
            jokes_html += "<p>"+joke['joke']+"</p>";
        });
        document.getElementById('waiting-area').innerHTML = jokes_html;
    })
    .catch(error => {
        console.error('Fetch Error:', error);
    });
});

document.getElementById('addJokeBtn').addEventListener('click', () => {
    fetch('/addJoke', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});