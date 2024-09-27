import { useEffect, useState } from 'react';
import Link from 'next/link';
//eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from '../styles/styles.css'

export default function Home() {
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
            const temperature = Math.round(data.main.temp);
            const feelsLike = Math.round(data.main.feels_like);
            const windSpeed = Math.round(data.wind.speed);
            const windDegrees = data.wind.deg;
            const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
            const index = Math.round((windDegrees % 360) / 45) % 8;
            const windDirection = directions[index];

            setWeatherInfo(`
                ${data.name}, ${data.sys.country}\n
                Temperature: ${temperature}°F\n
                Feels Like: ${feelsLike}°F\n 
                Wind: ${windDirection} ${windSpeed} mph
            `);
        } catch (error) {
            setWeatherInfo("Unable to fetch weather data.");
            console.error("Error fetching weather data:", error);
        }
    }
    const fetchMotivationalQuote = async () => {
        try {
            const response = await fetch('https://api.quotable.io/random');
            const data = await response.json()
            if (data && data.content && data.author) {
                setQuoteInfo(`${data.content} - ${data.author}`)
            } else {
                console.error('Failed to fetch quote data.')
                }
        } catch (error) {
            console.error('Error fetching quote:', error.message)
            }
    }

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
                    <div id="weatherInfo" style={{whiteSpace: 'pre-line'}}>
                        {weatherInfo}
                    </div>
                    <div id="quoteInfo">
                        <blockquote>{quoteInfo}</blockquote>
                    </div>
                    {dogImage && (
                        <div id="dogImageContainer">
                            <img src={dogImage} alt={`A picture of a ${currentUser.dogBreed}`} />
                        </div>
                    )}
                    <Link href="/account">
                        <button type="button" id="smallButton">Change Account Settings</button>
                    </Link>    
                    <Link href="/">
                        <button type="button" id="smallButton" onClick={logoutUser}>Log Out</button>
                    </Link>
                </div>
            ) : (
                <div id="loginSection">
                    <form id="loginForm">
                        <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required id="inputField" placeholder="Username" />
                        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required id="inputField" placeholder="Password" />
                        <button type="button" onClick={loginUser} id="button">Login</button>
                        <Link href="/register" id="linkButton">
                            <button type="button" id="button">Register</button>
                        </Link>
                    </form>
                </div>
            )}
        </div>
    );
}