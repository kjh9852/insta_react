import { useContext } from 'react';
import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom';
import Auth from './components/Auth';
import AuthContext from './store/auth-context';
import Media from './components/Media';
import Detail from './components/Detail';
import RootLayout from './routes/RootLayout';
import FeedList from './components/FeedList';
import Home from './components/Home';
import SelectLayout from './routes/SelectLayout';

const basename = process.env.PUBLIC_URL;

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout/>,
    children: [
      {
        index: true, element: <Auth login="Login"/>,
      },
      {
        element: <SelectLayout/>,
        children: [
          {
            path: 'home',
            element: <Home />
          },
          {
            path: 'feeds',
            element: <Media/>
          }
        ]
      },
      {
        path:':yearList',
        id: "yearData",
        element: <FeedList/>
      },
      {
        path:'feeds/:feedId',
        element: <Detail/>
      }
    ]
  },
])

function App() {
  const authCtx = useContext(AuthContext);
  
  return (
    <RouterProvider router={router} />
    // <>
    //   {!authCtx.token && <Auth login="LOGIN"/> }
    //   {authCtx.id && !authCtx.detail && <Media />}
    //   {authCtx.id && authCtx.detail && <Detail />}
    // </>
  );
}

export default App;