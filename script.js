// Set the default message when the page loads
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('temperature').innerText = 'Type your city'; // Default message
});

async function fetchTemperature(city) {
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
        );
        const cityData = await response.json();

        if (cityData.results && cityData.results.length > 0) {
            const latitude = cityData.results[0].latitude;
            const longitude = cityData.results[0].longitude;

            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const weatherData = await weatherResponse.json();

            const temperature = weatherData.current_weather.temperature;
            const weatherCode = weatherData.current_weather.weathercode; // Get the weather code
            const weatherCondition = mapWeatherCodeToCondition(weatherCode); // Map weather code to condition

            document.getElementById('temperature').innerText = `Current Temperature in ${city}: ${temperature}°C`;
            document.getElementById('weather-condition').innerText = `Condition: ${weatherCondition}`;

            // Update icon based on weather condition
            updateWeatherIcon(weatherCondition);

        } else {
            // If city not found, show this message
            document.getElementById('temperature').innerText = 'City not found. Please try again.';
        }
    } catch (error) {
        document.getElementById('temperature').innerText = 'Error fetching weather data.';
        console.error(error);
    }
}

// Map weather code to a human-readable weather condition
function mapWeatherCodeToCondition(weatherCode) {
    const conditions = {
        0: 'Clear',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Cloudy',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Heavy drizzle',
        56: 'Light freezing drizzle',
        57: 'Heavy freezing drizzle',
        61: 'Light rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Light snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Light rain showers',
        81: 'Moderate rain showers',
        82: 'Heavy rain showers',
        85: 'Light snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with light hail',
        99: 'Thunderstorm with heavy hail'
    };
    return conditions[weatherCode] || 'Unknown';
}

// Function to update the weather icon based on the condition
function updateWeatherIcon(condition) {
    const iconElement = document.getElementById("weather-icon");
    if (condition === "Mainly clear") {
        iconElement.src = "icons/clear.png"; // Clear icon
    } else if (condition === "Cloudy") {
        iconElement.src = "icons/cloudy.png"; // Cloudy icon
    } else if (condition === "Partly cloudy") {
        iconElement.src = "icons/partly-cloudy.png"; // Partly cloudy icon
    } else if (condition === "Rain" || condition.includes("rain")) {
        iconElement.src = "icons/rainy.png"; // Rainy icon
    } else if (condition === "Snow") {
        iconElement.src = "icons/snowy.png"; // Snowy icon
    } else {
        iconElement.src = "icons/default.png"; // Default icon
    }
}

// Function to handle the input and trigger fetchTemperature
function handleFetchWeather() {
    const city = document.getElementById('city-input').value.trim(); // Get and trim city input

    if (city) {
        fetchTemperature(city); // If input is valid, fetch weather data
    } else {
        // If no input, show "Please enter a city name."
        document.getElementById('temperature').innerText = 'Please enter a city name.';
    }
}

// Add event listener to the button
document.getElementById('fetch-weather').addEventListener('click', handleFetchWeather);

// Add event listener for Enter key
document.getElementById('city-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleFetchWeather();
    }
});
