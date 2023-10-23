
const movie = document.getElementById("Main-Form")
const movieList = document.getElementById("moviesList")

const Movies = [
    "The avengers",
    "2012",
    "Superman",
    "Interstellar",
    "Justice league",
];

const newCard = movieObject => {
    console.log(newCard)
    
    return `
        <div class="PostCard" id="${[movieObject.Title, "card"].join("-")}">
            <img src="${movieObject.Poster}" alt="${movieObject.Title}"class="cardimage">
            <div id="carddetails">
                <div class="cardtitle"> ${movieObject.Title}</div>
                <div class="cardplot"> ${movieObject.Plot}</div>
                <div class="cardgenre"> ${movieObject.Genre}</div>
                <div class="cardactors"> ${movieObject.Actors}</div>
                <div class="cardrelease"> ${movieObject.Released}</div>
                <div class="cardratings">
                    Ratings: ${movieObject.imdbRating} 
                    <div class="rate">
                        Rate it yourself? <button class="btn1" id="rbtn">Rate</button>
                    </div>
                </div>
                    
            </div>
        </div> 
        `
}

const KEY = "cd6bbe1"
const url = "http://www.omdbapi.com/?"

const sbutton = document.getElementById("sbutton")
const rateBtn = document.getElementById("rbtn")
const input = document.getElementById("input")

const getMovieData = async title => {

    try {
        const cleanTitle = title.includes(" ") ? title.split(" ").join("+") : title
        const response = await fetch (`${url}t=${cleanTitle}&apikey=${KEY}`)
        return await response.json()
    } catch (error){
        console.log(`An error had occured:\n\t${error}`);
    }
}

sbutton.onclick = async () => {
    if(input.value.trim() === '' ){
        alert("Input cannot be empty")
        return new Error("input cannot be empty")
    }
    await showMovie(input.value)
}

async function showMovie(title){
    const inMovie = await getMovieData(title)
    const cardHTML = newCard(inMovie)
    movie.innerHTML = cardHTML
    console.log(await getMovieData(title))
}

const ListCard = moviesList => {
    return `
        <div class="card" data-title="${moviesList.Title}" id="${[moviesList.Title, "card"].join("-")}">
            <img src="${moviesList.Poster}" alt="${moviesList.Title}"class="card_image">
            <div class="card_plot">${moviesList.Plot}</div>
            <div class="card_ratings">RATINGS: ${moviesList.imdbRating}</div>
        </div>
        `
}

window.onload = async () => {
    const onLoadList = await Promise.all(Movies.map(async onloadMovies => ListCard(await getMovieData(onloadMovies))))
    movieList.innerHTML = onLoadList.join("\n")

    document.querySelectorAll(".card").forEach(card => card.onclick = async () => {
        await showMovie(card.dataset.title)
    })
}

