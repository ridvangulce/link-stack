import React, { useState, useEffect } from 'react'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential, userInfo) => {
                console.log(userCredential);
                setUserInfo(userInfo);
                navigate("/");
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                navigate("/");
            }
        });
        return unsubscribe;
    }, []);

    return (
        <form className='login' onSubmit={login}>
            <h1>Login</h1>
  

            <input type="email"
                placeholder='Email'
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input type="password"
                placeholder='Password'
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button>Login</button>
        </form>
    )
}

export default LoginPage;
