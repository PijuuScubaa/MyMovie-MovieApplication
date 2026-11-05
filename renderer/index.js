document.addEventListener('DOMContentLoaded', () => {
    
    // --- TASK 2 & 6: API Integration & DOM Manipulation ---
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', async () => {
            const query = document.getElementById('movieInput').value.trim();
            const errorDiv = document.getElementById('apiError');
            const resultCard = document.getElementById('resultCard');
            const displayDiv = document.getElementById('movieDisplay');
            const suggestionDiv = document.getElementById('suggestionBox');
            const actionContainer = document.getElementById('actionContainer');
            
            errorDiv.textContent = '';
            displayDiv.innerHTML = '';
            suggestionDiv.innerHTML = '';
            actionContainer.innerHTML = '';

            if (!query) {
                errorDiv.textContent = 'Please enter a valid movie title.';
                resultCard.style.display = 'none';
                return;
            }

            try {
                const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=trilogy`);
                const data = await response.json();

                if (data.Response === 'False') {
                    errorDiv.textContent = 'No movie results found. Try another title!';
                    resultCard.style.display = 'none';
                    return;
                }

                resultCard.style.display = 'block';

                displayDiv.innerHTML = `
                    <div style="display: flex; gap: 20px; align-items: flex-start;">
                        <img src="${(data.Poster && data.Poster !== 'N/A') ? data.Poster : 'https://via.placeholder.com/100x150?text=No+Image'}" width="100" height="150" alt="Poster" style="border-radius: 4px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/100x150?text=Error'">
                        <div>
                            <h3>${data.Title} (${data.Year})</h3>
                            <p><strong>Genre:</strong> ${data.Genre}</p>
                            <p><strong>Director:</strong> ${data.Director}</p>
                            <p><strong>Runtime:</strong> ${data.Runtime}</p>
                        </div>
                    </div>
                `;

                const saveBtn = document.createElement('button');
                saveBtn.textContent = '⭐ Save to Watchlist';
                saveBtn.style.backgroundColor = '#10b981';
                // Pass data.Runtime into the save function
                saveBtn.addEventListener('click', () => {
                    saveToWatchlist(data.Title, data.Genre, data.Poster, data.Runtime);
                });
                actionContainer.appendChild(saveBtn);

                let suggestion = '';
                const genre = data.Genre.toLowerCase();
                
                if (genre.includes('action')) {
                    suggestion = '💡 Suggestion: Great choice for an action night! Pair it with popcorn and high-energy snacks.';
                } else if (genre.includes('comedy')) {
                    suggestion = '💡 Suggestion: Comedy movie detected! Perfect choice to lift your mood with friends.';
                } else if (genre.includes('drama')) {
                    suggestion = '💡 Suggestion: Deep drama movie. Make sure to keep tissues handy!';
                } else {
                    suggestion = '💡 Suggestion: Excellent pick! Enjoy your cinematic experience.';
                }
                suggestionDiv.textContent = suggestion;

            } catch (error) {
                errorDiv.textContent = 'Failed to connect to the movie API. Check your internet connection.';
                resultCard.style.display = 'none';
            }
        });
    }

    // --- TASK 3: Interactive Genre Dropdown Suggestion Logic ---
    const genreSelect = document.getElementById('genreSelect');
    if (genreSelect) {
        genreSelect.addEventListener('change', async () => {
            const selectedGenre = genreSelect.value.toLowerCase();
            const suggestionBox = document.getElementById('categorySuggestionBox');
            
            suggestionBox.innerHTML = '';

            if (!selectedGenre) {
                suggestionBox.style.display = 'none';
                return;
            }

            suggestionBox.style.display = 'block';
            suggestionBox.innerHTML = '<p>Loading official movie recommendation...</p>';

            let movieTitleToSearch = '';
            let snackTip = '';

            if (selectedGenre.includes('action')) {
                movieTitleToSearch = 'Mad Max Fury Road';
                snackTip = '🍿 Recommended Pairing: Extra-salted popcorn and an energy drink.';
            } else if (selectedGenre.includes('comedy')) {
                movieTitleToSearch = 'Superbad';
                snackTip = '🍿 Recommended Pairing: Shareable candy and sweet soda.';
            } else if (selectedGenre.includes('horror') || selectedGenre.includes('thriller')) {
                movieTitleToSearch = 'The Conjuring';
                snackTip = '🍿 Recommended Pairing: Hot coffee to keep you wide awake!';
            } else if (selectedGenre.includes('romance')) {
                movieTitleToSearch = 'The Notebook';
                snackTip = '🍿 Recommended Pairing: Hot chocolate and soft blankets.';
            } else if (selectedGenre.includes('animation')) {
                movieTitleToSearch = 'Spider-Man Into the Spider-Verse';
                snackTip = '🍿 Recommended Pairing: Sweet popcorn and fruit juice.';
            } else {
                movieTitleToSearch = 'Inception';
                snackTip = '🍿 Recommended Pairing: Classic cinema snacks.';
            }

            try {
                const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(movieTitleToSearch)}&apikey=trilogy`);
                const movieData = await response.json();

                const posterUrl = (movieData.Poster && movieData.Poster !== 'N/A') ? movieData.Poster : 'https://via.placeholder.com/70x100?text=No+Image';

                suggestionBox.innerHTML = `
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <img src="${posterUrl}" width="70" height="100" alt="Movie Poster" style="border-radius: 4px; object-fit: cover;">
                        <div>
                            <p style="margin: 0 0 5px 0;">🎬 Top Pick: <strong>${movieData.Title} (${movieData.Year})</strong></p>
                            <p style="font-size: 0.9rem; color: #4b5563; margin: 0;">${snackTip}</p>
                        </div>
                    </div>
                `;
            } catch (err) {
                suggestionBox.innerHTML = '<p style="color: red;">Failed to load recommendation poster.</p>';
            }
        });
    }

    // --- TASK 4: Watchlist Marathon Calculator ---
    const calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const resultDiv = document.getElementById('calcResult');
            let watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];
            
            if (watchlist.length === 0) {
                resultDiv.textContent = 'Your watchlist is empty! Save some movies first to calculate marathon time.';
                resultDiv.style.color = 'red';
                return;
            }

            let totalMinutes = 0;
            watchlist.forEach(movie => {
                if (movie.runtime && movie.runtime !== 'N/A') {
                    // Extract numeric value from strings like "148 min"
                    const match = movie.runtime.match(/(\d+)/);
                    if (match) {
                        totalMinutes += parseInt(match[1]);
                    }
                }
            });

            resultDiv.style.color = '#fbbf24';
            const totalHours = (totalMinutes / 60).toFixed(1);
            resultDiv.textContent = `📊 Total Marathon Time: ${totalMinutes} mins (${totalHours} hrs) for ${watchlist.length} saved movie(s)`;
        });
    }
});

// Helper function to save API movie along with its runtime to Local Storage
function saveToWatchlist(title, genre, poster, runtime) {
    let watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];
    
    const exists = watchlist.some(movie => movie.title.toLowerCase() === title.toLowerCase());
    if (exists) {
        alert(`"${title}" is already in your watchlist!`);
        return;
    }

    watchlist.push({ title, genre, poster, runtime });
    localStorage.setItem('myWatchlist', JSON.stringify(watchlist));
    alert(`Success! "${title}" has been saved to your watchlist.`);
}