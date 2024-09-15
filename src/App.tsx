import React, { useEffect } from "react";
import { useAuth } from "./Context/AuthContext";
import Login from "./Login/Login2";
import Home from "./Home/Home";

const App = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log(user);
  }, [user]);
  return !user ? <Login /> : <Home />;
};

export default App;
