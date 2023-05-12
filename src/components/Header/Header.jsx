import React, { useEffect, useState, useRef } from 'react'
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { UserContext } from '../../UserContext';
import { signOut } from "firebase/auth"
import { auth } from '../../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { SiLinktree } from 'react-icons/si';
import { BiImages } from 'react-icons/bi';
import "./Header.css"

const Header = () => {
    const { userInfo = {}, setUserInfo } = useContext(UserContext)
    const [open, setOpen] = useState(false);
    const location = useLocation();

    let menuRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);


        return () => {
            document.removeEventListener("mousedown", handler);
        }

    });
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
            console.log();
        }).catch((error) => {
            // An error happened.
        });
        setUserInfo(null)
    }

    function handleProfileClick() {

        window.location.href = `/profile/${userInfo.username}`; // programatik olarak yönlendirme yapmak için

    }
    function DropdownItem(props) {
        return (
            <p className='dropdownItem'>
                <p> {props.text} </p>
            </p >
        );
    }
    return (
        <header>
            <nav>

                {userInfo ? (
                    <div className='menu-container bg-white' ref={menuRef}>
                        <div className='menu-trigger'>
                            <Link to='/'>

                                <span className="logo"><SiLinktree />
                                </span>
                            </Link>



                        </div>
                        <div className='flex justify-center items-center text-sm font-mono font-semibold md:text-3xl md:font-bold border-2 border-solid rounded-full bg-gradient-to-r from-transparent to-gray-300 p-2'>
                            <Link to='/'>
                                <span ><h1>LinkStack</h1></span>
                            </Link>
                        </div>

                        <div className='menu-trigger' onClick={() => { setOpen(!open) }}>
                            <span>{userInfo && userInfo.username ? userInfo.username.charAt(0).toUpperCase() : null} </span>
                        </div>
                        <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} >

                            <h3>{userInfo.username}</h3>

                            <Link className='nav-profile' onClick={handleProfileClick}>
                                <div className='dropdownItem'>
                                    <p> Profile </p>
                                </div >
                            </Link>

                            <Link className='nav-log-out' to='/login' onClick={logout} >
                                <div className='dropdownItem'>
                                    <p> Log Out </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className='flex items-center justify-between md:mx-20 bg-emerald-700 rounded-full'>

                        <Link to='/'>
                            <div className='menu-trigger'>
                                <span className="logo float-left drop-shadow-2xl"><SiLinktree /></span>
                            </div>
                        </Link>

                        <div className='flex justify-center items-center text-md font-mono font-semibold md:text-3xl md:font-bold '>
                            <Link to='/'>
                                <span><h1>LinkStack</h1></span>
                            </Link>
                        </div>

                        {location.pathname === '/register' ? (

                            <Link className='bg-red-200 rounded-full p-5 w-38 font-semibold text-sm font-sans md:text-bold md:font-extrabold' to='/login'>
                                Sign In
                            </Link>
                        ) : (
                            
                            <Link className='bg-red-200 rounded-full p-5 w-38 font-semibold text-md font-sans md:text-lg md:font-bold' to='/register'>
                                Sign Up
                            </Link>
                        )}
                    </div>
                )}
            </nav>
        </header>

    )
}

export default Header
