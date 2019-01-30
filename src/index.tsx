import React from "react";
import ReactDOM from "react-dom";
import Index from "./components/Index";
import Account from "./components/Account";
import * as serviceWorker from "./serviceWorker";
import { AuthProvider } from "./infrastructure/AuthContext";
import { ProtectedRoute } from "./infrastructure/ProtectedRoute";
import { BrowserRouter as Router, Route } from "react-router-dom";

const SpotifyDance = () => (
  <Router>
    <AuthProvider>
      <Route exact path="/" component={Index} />
      <ProtectedRoute exact path="/account" component={Account} />
    </AuthProvider>
  </Router>
);

ReactDOM.render(<SpotifyDance />, document.getElementById("root"));

serviceWorker.unregister();
