import React from "react";
import ReactDOM from "react-dom";
import Index from "./components/Index";
import Account from "./components/Account";
import Playlists from "./components/Playlists";
import * as serviceWorker from "./serviceWorker";
import { AuthProvider } from "./infrastructure/AuthContext";
import { ProtectedRoute } from "./infrastructure/ProtectedRoute";
import { BrowserRouter as Router, Route } from "react-router-dom";

const SpotifyDance = () => (
  <Router>
    <AuthProvider>
      <Index>
        <ProtectedRoute exact path="/" component={Playlists} />
        <ProtectedRoute exact path="/account" component={Account} />
      </Index>
    </AuthProvider>
  </Router>
);

ReactDOM.render(<SpotifyDance />, document.getElementById("root"));

serviceWorker.unregister();
