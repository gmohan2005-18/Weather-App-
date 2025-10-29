// Select HTML elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App data
const weather = {};
weather.temperature = { unit: "celsius" };

// Check if browser supports geolocation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// Set user position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

// Show error when there is an issue with geolocation
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

// Get weather data from Open-Meteo
function getWeather(latitude, longitude) {
    let api = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    fetch(api)
        .then(response => response.json())
        .then(data => {
            weather.temperature.value = Math.floor(data.current_weather.temperature);
            weather.description = "Current Weather";
            weather.iconId = getWeatherIcon(data.current_weather.weathercode);
            weather.city = "Your Location";
            weather.country = "";
        })
        .then(() => {
            displayWeather();
        })
        .catch(error => {
            notificationElement.style.display = "block";
            notificationElement.innerHTML = `<p>Unable to fetch weather data: ${error.message}</p>`;
        });
}

// Convert weather code to simple icons (custom)
function getWeatherIcon(code) {
    // Simple icon mapping based on weather codes
    if (code === 0) return "https://cdn-icons-png.flaticon.com/512/1163/1163661.png"; // Clear
    else if (code < 4) return "https://cdn-icons-png.flaticon.com/512/414/414825.png"; // Cloudy
    else if (code < 60) return "https://cdn-icons-png.flaticon.com/512/1163/1163624.png"; // Light rain
    else return "https://cdn-icons-png.flaticon.com/512/1146/1146869.png"; // Heavy rain or storm
}

// Display weather in UI
function displayWeather() {
    iconElement.innerHTML = `<img src="${weather.iconId}" alt="Weather icon"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}`;
}

// Celsius ↔ Fahrenheit toggle
tempElement.addEventListener("click", function () {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
});

// Celsius to Fahrenheit conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}
