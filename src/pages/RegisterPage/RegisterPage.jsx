import React, { useState } from 'react';
import "./Register.css";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const usersCollectionRef = collection(db, "users");

    const createNewUsername = async (userId) => {
        // Check if username already exists in the Firestore database
        const q = query(usersCollectionRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return;
        }

        // Add new document to Firestore with user's UID and username
        await addDoc(usersCollectionRef, {
            uid: userId,
            username: username
        });
    };

    const register = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Add username and UID to Firestore
                createNewUsername(userCredential.user.uid);
                // Update user's display name in Firebase Authentication
                updateProfile(userCredential.user, {
                    displayName: username,
                }).then(() => {
                    console.log("Display name added successfully!");
                }).catch((error) => {
                    console.log(error);
                });

                navigate("/");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <form className='form' onSubmit={register}>

            <div className='form-container'>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                <input type="email"
                    placeholder='Email'
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                />
                <input type="password"
                    placeholder='Password'
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                />
            </div>
            <button>Register</button>
        </form>
    )
}

export default RegisterPage;
