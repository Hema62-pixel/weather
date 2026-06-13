const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherCard = document.getElementById("weatherCard");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const errorDiv = document.getElementById("error");
const loading = document.getElementById("loading");

async function fetchWeather(city) {

    try {

        errorDiv.textContent = "";
        weatherCard.classList.add("hidden");
        loading.classList.remove("hidden");

        // Step 1: Get latitude & longitude
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        if (!geoResponse.ok) {
            throw new Error("Geocoding request failed");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Fetch weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather request failed");
        }

        const weatherData = await weatherResponse.json();

        displayWeather(location, weatherData);

    } catch (error) {
        errorDiv.textContent = error.message;
    } finally {
        loading.classList.add("hidden");
    }
}

function displayWeather(location, weatherData) {

    cityName.textContent =
        `${location.name}, ${location.country}`;

    temperature.textContent =
        weatherData.current.temperature_2m;

    humidity.textContent =
        weatherData.current.relative_humidity_2m;

    wind.textContent =
        weatherData.current.wind_speed_10m;

    weatherCard.classList.remove("hidden");
}

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (!city) {
        errorDiv.textContent = "Please enter a city name";
        return;
    }

    fetchWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});
