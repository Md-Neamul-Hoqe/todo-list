import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import EditTask from "../Pages/EditTask/EditTask";
import AddNewTask from "../Pages/AddNewTask/AddNewTask";
import History from "../Pages/History/History";
import Credentials from "../Pages/Credentials/Credentials";
import Login from "../Pages/Credentials/Login";
import Register from "../Pages/Credentials/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/manage-task/:id",
        element: <EditTask />,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/api/v1/single-task/${params?.id}`),
      },
      {
        path: "/add-new-task",
        element: <AddNewTask />,
      },
      {
        path: "/history",
        element: <History />,
      },
    ],
  },
  {
    path: "/credentials",
    element: <Credentials />,
    children: [
      {
        path: "sign-in",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
