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
let forecast = document.getElementById('forecast')
let fiveForecast = document.getElementById('fiveForecast')
let apiKey = ('36e5780c07d0bb1a99f5324b1427e1e3');
userCities = JSON.parse(localStorage.getItem('userCities')) || [];

// after the city is input, it must be saved on page

// once searched upon

// current weather conditions have city, date, icon of weather, temperature, humidity, wind, UV

// UV index color cordinated to the UV (favorable, moderate, severe)

// future weather conditions 5-day forecast: date, icon of weather, temp, wind, humidity

// when saved cities are clicked on it shows their weather conditions


// get cities from local storage



function getCurrentWeather(cityName) {
    let cityInput = cityName;
    let apiUrl = ('https://api.openweathermap.org/data/2.5/weather?q='
        + cityName + '&units=imperial&appid=' + apiKey);

    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {
            console.log('Response pre Json', data);
            if (response.status === 200) {

                // 5 day forecast
                fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`).then((x) => {
                    return x.json();
                }).then((response) => {
                    console.log('five day response data', response);
                    displayFiveDayData(data, 'testOne', 'testTwo');
                })

                // UV index forecast
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
};
displaySavedCities();


function displayCurrentData(data, uvData) {
    const { name, dt } = data;
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { icon } = data.weather[0];
    const { uvi } = uvData.current
    var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";

    forecast.innerHTML = `
    <h4 id="currentName">${name}  (${moment(dt, "X").format("MM/DD/YYYY")}) <img src="${iconurl}" alt="" id="currentDesc" /></h4>
    <div id="currentTemp">Temperature: ${temp}°F</div>
    <div id="currentWind">Wind: ${speed} mph</div>
    <div id="currentHumidity">Humidity: ${humidity}</div>
    <div id="currentUv">UV: ${uvi}</div>`
};



function displayFiveDayData(data) {
    const { dt } = data.list;
    const { icon } = data.list.weather[0];
    const { temp, humidity } = data.list.main;
    const { speed } = data.list.wind;
    var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
   
    fiveForecast.innerHTML = `
    <div class="m-5 row justify-content-around">
        <div class="col-12 col-md-6 col-xl-3 mb-3">
            <div class="card">
                <ul id="list-toDo" class="list-group list-group-flush">
                    <div id="futureDate-0">${moment(dt, "X").format("MM/DD/YYYY")}</div>
                    <img src="${iconurl}" alt="" id="futureDesc-0" />
                    <div id="futureTemp-0">${temp}°F</div>
                    <div id="futureWind-0">${speed} mph</div>
                    <div id="futureHumidity-0">${humidity}</div>
                </ul>
            </div>
        </div>    
    </div>`
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
