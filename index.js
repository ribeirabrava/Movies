var API_KEY = "331f4eac580d9e72f8dc6ed54737ab95";
var listMovies;

var getEmptyDiv = function() {
  var div = document.getElementById("app");
  div.innerHTML = "";

  return div;
};

var renderList = function(list) {
  var ul = document.createElement("ul");

  list.forEach(function(item) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.id = item.id;
    a.onclick = function() {
      info(this.id);
    };

    a.appendChild(document.createTextNode(item.title || item.name));
    li.appendChild(a);
    ul.appendChild(li);
  });

  return ul;
};

var display = async function() {
  var div = getEmptyDiv();
  var result;
  var searchValue = document.getElementById("search").value;

  if (searchValue.length > 0) {
    result = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${searchValue}`
    );
  } else {
    result = await fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`
    );
  }

  var obj = await result.json();
  listMovies = obj.results;

  var ul = renderList(listMovies);

  div.appendChild(ul);
};

var info = async function(id) {
  var app = getEmptyDiv();

  var div = document.createElement("div");
  var h1 = document.createElement("h1");
  var img = document.createElement("img");
  var p = document.createElement("p");
  var h2 = document.createElement("h2");

  var movie = listMovies.filter(function(item) {
    return item.id == id;
  })[0];

  img.src = `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${
    movie.poster_path
  }`;
  p.innerHTML = movie.overview;
  h1.innerHTML = movie.title || movie.name;
  h2.innerHTML = "Recommendations";

  var recommendations = await getRecommendations(movie.id);

  div.appendChild(img);
  div.appendChild(h1);
  div.appendChild(p);
  div.appendChild(h2);

  if (recommendations) {
    var ul = renderList(recommendations.slice(0, 3));
    div.appendChild(ul);
  }

  app.appendChild(div);
};

var getRecommendations = async function(id) {
  var result = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}`
  );
  var obj = await result.json();

  listMovies = obj.results;

  return obj.results;
};

window.addEventListener("load", function() {
  display();
});
