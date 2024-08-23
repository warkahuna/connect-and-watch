import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./navigation/routes";
import PrivateRoute from "./navigation/PrivateRoute";
import { Provider } from "react-redux";
import store from "./store/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {routes.map((route, index) =>
            route.private ? (
              <Route
                key={index}
                path={route.path}
                element={<PrivateRoute component={route.component} />}
              />
            ) : (
              <Route
                key={index}
                path={route.path}
                element={<route.component />}
              />
            )
          )}
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
