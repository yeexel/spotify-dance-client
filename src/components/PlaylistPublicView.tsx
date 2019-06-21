import * as React from "react";
import { getPlaylistFromLink } from "../infrastructure/api";
import PlaylistView from "./PlaylistView";
import { Helmet } from "react-helmet";

class PlaylistPublicView extends React.Component {
  state = {
    playlist: null
  };

  componentDidMount() {
    this._fetchPlaylistFromLink();
  }

  async _fetchPlaylistFromLink() {
    const {
      // @ts-ignore
      match: {
        params: { publicLinkId }
      }
    } = this.props;

    const data = await getPlaylistFromLink(publicLinkId);

    if (data.error) {
      // toast(data.msg);
    }

    this.setState({ playlist: data });
  }

  render() {
    const p: any = this.state.playlist;

    if (!this.state.playlist) {
      return null;
    }

    // @ts-ignore
    if (this.state.playlist && this.state.playlist.error) {
      return null;
    }

    const View = (
      // @ts-ignore
      <PlaylistView isShareMode={true} playlist={this.state.playlist} />
    );

    return (
      <React.Fragment>
        <Helmet>
          <title>{p.name} | Playlista</title>
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content={`Listen to my playlist "${p.name}"`}
          />
          <meta property="og:description" content={p.description} />
          <meta property="og:image" content={p.cover_image} />
        </Helmet>
        {View}
      </React.Fragment>
    );
  }
}

export default PlaylistPublicView;
