import './style.css'
import { format } from 'date-fns';


let currentSelectedUnits = 'imperial';

function getLocalTime(timezone) {
    const localTime = new Date().getTime()
    const localOffset = new Date().getTimezoneOffset() * 60000
    const currentUtcTime = localOffset + localTime
    const cityOffset = currentUtcTime + 1000 * timezone
    const cityTime = format(new Date(cityOffset), 'p');
    return cityTime
}

function processCurrentTemp(weather) {



    const obj = {
        city: weather.city.name,
        currentTemp: Math.round(weather.list[0].main.temp),
        icon: weather.list[0].weather[0].icon,
        type: weather.list[0].weather[0].main,
        date: format((weather.list[0].dt * 1000), `eeee, do MMM ''yy`),
        time: getLocalTime(weather.city.timezone),
        feelsLike: Math.round(weather.list[0].main.feels_like),
        humidity: weather.list[0].main.humidity,
        rain: weather.list[0].pop,
        wind: weather.list[0].wind.speed,

    };

    return obj
}



function displayCurrentTemp(weather) {

    const weatherType = document.querySelector('#weather-type');
    const cityName = document.querySelector('#city-name');
    const localDate = document.querySelector('#local-date');
    const localTime = document.querySelector('#local-time');
    const currentTemp = document.querySelector('#current-temp');
    const weatherIcon = document.querySelector('#weather-icon');

    weatherType.textContent = weather.type;
    cityName.textContent = weather.city;
    localDate.textContent = weather.date;
    localTime.textContent = weather.time;
    currentTemp.textContent = `${weather.currentTemp} \u00B0${currentSelectedUnits === 'imperial' ? 'F': 'C'}`;
    weatherIcon.src = ` http://openweathermap.org/img/wn/${weather.icon}@2x.png`
}

function displayWeatherInfo(weather) {
    const feelsLike = document.querySelector('#feels-like');
    const humidity = document.querySelector('#humidity');
    const rain = document.querySelector('#rain');
    const wind = document.querySelector('#wind');

    feelsLike.textContent = `Feels Like: ${weather.feelsLike} \u00B0${currentSelectedUnits === 'imperial' ? 'F': 'C'}`;
    humidity.textContent = `Humidity: ${weather.humidity}`;
    rain.textContent = `Chance of Rain: ${weather.rain}`;
    wind.textContent = `Wind Speed: ${weather.wind} ${currentSelectedUnits === 'imperial' ? 'MPH': 'KPH'}`;
}

async function populateCityWeatherData(city, selectedUnits) {
    const apiKey = '';
    const weatherRequestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${selectedUnits}`;
    const weatherRequest = new Request(weatherRequestURL);
    const weatherResponse = await fetch(weatherRequest);
    const weather = await weatherResponse.json();

    console.log(weather);



    const processedWeatherData = processCurrentTemp(weather);


    displayCurrentTemp(processedWeatherData);
    displayWeatherInfo(processedWeatherData);

}

function attachChangeUnitsEventListener(city) {
    const changeUnit = document.querySelector('#change-units');

    const newEle = changeUnit.cloneNode(true);
    newEle.addEventListener('click', () => {
        if (currentSelectedUnits === 'imperial') {
            currentSelectedUnits = 'metric';
        } else {
            currentSelectedUnits = 'imperial';
        }
        populateCityWeatherData(city, currentSelectedUnits);
    });
    if (changeUnit.parentNode !== null) {
        changeUnit.parentNode.replaceChild(newEle, changeUnit);
    }


    changeUnit.addEventListener('click', () => {

    })


}

const searchButton = document.querySelector('#search-button');
const searchBar = document.querySelector('#form input');

searchButton.addEventListener('click', () => {
    populateCityWeatherData(searchBar.value, currentSelectedUnits);
    attachChangeUnitsEventListener(searchBar.value)
    searchBar.value = '';
});



const testCity = 'San Antonio';
populateCityWeatherData(testCity, currentSelectedUnits);
attachChangeUnitsEventListener(testCity);