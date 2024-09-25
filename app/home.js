import { useEffect, useState } from 'react';
import styles from './styles/styles.css';

export default function Home() {
    const [currentUser, setCurrentUser] = useState(null);
    const [weatherInfo, setWeatherInfo] = useState("Loading weather and puppy dog...");
    const [quoteInfo, setQuoteInfo] = useState("");
    const [dogImage, setDogImage] = useState("");
    
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (storedUser) {
            setCurrentUser(storedUser);
            getLocationAndWeather();
            fetchMotivationalQuote();
            if (storedUser.dogBreed) {
                displayDogPicture(storedUser.dogBreed);
            } else {
                assignRandomBreed(storedUser);
            }
        }
    }, []);

    const loginUser = () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const loggedInUser = users.find(user => user.username === username && user.password === password);
        if (loggedInUser) {
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
            window.location.reload();
        } else {
            alert("Incorrect username or password. Please try again.");
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('currentUser');
        window.location.reload();
    };

    const getLocationAndWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchWeatherData, showError);
        } else {
            setWeatherInfo("Geolocation is not supported by this browser.");
        }
    };

    const fetchWeatherData = async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = 'ce7991bea2d81d5c1ba3e774dad5cae9';
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

        try {
            const response = await fetch(weatherUrl);
            const data = await response.json();
            const weatherDescription = data.weather[0].description;
            const temperature = Math.round(data.main.temp);
            const feelsLike = Math.round(data.main.feels_like);
            const windSpeed = Math.round(data.wind.speed);
            const windDegrees = data.wind.deg;
            const directions = ['North', 'North East', 'East', 'South East', 'South', 'South West', 'West', 'North West'];
            const index = Math.round((windDegrees % 360) / 45) % 8;
            const windDirection = directions[index];

            setWeatherInfo(`
                The weather in ${data.name} is ${weatherDescription}.
                Temperature: ${temperature}°F, feels like ${feelsLike}°F.
                Wind: ${windSpeed} mph from the ${windDirection}.
            `);
        } catch (error) {
            setWeatherInfo("Unable to fetch weather data.");
            console.error("Error fetching weather data:", error);
        }
    };

    const fetchMotivationalQuote = async () => {
        try {
            const response = await fetch('https://api.quotable.io/random');
            const data = await response.json();
            setQuoteInfo(`"${data.content}" - ${data.author}`);
        } catch (error) {
            console.error("Error fetching quote:", error);
            setQuoteInfo("Could not fetch quote.");
        }
    };

    const assignRandomBreed = async (user) => {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/list/all');
            const data = await response.json();
            const breeds = Object.keys(data.message);
            const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
            user.dogBreed = randomBreed;
            localStorage.setItem('currentUser', JSON.stringify(user));
            displayDogPicture(randomBreed);
        } catch (error) {
            console.error('Error fetching random breed:', error);
        }
    };

    const displayDogPicture = async (breed) => {
        try {
            const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
            const data = await response.json();
            setDogImage(data.message);
        } catch (error) {
            console.error('Error fetching dog image:', error);
        }
    };

    const showError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                setWeatherInfo("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                setWeatherInfo("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                setWeatherInfo("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                setWeatherInfo("An unknown error occurred.");
                break;
        }
    };

    return (
        <div>
            <h1>Daily Digest Brought to You by Steve</h1>
            {currentUser ? (
                <div id="dashboardSection">
                    <h2>Welcome back, {currentUser.firstname}!</h2>
                    <div id="weatherInfo">
                        <p>{weatherInfo}</p>
                    </div>
                    <div id="quoteInfo">
                        <blockquote>{quoteInfo}</blockquote>
                    </div>
                    {dogImage && (
                        <div id="dogImageContainer">
                            <img src={dogImage} alt={`A picture of a ${currentUser.dogBreed}`} />
                        </div>
                    )}
                    <div id="buttons">
                        <a href="/account">
                            <button type="button" className={styles.smallButton}>Change Account Settings</button>
                        </a>
                        <a href="/">
                            <button type="button" className={styles.smallButton} onClick={logoutUser}>Log Out</button>
                        </a>
                    </div>
                </div>
            ) : (
                <div id="loginSection">
                    <form id="loginForm">
                        <input type="text" id="username" name="username" required className={styles.inputField} placeholder="Username" />
                        <input type="password" id="password" required className={styles.inputField} placeholder="Password" />
                        <input type="button" value="Login" onClick={loginUser} className={styles.button} />
                        <input type="button" value="Register" onClick={() => window.location.href = '/register'} className={styles.button} />
                    </form>
                </div>
            )}
        </div>
    );
}