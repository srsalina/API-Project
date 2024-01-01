import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate()

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    // if (!showMenu) setShowMenu(true);
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate('/')
  };

  const ulClassName = "dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <ul>
        <button onClick={toggleMenu} className='menu'>
          <i className="fa-solid fa-bars"></i>
          <i className="fa-regular fa-user"></i>
        </button>
        <ul className={ulClassName} ref={ulRef}>
          <ul className='text'><>Hello, {user.username}</></ul>
          <ul className='textEm'>{user.email}</ul>
          <ul className='manageSpots'> <NavLink to='/spots/current' onClick={toggleMenu} className='manageNav'>Manage Spots</NavLink></ul>
          <ul className='loButton'>
            <button onClick={logout} className='logoutButton'>Log Out</button>
          </ul>
        </ul>
      </ul>
    </>
  );
}

export default ProfileButton;
