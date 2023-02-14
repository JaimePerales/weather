import './style.css'

function processCurrentTemp(weather) {

    const obj = {
        city: weather.name,
        currentTemp: weather.main.temp,
        icon: weather.weather[0].icon,

    };

    return obj
}

function displayCurrentTemp(weather) {
    const cityName = document.querySelector('#city-name');
    const currentTemp = document.querySelector('#current-temp');
    const weatherIcon = document.querySelector('#weather-icon');

    cityName.textContent = `${weather.city}`;
    currentTemp.textContent = `Current Temperature: ${weather.currentTemp} F`;
    weatherIcon.src = ` http://openweathermap.org/img/wn/${weather.icon}@2x.png`
}

async function populateCityWeatherData(city) {
    const apiKey = 'c4e051f734b8048d6994ed5e3d7c5067';
    const requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const request = new Request(requestURL);

    const response = await fetch(request);
    const weather = await response.json();
    console.log(weather);
    const processedWeatherData = processCurrentTemp(weather);


    displayCurrentTemp(processedWeatherData);
}


const button = document.querySelector('#search-button');
const searchBar = document.querySelector('#form input');

button.addEventListener('click', () => {
    populateCityWeatherData(searchBar.value);
    searchBar.value = '';
});