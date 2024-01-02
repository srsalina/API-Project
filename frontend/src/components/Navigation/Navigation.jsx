import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import '../OpenModalButton/OpenModalButton.css'
import { useEffect, useRef, useState } from 'react';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);




  const [showMenu, setShowMenu] = useState(false);




  const ref = useRef()




  const activeMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu)
  }


  useEffect(() => {
    if (!showMenu) return


    const closeMenu = (e) => {
      if (!ref.current.contains(e.target)) {
        setShowMenu(false)
      }
    }


    document.addEventListener('click', closeMenu)


    return function () {
      document.removeEventListener('click', closeMenu)
    }


  }, [showMenu])


  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");




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




        <ul className={ulClassName} ref={ref}>
          <div className='buttonContainer'>
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
      <>
        <NavLink to="/" className='toHome'>
          SeaBnB
        </NavLink>
      </>


      <div className='spotmenublob'>


        {isLoaded && sessionLinks}
      </div>


    </ul>
  );
}


export default Navigation
