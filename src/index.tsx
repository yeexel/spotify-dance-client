import React from "react";
import ReactDOM from "react-dom";
import Index from "./components/Index";
import Account from "./components/Account";
import Playlists from "./components/Playlists";
import PlaylistView from "./components/PlaylistView";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./infrastructure/AuthContext";
import { ProtectedRoute } from "./infrastructure/ProtectedRoute";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faSignOutAlt, faHeadphones, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faBars, faSignOutAlt, faHeadphones, faUser, faTimes);

const SpotifyDance = () => (
  <Router>
    <AuthProvider>
      <Index>
        <ProtectedRoute exact path="/" component={Playlists} />
        <ProtectedRoute exact path="/playlist/:id" component={PlaylistView} />
        <ProtectedRoute exact path="/account" component={Account} />
      </Index>
    </AuthProvider>
  </Router>
);

ReactDOM.render(<SpotifyDance />, document.getElementById("root"));

serviceWorker.unregister();
