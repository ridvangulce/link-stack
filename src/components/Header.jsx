import React, { useEffect, useParams } from 'react'
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext';
import { signOut } from "firebase/auth"
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { userInfo, setUserInfo } = useContext(UserContext)
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUserInfo({ username: user.displayName });
            } else {
                setUserInfo(null);
            }
        });
        return unsubscribe;
    }, [userInfo]);

    function logout() {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/login")
        }).catch((error) => {
            // An error happened.
        });
        setUserInfo(null)
    }

    function handleProfileClick() {
        window.location.href = `/profile/${userInfo.username}`; // programatik olarak yönlendirme yapmak için
    }

    return (
        <header>
            <nav>
                {userInfo ? (
                    <>
                        <Link to='/' className='logo'>{userInfo.username}</Link>
                        <Link to="/login" onClick={logout}>Logout</Link>
                        <Link onClick={handleProfileClick}>Profile</Link>
                    </>
                ) : (
                    <>
                        <Link to='/' className='logo'>Linktree</Link>
                        <Link to='/login'>Login</Link>
                        <Link to='/register'>Register</Link>
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header
