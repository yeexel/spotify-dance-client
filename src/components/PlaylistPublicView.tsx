import * as React from "react";
import { getPlaylistFromLink } from "../infrastructure/api";
import { toast } from "react-toastify";

class PlaylistPublicView extends React.Component {
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
  }

  render() {
    return null;
  }
}

export default PlaylistPublicView;
