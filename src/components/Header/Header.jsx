import React, { useEffect, useState, useRef } from 'react'
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { UserContext } from '../../UserContext';
import { signOut } from "firebase/auth"
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { SiLinktree } from 'react-icons/si';
import { BiImages } from 'react-icons/bi';
import "./Header.css"

const Header = () => {
    const { userInfo = {}, setUserInfo } = useContext(UserContext)
    const [open, setOpen] = useState(false);

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
            navigate("/link-stack/login")
            console.log();
        }).catch((error) => {
            // An error happened.
        });
        setUserInfo(null)
    }

    function handleProfileClick() {

        window.location.href = `/link-stack/profile/${userInfo.username}`; // programatik olarak yönlendirme yapmak için

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
                            <Link to='/link-stack'>

                                <span className="logo"><SiLinktree />
                                </span>
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
                    <div className='nav-right'>
                        <Link to='/link-stack'>
                            <div className='menu-trigger'>
                                <span className="logo"><SiLinktree />
                                </span>
                            </div>
                        </Link>
                        <div className="form-route">
                            <Link to='/link-stack/login'>Login</Link>
                            <Link to='/link-stack/register'>Register</Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>

    )
}

export default Header
