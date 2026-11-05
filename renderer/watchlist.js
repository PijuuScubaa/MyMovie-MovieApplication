document.addEventListener('DOMContentLoaded', () => {
    loadWatchlist();
});

function loadWatchlist() {
    const listEl = document.getElementById('watchlistTable');
    if (!listEl) return;

    let watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];
    listEl.innerHTML = '';

    if (watchlist.length === 0) {
        listEl.innerHTML = '<li>No saved movies in your watchlist yet. Search and save some from the search page!</li>';
        return;
    }

    watchlist.forEach((movie, index) => {
        const li = document.createElement('li');
        const posterSrc = (movie.poster && movie.poster !== "N/A") ? movie.poster : "https://via.placeholder.com/50x75?text=No+Image";

        li.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${posterSrc}" width="50" height="75" alt="Poster" style="object-fit: cover; border-radius: 4px;">
                <div>
                    <strong style="font-size: 1.05rem;">${movie.title}</strong><br>
                    <span style="color: #6b7280; font-size: 0.9rem;">${movie.genre}</span>
                </div>
            </div>
            <button onclick="deleteMovie(${index})" style="background-color: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Delete</button>
        `;
        listEl.appendChild(li);
    });
}

window.deleteMovie = function(index) {
    let watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];
    watchlist.splice(index, 1);
    localStorage.setItem('myWatchlist', JSON.stringify(watchlist));
    loadWatchlist();
};