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

document.getElementById('getJokesBtn').addEventListener('click', () => {
    fetch('/getJokes', {method: "GET"})
        .then(response => response.text())
        .then(data => {
            document.getElementById('waiting-area').innerHTML = data;
        })
        .catch(error => {
            console.error("Error: ", error);
        })
})

document.getElementById('clearJokesListBtn').addEventListener('click', () => {
    document.getElementById('waiting-area').innerHTML = "";
})