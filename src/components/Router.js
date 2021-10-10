import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
        {isLoggedIn && <Navigation userObj={userObj} />}
        <Switch>
          <>
            {isLoggedIn ? (
              <div
                style={{
                  maxWidth: 890,
                  width: "100%",
                  margin: "0 auto",
                  marginTop: 80,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Route exact path="/">
                  <Home userObj={userObj} />
                </Route>
                <Route exact path="/profile">
                  <Profile refreshUser={refreshUser} userObj={userObj} />
                </Route>
              </div>
            ) : (
              <>
                <Route exact path="/">
                  <Auth />
                </Route>
              </>
            )}
          </>
        </Switch>
      </Router>
    </>
  );
};

export default AppRouter;
