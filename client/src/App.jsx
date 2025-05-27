import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Signup from "./auth/Signup";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
   {
    path: "/login",
    element: <Login />,
  },
     {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
