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
            document.getElementById('temperature').innerText = `Current Temperature in ${city}: ${temperature}°C`;
        } else {
            // If city not found, show this message
            document.getElementById('temperature').innerText = 'City not found. Please try again.';
        }
    } catch (error) {
        document.getElementById('temperature').innerText = 'Error fetching weather data.';
        console.error(error);
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
