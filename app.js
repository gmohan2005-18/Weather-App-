// Get HTML elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App data
const weather = {};
weather.temperature = { unit: "celsius" };

// Check if browser supports geolocation
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't support geolocation</p>";
}

// Set user’s position
function setPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}

// Show error when there is an issue with geolocation service
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p>${error.message}</p>`;
}

// Get weather from Open-Meteo
function getWeather(latitude, longitude) {
  const api = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      weather.temperature.value = Math.floor(data.current_weather.temperature);
      weather.description = "Current Weather";
      weather.iconId = "01d"; // default sunny icon (you can change)
      weather.latitude = latitude;
      weather.longitude = longitude;

      // Get city name from reverse geocoding
      return fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
    })
    .then((res) => res.json())
    .then((locData) => {
      weather.city =
        locData.address.city ||
        locData.address.town ||
        locData.address.village ||
        "Unknown";
      displayWeather();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      notificationElement.innerHTML = "<p>Unable to fetch weather data</p>";
    });
}

// Display weather to UI
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}`;
}

// Celsius ↔ Fahrenheit conversion
function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

// Toggle temperature unit on click
tempElement.addEventListener("click", function () {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);
    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
