
import './index.css';

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
const Selector = () => {

  const [open, setOpen] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
        console.log(menuRef.current);
      }
    };

    document.addEventListener("mousedown", handler);


    return () => {
      document.removeEventListener("mousedown", handler);
    }

  });

  function DropdownItem(props) {
    return (
      <li className='dropdownItem'>
        <img src={props.img}></img>
        <p> {props.text} </p>
      </li>
    );
  }
  return (
    <div className="App">
      <div className='menu-container' ref={menuRef}>
        <div className='menu-trigger' onClick={() => { setOpen(!open) }}>
          <p>Rıdvan</p>
        </div>
        <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} >
          <h3>The Kiet<br /><span>Website Designer</span></h3>
          <ul>
            <Link className='nav-profile' to='/asd'>
              <DropdownItem text={"My Profile"} />
            </Link>

          </ul>
        </div>
      </div>
    </div>
  );
}


export default Selector;
