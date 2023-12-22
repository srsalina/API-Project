import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet, BrowserRouter } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import HomePage from './components/Home/HomePage';
import SpotDetails from './components/SpotDetails/SpotDetails';
import ManageSpots from './components/ManageSpots/ManageSpots';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage/>
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails/>
      },
      {
        path: '/spots/new',
        element: <>hi</>
      },
      {
        path: '/spots/:spotId/edit',
        element: <>hi</>
      },
      {
        path: '/spots/current',
        element: <ManageSpots/>
      }
    ]
  }
]);

function App() {
  return(
  <>
  <BrowserRouter>
    {/* <Navigation/> */}
  </BrowserRouter>
  <RouterProvider router={router} />;
  </>

  )
}

export default App;
