import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/styles.css';

export default function Register() {
    const [firstname, setFirstname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dogBreed, setDogBreed] = useState("");
    const [breeds, setBreeds] = useState([]);
    const router = useRouter();

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
            router.push('/');
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
                    id="firstname" 
                    name="firstname" 
                    required 
                    className={styles.inputField} 
                    placeholder="What should we call you?" 
                    value={firstname} 
                    onChange={(e) => setFirstname(e.target.value)}
                />
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    required 
                    className={styles.inputField} 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required 
                    className={styles.inputField} 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="dogBreed" className={styles.dogBreedLabel}>Select Your Favorite Dog Breed</label>
                <select 
                    id="dogBreed" 
                    name="dogBreed" 
                    className={styles.inputField}
                    value={dogBreed} 
                    onChange={(e) => setDogBreed(e.target.value)}
                >
                    <option value="">--Select a breed--</option>
                    {breeds.map((breed, index) => (
                        <option key={index} value={breed.value}>{breed.label}</option>
                    ))}
                </select>
                <button 
                    type="button" 
                    className={styles.button} 
                    onClick={registerUser}
                >
                    Register
                </button>
                <button 
                    type="button" 
                    className={styles.button} 
                    onClick={() => router.push('/')}
                >
                    Back
                </button>
            </form>
        </div>
    );
}