import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import { useEffect, useRef, useState } from 'react';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);


  const [showMenu, setShowMenu] = useState(false);


  const ref = useRef()


  function activeMenu(e) {
    e.stopPropagation();
    setShowMenu(!showMenu)
  }

  useEffect(() => {
    if (!showMenu) return

    function closeMenu(e) {
      if (ref.current.contains(e.target)) {
        setShowMenu(true)
      }
    }

    document.addEventListener('click', closeMenu)

    return function () {
      document.removeEventListener('click', closeMenu)
    }

  }, [showMenu])

  let listClassName = "drop" + (showMenu ? '' : 'hidden')


  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <NavLink to='/spots/new' className='createSpot'>
          Create A Spot
        </NavLink>
        <ProfileButton user={sessionUser} />
      </>
    );
  } else {
    sessionLinks = (

      <ul>

        <button onClick={activeMenu} className='menu'>
          <i className="fa-solid fa-bars"></i>
          <i className="fa-regular fa-user"></i>
        </button>


        <ul className={listClassName} ref={ref}>
          <div className='buttoncontainer'>
            <OpenModalButton
              buttonText="Log In"
              className='login'
              modalComponent={<LoginFormModal />}
            />

            <OpenModalButton
              buttonText="Sign Up"
              className='signup'
              modalComponent={<SignupFormModal />}
            />

          </div>
        </ul>

      </ul>

    );
  }

  return (
    <ul className='navBar'>
      <li>
        <NavLink to="/" className='home'>
          Home
        </NavLink>
      </li>
      <div className='spotmenublob'>

        {isLoaded && sessionLinks}
      </div>
    </ul>
  );
}

export default Navigation
