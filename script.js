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
let forecast = document.getElementById('forecast');
let fiveForecast = document.getElementById('fiveForecast');
let currentDay = moment();
let apiKey = ('36e5780c07d0bb1a99f5324b1427e1e3');
// get cities from local storage
userCities = JSON.parse(localStorage.getItem('userCities')) || [];

// after the city is input, it must be saved on page
// UV index color cordinated to the UV (favorable, moderate, severe)
// when saved cities are clicked on it shows their weather conditions


function getCurrentWeather(cityName) {
    let cityInput = cityName;
    let apiUrl = ('https://api.openweathermap.org/data/2.5/weather?q='
        + cityName + '&units=imperial&appid=' + apiKey);

    // fetches the current day forecast
    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {
            console.log('Response pre Json', data);
            if (response.status === 200) {

                // fetches 5 day forecast
                fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}&exclude=hourly,minutely`)
                .then((x) => {
                    return x.json();
                }).then((fiveData) => {
                    console.log('five day response data', fiveData);
                    displayFiveDayData(fiveData);
                    // displayFiveDayData(fivedata, 'testOne', 'testTwo');
                })

                // fetches UV index forecast
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,daily&appid=${apiKey}`)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (uvData) {
                        console.log(uvData)
                        displayCurrentData(data, uvData);
                        storeCities(cityInput.value, data);
                    })
            } else {
                alert('This is not a City')
            }
        })
    })
};

function displaySavedCities() {
    for (i = 0; i < userCities.length; i++) {
        savedCity.innerHTML = savedCity.innerHTML + ` <li class="list-group-item"> <button  class="btn btn-secondary w-100 cities"> ${userCities[i]} </button> </li> `
    }
    let cities = document.querySelectorAll('.cities')

    for (i = 0; i < cities.length; i++) {
        cities[i].addEventListener('click', function () {
            console.log(this.textContent)
            getCurrentWeather(this.textContent);
        })
    }
    getCurrentWeather(userCities[userCities.length-1]);
};
displaySavedCities();

// displays the current weather data
function displayCurrentData(data, uvData) {
    // current weather conditions have city, date, icon of weather, temperature, humidity, wind, UV
    const { name, dt } = data;
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { icon } = data.weather[0];
    const { uvi } = uvData.current;
    let uvColor = ""
    var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";

    if (uvi >= 0 && uvi < 2) {
        uvColor = "green"
    } else if (uvi > 2 && uvi < 5) {
        uvColor = "orange"
    } else {
        uvColor = "red"
    };

    forecast.innerHTML = `
    <h4 id="currentName">${name}  (${moment(dt, "X").format("MM/DD/YYYY")}) <img src="${iconurl}" alt="" id="currentDesc" /></h4>
    <div id="currentTemp">Temperature: ${temp}°F</div>
    <div id="currentWind">Wind: ${speed} mph</div>
    <div id="currentHumidity">Humidity: ${humidity}%</div>
    <div class="${uvColor}" id="currentUv">UV: ${uvi}</div>`
};

// displays the five day weather data
function displayFiveDayData(fiveData) {
    fiveForecast.innerHTML = ""
    var deckEl = document.createElement('div')
    deckEl.setAttribute('class', 'card-deck')
    fiveForecast.appendChild(deckEl)

    for (i = 0; i < fiveData.list.length; i += 8) {
        // future weather conditions 5-day forecast: date, icon of weather, temp, wind, humidity
        const { dt } = fiveData.list[i];
        const { icon } = fiveData.list[i];
        const { temp, humidity } = fiveData.list[i].main;
        const { speed } = fiveData.list[i].wind;
        var iconEl = fiveData.list[i].weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + iconEl + ".png";

        // displaying the five day data
        var card = document.createElement('div')
        card.setAttribute('class', 'card col')
        deckEl.appendChild(card)
        var listUl = document.createElement('ul')
        listUl.setAttribute('class', 'list-group list-group-flush')
        card.appendChild(listUl)
        var listDateLi = document.createElement('li')
        listDateLi.setAttribute('class', 'list-group-item')
        listDateLi.textContent = moment(dt, "X").format("MM/DD/YYYY")
        listUl.appendChild(listDateLi)
        var listIconLi = document.createElement('img')
        listIconLi.classList.add('w-100')
        listIconLi.src = iconurl
        listIconLi.textContent = icon
        listUl.appendChild(listIconLi)
        var listTempLi = document.createElement('li')
        listTempLi.setAttribute('class', 'list-group-item')
        listTempLi.textContent = temp + ' °F'
        listUl.appendChild(listTempLi)
        var listSpeedLi = document.createElement('li')
        listSpeedLi.setAttribute('class', 'list-group-item')
        listSpeedLi.textContent = speed + ' mph'
        listUl.appendChild(listSpeedLi)
        var listHumidityLi = document.createElement('li')
        listHumidityLi.setAttribute('class', 'list-group-item')
        listHumidityLi.textContent = humidity + '%'
        listUl.appendChild(listHumidityLi)
    }
};

// save searched city in local storage 
function storeCities(city, cityData) {
    if (userCities.includes(cityData.name)) { // if value already exists - don't push to array
        console.log('ALREADY EXISTS DONT PUSH ME')
    } else { // else if- value does not exist- push to array
        userCities.push(cityData.name);
        localStorage.setItem('userCities', JSON.stringify(userCities));
    }
};


// event listeners
searchBtn.addEventListener('click', function () {
    let cityInput = document.getElementById('cityInput')
    getCurrentWeather(cityInput.value);
});

