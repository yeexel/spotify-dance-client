import * as React from "react";
import { getPlaylistFromLink } from "../infrastructure/api";
import { toast } from "react-toastify";
import PlaylistView from "./PlaylistView";

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
      toast(data.msg);
    }

    this.setState({ playlist: data });
  }

  render() {
    if (!this.state.playlist) {
      return null;
    }

    // @ts-ignore
    if (this.state.playlist && this.state.playlist.error) {
      return null;
    }

    // @ts-ignore
    return <PlaylistView isShareMode={true} playlist={this.state.playlist} />;
  }
}

export default PlaylistPublicView;
