let cityInput = document.getElementById('cityInput');
let searchBtn = document.getElementById('searchBtn');
let savedCity = document.getElementById('savedCity');
let currentName = document.getElementById('currentName');
let currentDate = document.getElementById('currentDate');
let currentDesc = document.getElementById('currentDesc');
let currentTemp = document.getElementById('currentTempp');
let currentWind = document.getElementById('currentWind');
let currentHumidity = document.getElementById('currentHumidity');
let currentUv = document.getElementById('currentUv');
let apiKey = ('36e5780c07d0bb1a99f5324b1427e1e3');
userCities = [];

// after the city is input, it must be saved on page

// once searched upon

// current weather conditions have city, date, icon of weather, temperature, humidity, wind, UV

// UV index color cordinated to the UV (favorable, moderate, severe)

// future weather conditions 5-day forecast: date, icon of weather, temp, wind, humidity

// when saved cities are clicked on it shows their weather conditions


// get cities from local storage
function loadCities() {
    let cityStr = localStorage.getItem('cities');
    if (cityStr !== null) {
        userCities = JSON.parse(cityStr)
    }
    // for each saved city build a div on page
    for (let i = 0; i < userCities.length; i++) {
        $('#cities').append(buildCityDiv(userCities[i]))
    }
};

// bulding the div for saved cities
function buildCityDiv(cityInput) {
    let newDiv = $('<div>')
    newDiv.text(cityInput)
    newDiv.attr('class', 'city-div')
    newDiv.attr('id', cityInput)
    return newDiv
};




let getCurrentWeather = function () {
    let cityInput = document.getElementById('cityInput');
    let apiUrl = ('https://api.openweathermap.org/data/2.5/weather?q='
        + cityInput.value + '&units=imperial&appid=' + apiKey);
    
    fetch(apiUrl).then(function (response) {
        console.log('Response pre Json', response);
        
       response.json().then(function (data) {
            if(response.status === 200) {
                storeCities(cityInput.value, JSON.stringify(data));
            } else {
                alert('This is not a City')
            }
        })
    })
};


// function displayCurrentData(data) {
//     const { name } = data;
//     const { icon, description } = data.weather;
//     const { temp, humidity } = data.main;
//     const { speed } = data.wind;
//     console.log(name, icon, temp, humidity, description, speed)
// }

// save searched city in local storage 
function storeCities(city, cityData) {
    localStorage.setItem(city, cityData);
};



// event listeners
searchBtn.addEventListener('click', getCurrentWeather);
