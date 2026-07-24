// import "@appwrite.io/pink-icons";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import { AuthLayout, Login } from "./components";
import Signup from "./pages/Signup.jsx";
import Teachers from "./pages/Teacher.jsx"
import Profile from "./pages/Profile.jsx";
import { account } from "./lib/appwrite";
import TeacherDashboard  from "./pages/TeacherDashboard.jsx"
import TeacherProfile  from "./pages/TeacherProfile.jsx"
import  TeacherResources  from "./pages/TeacherResources.jsx"
import AddResource from "./pages/AddResource.jsx"
import EditResource from "./pages/EditResource.jsx";
import ExploreResources from "./pages/ExploreResources";
import NotFound from "./pages/NotFound.jsx";
import Bookmarks from "./pages/Bookmarks.jsx";
import StudentOnly from "./components/StudentOnly.jsx";
import TeacherOnly from "./components/TeacherOnly.jsx";



const router = createBrowserRouter([
  
  {
    path: "/",
    element: <App />,    
    children: [
    { path: "/", element: <Home /> },
    
    { path: "/profile", element: <AuthLayout><TeacherOnly><Profile /></TeacherOnly></AuthLayout> },
      { path: "/teachers", element: <AuthLayout loginPath="/student/login"><Teachers /></AuthLayout> },
      {
  path: "/dashboard",
  element: <AuthLayout><TeacherOnly><TeacherDashboard /></TeacherOnly></AuthLayout>,
},
{path: "*", element:<NotFound/>},
{path:"/explore/:type", element:<AuthLayout loginPath="/student/login"><ExploreResources /></AuthLayout>},
{
  path: "/resources/:type",
  element: <AuthLayout><TeacherOnly><TeacherResources /></TeacherOnly></AuthLayout>,
},
{
  path: "/add/:type",
  element: <AuthLayout><TeacherOnly><AddResource /></TeacherOnly></AuthLayout>,
},
{
  path: "/teacher/:userId",
  element: <AuthLayout loginPath="/student/login"><TeacherProfile /></AuthLayout>,
},
{
  path: "/edit/:id/:type",
  element: <AuthLayout><TeacherOnly><EditResource /></TeacherOnly></AuthLayout>,
},
{
  path: "/bookmarks",
  element: <AuthLayout><StudentOnly><Bookmarks /></StudentOnly></AuthLayout>,
},

      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/student/login",
        element: (
          <AuthLayout authentication={false}>
            <Login studentOnly />
          </AuthLayout>
        ),
      },
      {
        path: "/student/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup studentOnly />
          </AuthLayout>
        ),
      },
      
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
     <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
);
