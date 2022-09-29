const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

//fetch data
function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=836dd1fc`;
    fetch(URL)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "True") {
                displayMovieList(data.Search);
            }
        })
}

function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    // console.log(searchTerm);
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    }
    else{
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    movies.forEach(movie => {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movie.imdbID;
        movieListItem.classList.add('sli')
        if (movie.Poster != "N/A") {
            moviePoster = movie.Poster;
        }
        else{
            moviePoster = "image_not_found.png"
        }

        movieListItem.innerHTML = `
        <div class="search-list-item">
            <div class="search-item-thumbnail">
                <img src="${moviePoster}" alt="">
            </div>
            <div class="search-item-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        </div>
        `;
        searchList.appendChild(movieListItem);
    });
    loadMoviesDetails();
}

function loadMoviesDetails(){
    const searchListMovies = searchList.querySelectorAll('.sli');

    searchListMovies.forEach(movie => {
        movie.addEventListener('click', () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=836dd1fc`)
                .then(res => res.json())
                .then(data => displayMovieDetails(data));
        })
    })
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    
    <div class="movie-poster">
        <img src="${(details.Poster != "N/A")?details.Poster : "image_not_found.png"}" alt="movie poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">
            ${details.Title}
        </h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre} </p>
        <p class="writer"><b>Writer:</b> ${details.Writer} </p>
        <p class="actors"><b>Actors:</b> ${details.Actors} </p>
        <p class="plot"><b>Plot: </b>${details.Plot}</p>
        <p class="language"><b>Language: </b>${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    
    `;
}