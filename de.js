function processData() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  // Function to perform decryption in JavaScript
  function decrypt(content) {
    const words = content.split(' ');
    const decryptedWords = [];

    for (const word of words) {
      const prefix = word.slice(0, 2);
      const wordWithoutPrefix = word.slice(2);
      const middle = Math.floor(wordWithoutPrefix.length / 2);
      const decryptedWord =
        wordWithoutPrefix.slice(middle) + wordWithoutPrefix.slice(0, middle);
      decryptedWords.push(decryptedWord);
    }

    return decryptedWords.join(' ');
  }

  // Fetch the JSON data from data.json
  fetch("data_encrypted.json")
    .then(response => response.json())
    .then(data => {
      // Decrypt the content in the data
      for (const entry of data) {
        if (entry.content) {
          entry.content = decrypt(entry.content);
        }
      }
      const notes = data;

      // Create a new Fuse instance
      const fuse = new Fuse(notes, {
        keys: ["title", "content", "tags"]
      });

      // Add an event listener to the search input
      searchInput.addEventListener("input", handleSearch);

      // Function to handle search input
      function handleSearch() {
        const searchTerm = searchInput.value;
        if (searchTerm) {
          const result = fuse.search(searchTerm);
          displaySearchResults(result);
        } else {
          searchResults.innerHTML = "";
        }
      }

      // Function to display search results
      function displaySearchResults(results) {
        searchResults.innerHTML = "";

        if (results.length === 0) {
          searchResults.innerHTML = "<p>No results found.</p>";
          return;
        }

        results.forEach((result) => {
          const note = result.item;
          const noteElement = document.createElement("div");
          noteElement.innerHTML = `
            <div class="card mt-3">
              <div class="card-body">
                <h5 class="card-title">${note.title}</h5>
                <img src="${note.image}" alt="Note Image"> <!-- Render the image -->
                <pre class="card-text">${note.content}</pre>
                <p class="card-text"><small class="text-muted">${note.date}</small></p>
              </div>
            </div>
          `;

          searchResults.appendChild(noteElement);
        });
      }
    })
    .catch(error => {
      console.error("Error fetching JSON data:", error);
    });
}

// Call the function to execute your code
processData();
