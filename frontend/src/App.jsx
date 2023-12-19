import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet, BrowserRouter } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';

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
        element: <>hi</>
      },
      {
        path: '/spots/:spotId',
        element: <>hi</>
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
        element: <>hi</>
      }
    ]
  }
]);

function App() {
  return(
  <>
  <BrowserRouter>
    <Navigation/>
  </BrowserRouter>
  <RouterProvider router={router} />;
  </>

  )
}

export default App;
