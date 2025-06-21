const { json } = require("express");

var posts = [];
var search = null;

/*
 * Hides the main part of the page to show the Ask a Question section
 */
function showAsk(){
    var main = document.getElementById("main");
    var ask = document.getElementById("ask");
    main.style.display = "none";
    ask.style.display = "block";
}

/*
 * Hides the Ask a Question section of the page to show the main part,
 * clearing the question input fields.
 */
function showMain(){
    var main = document.getElementById("main");
    var ask = document.getElementById("ask");
    ask.style.display = "none";
    main.style.display = "block";

    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
    document.getElementById('post-tags').value = '';
}

/*
 * Creates a new question/post & send it to the server, before triggering an update for the main part of the page.
 */
function createPost(){

    search = null;

    let post = {
        title: document.getElementById('post-title').value,
        content: document.getElementById('post-content').value,
        tags: document.getElementById('post-tags').value.split(" "),
        upvotes: 0
    };

    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();

    // Define function to run on response
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Update the page on success
            loadPosts();
            showMain();
        }
    };

    // Open connection to server & send the post data using a POST request
    // We will cover POST requests in more detail in week 8
    xmlhttp.open("POST", "/addpost", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(post));

}

/*
 * Updates the search term then reloads the posts shown
 */
function searchPosts(){

    search = document.getElementById('post-search').value.toUpperCase();
    updatePosts();

}


/*
 * Reloads the posts shown on the page
 * Iterates over the array of post objects, rendering HTML for each and appending it to the page
 * If a search term is being used
 */
function updatePosts() {

    // Reset the page
    document.getElementById('post-list').innerHTML = '';

    // Iterate over each post in the array by index
    for(let i=0; i<posts.length; i++){

        let post = posts[i];

        // Check if a search term used.
        if(search !== null){
            // If so, skip this question/post if title or content doesn't match
            if (post.title.toUpperCase().indexOf(search) < 0 &&
                post.content.toUpperCase().indexOf(search) < 0 ) {
                continue;
            }
        }

        // Generate a set of spans for each of the tags
        let tagSpans = '';
        for(let tag of post.tags){
            tagSpans = tagSpans + `<span class="tag">${tag}</span>`;
        }

        // Generate the post/question element and populate its inner HTML
        let postDiv = document.createElement("DIV");
        postDiv.classList.add("post");

        postDiv.innerHTML = `
            <div class="votes">
                <button onclick="upvote(${i})">+</button>
                <p><span class="count">${post.upvotes}</span><br />votes</p>
                <button onclick="downvote(${i})">-</button>
            </div>
            <div class="content">
                <h3><a href="#">${post.title}</a></h3>
                <i>By ${post.author}</i>
                <p>${post.content}</p>
                ${tagSpans}<span class="date">${new Date(post.timestamp).toLocaleString()}</span>
            </div>
        `;

        // Append the question/post to the page
        document.getElementById("post-list").appendChild(postDiv);

    }


}

/*
 * Loads posts from the server
 * - Send an AJAX GET request to the server
 * - JSON Array of posts sent in response
 * - Update the
 */
function loadPosts() {

    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();

    // Define function to run on response
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Parse the JSON and update the posts array
            posts = JSON.parse(this.responseText);
            // Call the updatePosts function to update the page
            updatePosts();
        }
    };

    // Open connection to server
    xmlhttp.open("GET", "/posts", true);

    // Send request
    xmlhttp.send();

}


/*
 * Increase the votes for a given post, then update the page
 */
function upvote(index) {
    posts[index].upvotes ++;
    updatePosts();
}

/*
 * Decrease the votes for a given post, then update the page
 */
function downvote(index) {
    posts[index].upvotes --;
    updatePosts();
}

/*
 * POST the username and password inserted to /api/users/users/login
 */
function login(){

    let user = {
        user: document.getElementById('username').value,
        pass: document.getElementById('password').value
    };

    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();

    // Define function to run on response
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let role = JSON.parse(this.responseText);
            // Check if user is owner or walker and send to correct page
            if (role === "owner") {
                window.location.href = '/owner-dashboard.html';
            } else if (role === "walker") {
                window.location.href = '/walker-dashboard.html';
            }
        } else if (this.readyState === 4 && this.status >= 400) {
            alert("Login failed");
        }
    };

    // Open connection to server & send the post data using a POST request
    // We will cover POST requests in more detail in week 8
    xmlhttp.open("POST", "/api/users/users/login", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(user)); // Send user object

}

/*
 * POST a request to logout to /api/users/users/logout
 */
function logout(){

    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();
    // Send user back to homepage
    window.location.href = '/';

    // Open connection to server & send the post data using a POST request
    xmlhttp.open("POST", "/api/users/users/logout", true);
    xmlhttp.send();

}

/*
 * GET names of dogs that user owns
 */
function loadMyDogs(){
    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();
    // Define function that runs when ready state is changed
    xmlhttp.onreadystatechange = function() {
        // Run code if ready state is 4 and status is 200
        if (this.readyState === 4 && this.status === 200) {
            // Convert dog names into javascript object
            let dog_names_array = JSON.parse(xmlhttp.responseText);
            // Get the dropdown element
            let drop_down = document.getElementById("dog_names");
            // For all dog names obtained, create a new option in the dropdown
            for (let i = 0; i < dog_names_array.length; i++) {
                let new_dog_name = document.createElement("option");
                new_dog_name.text = dog_names_array[i].name;
                drop_down.add(new_dog_name);
            }
        }
    };
    // Open connection to server & GET the user's dog data
    xmlhttp.open("GET", "/api/users/mydogs", true);
    xmlhttp.send();
}

/*
 * GET id of current user
 */
async function getCurrentUser() {
    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();
    // Define function that runs when ready state is changed
    xmlhttp.onreadystatechange = function() {
        // Run code if ready state is 4 and status is 200
        if (this.readyState === 4 && this.status === 200) {
            // Return id of user
            console.log(JSON.parse(xmlhttp.responseText));
            return JSON.parse(xmlhttp.responseText);
        }
    };
    // Open connection to server & GET the user's id
    xmlhttp.open("GET", "/api/users/me", true);
    xmlhttp.send();
}

/*
 * GET info of all dogs and create table
 */
function addDogsTable(){
    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();
    // Define function that runs when ready state is changed
    xmlhttp.onreadystatechange = function() {
        // Run code if ready state is 4 and status is 200
        if (this.readyState === 4 && this.status === 200) {
            // Convert dog info into javascript object
            let dog_info_array = JSON.parse(xmlhttp.responseText);
            // Get the table element
            let table = document.getElementById("dog_table");
            // For all dog info obtained, create a new row in the table
            for (let i = 0; i < dog_info_array.length; i++) {
                let dog_row = table.insertRow();
                let dog_id = dog_row.insertCell();
                dog_id.innerText = dog_info_array[i].dog_id;
                let dog_name = dog_row.insertCell();
                dog_name.innerText = dog_info_array[i].name;
                let dog_size = dog_row.insertCell();
                dog_size.innerText = dog_info_array[i].size;
                let dog_owner_id = dog_row.insertCell();
                dog_owner_id.innerText = dog_info_array[i].owner_id;
                let dog_photo = dog_row.insertCell();
                let dog_photo_fetched = fetch("https://dog.ceo/api/breeds/image/random");
                dog_photo.innerHTML = "<img src='https://dog.ceo/api/breeds/image/random' alt='Image of " + dog_info_array[i].name + "'>";
            }
        }
    };
    // Open connection to server & GET the user's dog data
    xmlhttp.open("GET", "/api/users/api/dogs", true);
    xmlhttp.send();
}
