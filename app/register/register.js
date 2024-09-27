import { useState, useEffect } from 'react';
import Link from 'next/link';


export default function Register() {
    const [firstname, setFirstname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dogBreed, setDogBreed] = useState("");
    const [breeds, setBreeds] = useState([]);

    useEffect(() => {
        fetchBreeds();
    }, []);

    const fetchBreeds = async () => {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/list/all');
            const data = await response.json();
            const breedOptions = [];

            Object.entries(data.message).forEach(([breed, subBreeds]) => {
                if (subBreeds.length > 0) {
                    subBreeds.forEach(subBreed => {
                        breedOptions.push({
                            value: `${breed}/${subBreed}`,
                            label: `${capitalizeEachWord(breed)} ${capitalizeEachWord(subBreed)}`
                        });
                    });
                } else {
                    breedOptions.push({
                        value: breed,
                        label: capitalizeEachWord(breed)
                    });
                }
            });

            setBreeds(breedOptions);
        } catch (error) {
            console.error('Error fetching breed list:', error);
        }
    };

    const capitalizeEachWord = (string) => {
        return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const registerUser = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            alert("This username is not available, please choose a different username and try again");
        } else {
            const newUser = { firstname, username, password, dogBreed };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            alert("Your account has been created");
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            window.location.href='/';
        }
    };

    return (
        <div>
            <h1>Daily Digest Brought to You by Steve</h1>
            <div id="request">
                <p>Please fill out the form below to create your account</p>
            </div>
            <form id="registerForm">
                <input 
                    type="text" 
                    id="inputField" 
                    name="firstname" 
                    required 
                    placeholder="What should we call you?" 
                    value={firstname} 
                    onChange={(e) => setFirstname(e.target.value)}
                />
                <input 
                    type="text" 
                    id="inputField" 
                    name="username" 
                    required 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type="password" 
                    id="inputField" 
                    name="password" 
                    required 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="dogBreed" id="dogBreedLabel">Select Your Favorite Dog Breed</label>
                <select 
                    id="inputField" 
                    name="dogBreed" 
                    value={dogBreed} 
                    onChange={(e) => setDogBreed(e.target.value)}
                >
                    <option value="">--Select a breed--</option>
                    {breeds.map((breed, index) => (
                        <option key={index} value={breed.value}>{breed.label}</option>
                    ))}
                </select>
                <button type="button" id="button" onClick={registerUser}>
                    Register
                </button>
                <Link href="/" passHref id="linkButton">
                    <button type="button" id="button">
                        Back
                    </button>
                </Link>
            </form>
        </div>
    );
}