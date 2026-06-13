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

        // Reset UI
        errorDiv.textContent = "";
        weatherCard.classList.add("hidden");
        loading.classList.remove("hidden");

        // Get city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        if (!geoResponse.ok) {
            throw new Error("Failed to fetch city information.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("❌ City not found. Try another city.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );

        if (!weatherResponse.ok) {
            throw new Error("Failed to fetch weather data.");
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

    const temp = weatherData.current.temperature_2m;
    const hum = weatherData.current.relative_humidity_2m;
    const windSpeed = weatherData.current.wind_speed_10m;

    temperature.textContent = temp;
    humidity.textContent = hum;
    wind.textContent = windSpeed;

    const weatherIcon =
        document.querySelector(".weather-icon");

    // Change emoji based on temperature

    if (temp >= 40) {
        weatherIcon.textContent = "🔥";
    }
    else if (temp >= 30) {
        weatherIcon.textContent = "☀️";
    }
    else if (temp >= 20) {
        weatherIcon.textContent = "⛅";
    }
    else if (temp >= 10) {
        weatherIcon.textContent = "🌥️";
    }
    else {
        weatherIcon.textContent = "❄️";
    }

    weatherCard.classList.remove("hidden");
}

// Search Button
searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (!city) {
        errorDiv.textContent =
            "⚠️ Please enter a city name.";
        return;
    }

    fetchWeather(city);
});

// Press Enter to Search
cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});

// Default city on page load
window.addEventListener("load", () => {
    fetchWeather("Chennai");
});
