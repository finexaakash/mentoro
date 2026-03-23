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
// import AddPost from "./pages/AddPost";
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

// import EditPost from "./pages/EditPost";
// import Post from "./pages/Post";
// import AllPosts from "./pages/AllPosts";
// import Profile from "./pages/Profile";

account.get().catch(() => {
  console.log("No active session");
});
const router = createBrowserRouter([
  
  {
    path: "/",
    element: <App />,    
    children: [
    { path: "/", element: <Home /> },
    // { path:"/profile", element:(
    // <Profile />)
    // },
    { path: "/profile", element: <Profile /> },
      { path: "/teachers", element: <Teachers /> },
      {
  path: "/dashboard",
  element: <TeacherDashboard />,
},
{path: "*", element:<NotFound/>},
{path:"/explore/:type", element:<ExploreResources />},
{
  path: "/resources/:type",
  element: <TeacherResources />,
},
{
  path: "/add/:type",
  element: <AddResource />,
},
{
  path: "/teacher/:userId",
  element: <TeacherProfile />,
},
{
  path: "/edit/:id/:type",
  element: <EditResource />,
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
      // {
      //   path: "/all-posts",
      //   element: (
      //     <AuthLayout authentication>
      //       <AllPosts />
      //     </AuthLayout>
      //   ),
      // },
      // {
      //   path: "/add-post",
      //   element: (
      //     <AuthLayout authentication>
      //       <AddPost />
      //     </AuthLayout>
      //   ),
      // },
      // {
      //   path: "/edit-post/:slug",
      //   element: (
      //     <AuthLayout authentication>
      //       <EditPost />
      //     </AuthLayout>
      //   ),
      // },
      // { path: "/post/:slug", element: <Post /> },
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