import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { User, emptyUser } from "./classes/User";
import LoggedOut from "./pages/LoggedOut";

interface UserProviderProps {
  user: User;
  setUser: Function;
}

export const UserContext = React.createContext<UserProviderProps>({ user: emptyUser, setUser: () => { } });

const App = () => {
  const storedUser = localStorage.getItem("user");
  let defaultUser = emptyUser;
  if (storedUser) {
    defaultUser = JSON.parse(storedUser);
  }
  const [user, setUser] = React.useState<User>(defaultUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={!user.email ? <Login /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user.email ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user.email ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/logout" element={<LoggedOut />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};
export default App;
