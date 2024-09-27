import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Account() {
    const [currentUser, setCurrentUser] = useState(null);
    const [breeds, setBreeds] = useState([]);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newDogBreed, setNewDogBreed] = useState("");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (storedUser && storedUser.firstname) {
            setCurrentUser(storedUser);
        } else {
            setCurrentUser({ firstname: 'Guest' });
        }
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

    const handleSaveChanges = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));

        if (storedUser) {
            if (newUsername) {
                const usernameExists = users.some(user => user.username === newUsername && user.username !== storedUser.username);
                if (usernameExists) {
                    alert("This username is already taken. Please use another username and try again.");
                    return;
                }
                storedUser.username = newUsername;
            }
            if (newPassword) {
                storedUser.password = newPassword;
            }
            if (newDogBreed) {
                storedUser.dogBreed = newDogBreed;
            }

            const userIndex = users.findIndex(user => user.username === storedUser.username);
            if (userIndex !== -1) {
                users[userIndex] = storedUser;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(storedUser));
                alert("User information updated successfully!");
            } else {
                alert("Error: User not found");
            }
        } else {
            alert("Error saving your account settings, please try again.");
        }
        window.location.href='/';
    };

    return (
        <div>
            <h1>Daily Digest Brought to You by Steve</h1>
            <form id="accountForm">
                <h2>Howdy, {currentUser?.firstname || 'Guest'}!</h2>
                <input 
                    type="text" 
                    id="inputField" 
                    name="username"  
                    placeholder="New Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
                <input 
                    type="password" 
                    id="inputField" 
                    name="password" 
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <select 
                    id="inputField" 
                    name="dogBreed"
                    value={newDogBreed}
                    onChange={(e) => setNewDogBreed(e.target.value)}
                >
                    <option value="">Dog Breed</option>
                    {breeds.map((breed, index) => (
                        <option key={index} value={breed.value}>{breed.label}</option>
                    ))}
                </select>
                <button 
                    type="button" 
                    id="button" 
                    onClick={handleSaveChanges}
                >
                    Save Changes
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