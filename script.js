
const movie = document.getElementById("Main-Form")
const movieList = document.getElementById("moviesList")


const KEY = "b7bbd190267131a3569db5974985c1a7"

const Movies = [
    "The avengers",
    "Jurassic park",
    "Oppenheimer",
    "Interstellar",
    "Justice league",
]

function formatDate(dateString) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const parts = dateString.split('-')
  const year = parts[0]
  const monthNumber = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10)

  if (monthNumber >= 1 && monthNumber <= 12) {
    const month = months[monthNumber - 1]
    return `${month} ${day}, ${year}`
  } else {
    return 'Invalid date format'
  }
}

const genreMap = {
  '878': 'Science Fiction',
  '28': 'Action',
  '12': 'Adventure',
  '16': 'Animation',
  '35' : 'Comedy',
  '80' : 'Crime',
  '99' : 'Documentary',
  '18' : 'Drama',
  '10751' : 'Family',
  '14' : 'Fantasy',
  '36' : 'History',
  '27' : 'Horror',
  '10402' : 'Music',
  '9648' : 'Mystery',
  '10749' : 'Romance',
  '10770' : 'TV Movie',
  '53' : 'Thriller',
  '10752' : 'War',
  '37' : 'Western'
}

function convertGenreIdsToText(genreIds) {
  const genres = genreIds.map(id => genreMap[id.toString()])
  return genres.filter(Boolean).join(', ')
}

function displayImage(imagePath, imageSize = 'w300'){
    const baseImageUrl = 'https://image.tmdb.org/t/p/';
    const imageUrl = `${baseImageUrl}${imageSize}${imagePath}?api_key=${KEY}`;

    return imageUrl;
  }


const newCard = movieObject => {
    console.log(newCard)

    return `
        <div class="PostCard" id="${[movieObject.original_title, "card"].join("-")}">
            <img src="${displayImage(movieObject.poster_path)}" alt="${movieObject.original_title}"class="cardimage" id="image">
            <div id="carddetails">
                <div class="cardtitle"> ${movieObject.original_title}</div>
                <div class="cardplot"> ${movieObject.overview}</div>
                <div class="cardgenre"> ${convertGenreIdsToText(movieObject.genre_ids)}</div>
                <div class="cardrelease"> ${formatDate(movieObject.release_date)}</div>
                <div class="cardratings">
                    Ratings: ${roundToOneDecimalPlace(movieObject.vote_average)} 
                    <div class="rate">
                      <button class="btn1" id="btn1" > <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAPhJREFUSEvVld0RwiAQhDedaCfaiVaiVqKdaCexE806LAOEvziXh9xLJMJ9y3JcBqwcw8r5sRTwBHBwoh4AbgDeNZFLAGFy5TwDIKgYvYArgItTe5yeJzc2ATDZ3Ulk8teU/JOM/94B/aY1DKndARjdbvatIqlZpETMQZ8JYMguHjB/VyMEUC19VpVoIS2hNQqqJ7wUnE84n1GZlhamu8xVUwrzosLFOji9S8ctN/R/tG5zgFmFWe9gVmGWgLCseT9+PcoSELYTfwEtASrf6AJaAYrtwwpQbB8hoNUCei6aP1xNTnsR23Ktz9Qg2W9D7wenR312zvYBX6nYQxlawCz8AAAAAElFTkSuQmCC"/> </button>
                    </div>
                </div>
            </div>
        </div> 
        `
}

// const KEY1 = "cd6bbe1"
// const url1 = "http://www.omdbapi.com/?"

const sbutton = document.getElementById("sbutton")
const rateBtn = document.getElementById("rbtn")
const input = document.getElementById("input")

/**
 * The getMovieData function is an asynchronous function
 * that takes a movie title as input and returns the first movie result
 * from the API response.
 * @param {string} title - The title of the movie
 * @return {Promise<Object>} A Promise that resolves to the first movie result
 * from the API response if there is a result,
 * or null if there is no movie result for the given title.
 */
async function getMovieData(title) {
    const cleanTitle = title.includes(' ') ? title.split(' ').join('%20') : title;
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=${cleanTitle}`
  
    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error('Network response was not ok.')
      }
      const data = await response.json()
  
    if (data && data.results && data.results.length > 0) {
      return data.results[0];
      } else {
        console.log(`No movie result for ${title}`)
        return null
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

input.addEventListener('keypress', async function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if(input.value.trim() === '') {
        alert("Input cannot be empty");
        return new Error("Input cannot be empty");
      }
      await showMovie(input.value);
      await showRecommendedMovies(input.value);
    }
  });

  sbutton.onclick = async function() {
    const userInput = input.value.trim()
    if (userInput === '') {
        alert("Input cannot be empty")
        return new Error("Input cannot be empty")
    }

    await showMovie(userInput)
    await showRecommendedMovies(userInput)
}

async function showMovie(title){
    const inMovie = await getMovieData(title)
    const cardHTML = newCard(inMovie)
    movie.innerHTML = cardHTML
    console.log(await getMovieData(title))

    if (inMovie.backdrop_path) {
      const backdropImageUrl = displayImage(inMovie.backdrop_path, 'original')
      document.body.style.backgroundImage = `url('${backdropImageUrl}')`
  } else {
      document.body.style.backgroundImage = ``
  }
}

function roundToOneDecimalPlace(number) {
  return Math.round(number * 10) / 10;
}

const ListCard = moviesList => {
    return `
        <div class="card" data-title="${moviesList.title}" id="${[moviesList.id, "card"].join("-")}">
            <img src="${displayImage(moviesList.poster_path)}" alt="${moviesList.title}"class="card_image">
            <div class="card_plot">${moviesList.overview}</div>
            <div class="card_ratings">RATINGS: ${roundToOneDecimalPlace(moviesList.vote_average)}</div>
        </div>
        `
}

window.onload = async function() {
    const onLoadList = await Promise.all(Movies.map(async onloadMovies => ListCard(await getMovieData(onloadMovies))))
    movieList.innerHTML = onLoadList.join("\n")

    document.querySelectorAll(".card").forEach(card => card.onclick = async () => {
        await showMovie(card.dataset.title)
        await showRecommendedMovies(card.dataset.title)
    })
}

async function getRecommendedMovies(query) {
  const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=${query}&page=1`
  console.log(apiUrl)
  try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
          throw new Error('Network response was not ok.')
      }
      const data = await response.json()

      return data.results
  } catch (error) {
      console.error('Error fetching recommended movies:', error)
      return []
  }
}

const recommended = document.getElementById("recommendedMovies")

async function showRecommendedMovies(query) {
  const recommendedMovies = await getRecommendedMovies(query)

  const recommendedMoviesHTML = recommendedMovies.map(movie => {
      const genreIds = movie.genre_ids.join(',');
      return `
          <div class="recommendedMovie" data-movieid="${movie.id}" data-moviegenre="${genreIds}" data-movietitle="${movie.original_title}">
              <img src="${displayImage(movie.poster_path)}" alt="${movie.original_title}" class="recommendedMovieImage">
              <div class="recommendedMovieDetails">
                  <h3>${movie.original_title}</h3>
                  <h2>${roundToOneDecimalPlace(movie.vote_average)}</h2>
                  
              </div>
          </div>
      `
  }).join('')

  recommended.innerHTML = recommendedMoviesHTML

  console.log('Recommended Movies HTML:', recommendedMoviesHTML)
  console.log('Recommended Movies Data:', recommendedMovies)

  document.querySelectorAll('.recommendedMovie').forEach(card => card.onclick = async () => {
        const movieId = card.getAttribute('data-movieid')
        const movieTitle = card.getAttribute('data-movietitle')
        console.log(`Clicked on movie ID: ${movieId}`)
        await showMovie(movieTitle)
  })
}

document.getElementById('Main-Form').addEventListener('click', function(event) {
  if (event.target.classList.contains('btn1')) {
    const button =  document.getElementById("btn1")
    alert("Liked")
    button.style.backgroundColor = "green"
    
  }
});

s
