import React, { useState } from 'react'
import { auth } from "../firebase";
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from "firebase/firestore";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const postsCollectionRef = collection(db, "username");

    const createNewUsername = async () => {
        await addDoc(postsCollectionRef, {
            username: username,
        });

    };
    const register = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                navigate("/");
                createNewUsername()
                // Eklenen kod
                updateProfile(auth.currentUser, {
                    displayName: username,
                }).then(() => {
                    console.log("Display name added successfully!");
                }).catch((error) => {
                    console.log(error);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };



    return (

        <form className='register' onSubmit={register}>
            <h1>Register</h1>
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
            <button>Register</button>
        </form>
    )
}

export default RegisterPage