import React from "react";
import ReactDOM from "react-dom";
import Index from "./components/Index";
import Account from "./components/Account";
import Playlists from "./components/Playlists";
import PlaylistView from "./components/PlaylistView";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "./infrastructure/AuthContext";
import { ProtectedRoute } from "./infrastructure/ProtectedRoute";
import PlaylistPublicView from "./components/PlaylistPublicView";
import About from "./components/About";
import Landing from "./components/Landing";

import { toast } from "react-toastify";

toast.configure({
  autoClose: 3000,
  draggable: false,
  position: "bottom-center"
});

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faSignOutAlt,
  faHeadphones,
  faUser,
  faTimes,
  faAngleUp,
  faAngleDown,
  faShareSquare,
  faMusic
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faBars,
  faSignOutAlt,
  faHeadphones,
  faUser,
  faTimes,
  faAngleUp,
  faAngleDown,
  faShareSquare,
  faMusic
);

const SpotifyDance = () => (
  <Router>
    <AuthProvider>
      <Index>
        <Route exact path="/" component={Landing} />
        <ProtectedRoute exact path="/playlists" component={Playlists} />
        <ProtectedRoute exact path="/playlist/:id" component={PlaylistView} />
        <ProtectedRoute exact path="/account" component={Account} />
        <Route exact path="/s/:publicLinkId" component={PlaylistPublicView} />
        <Route exact path="/about" component={About} />
      </Index>
    </AuthProvider>
  </Router>
);

ReactDOM.render(<SpotifyDance />, document.getElementById("root"));

serviceWorker.unregister();
