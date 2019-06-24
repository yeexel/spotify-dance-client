import React, { Component } from "react";
import styled from "styled-components";
import { getPlaylist, createLink } from "../infrastructure/api";
import { withAuthContext } from "../infrastructure/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import posed from "react-pose";
import { tween } from "popmotion";
import Chart from "react-apexcharts";

interface Props {
  isShareMode?: boolean;
  authContext?: any;
  match?: any;
  playlist?: any;
}

interface State {
  playlist: object;
  isLoading: boolean;
  showDescription: boolean;
  gradient: any;
  valenceString: string;
}

function parseTime(millisec: number): object {
  // @ts-ignore
  const normalizeTime = (time: string): string =>
    time.length === 1 ? time.padStart(2, "0") : time;

  let seconds: string = (millisec / 1000).toFixed(0);
  let minutes: string = Math.floor(parseInt(seconds) / 60).toString();
  let hours: string = "";

  if (parseInt(minutes) > 59) {
    hours = normalizeTime(Math.floor(parseInt(minutes) / 60).toString());
    minutes = normalizeTime(
      (parseInt(minutes) - parseInt(hours) * 60).toString()
    );
  }
  seconds = normalizeTime(Math.floor(parseInt(seconds) % 60).toString());

  return {
    hours: +hours,
    minutes: +minutes,
    seconds: +seconds,
    ms: millisec
  };
}

class PlaylistView extends Component<Props, State> {
  state = {
    playlist: {},
    isLoading: true,
    showDescription: false,
    gradient: undefined,
    valenceString: ""
  };

  componentDidMount() {
    this._fetchPlaylist();
  }

  toggleDescription = () => {
    this.setState({ showDescription: !this.state.showDescription });
  };

  _fetchPlaylist = async () => {
    const { authContext, match, isShareMode, playlist } = this.props;

    const playlistData = isShareMode
      ? playlist
      : await getPlaylist(
          match ? match.params.id : null,
          authContext ? authContext.authToken : null
        );

    this.setState(
      {
        playlist: playlistData,
        isLoading: false,
        valenceString: getValenceString(playlistData.valence)
      },
      this._analyzeImageData
    );
  };

  _createLink = async () => {
    const { authContext } = this.props;

    const { playlist } = this.state;

    const linkData = await createLink(
      // @ts-ignore
      playlist.name,
      // @ts-ignore
      playlist.id,
      authContext.authToken
    );

    if (linkData.error) {
      // toast(linkData.msg);
    } else {
      alert(linkData.link);
    }
  };

  _analyzeImageData = async () => {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image

    // @ts-ignore
    const imageUrl = this.state.playlist.cover_image;

    let downloadedImg: any;

    downloadedImg = new Image(250, 250);
    downloadedImg.crossOrigin = "Anonymous";
    downloadedImg.addEventListener("load", imageReceived, false);
    downloadedImg.src = imageUrl;

    let self = this;

    function imageReceived() {
      let canvas: any = document.createElement("canvas");
      let context: any = canvas.getContext("2d");

      canvas.width = downloadedImg.width;
      canvas.height = downloadedImg.height;

      context.drawImage(downloadedImg, 0, 0);
      // document.body.appendChild(canvas);

      // console.log(context.getImageData(0, 0, 1, 1));
      let colorHash: any = {};

      for (let y = 0; y <= downloadedImg.height; y++) {
        for (let x = 0; x <= downloadedImg.width; x++) {
          const imgData = context.getImageData(x, y, 1, 1).data;
          // console.log(imgData);
          // let hashKey = `rgb(${imgData[0]}, ${imgData[1]}, ${imgData[2]}, ${imgData[3]})`;
          let hashKey = `${imgData[0]},${imgData[1]},${imgData[2]}`;
          // colorHash[hashKey] = 1;

          if (colorHash.hasOwnProperty(hashKey)) {
            colorHash[hashKey]++;
          } else {
            colorHash[hashKey] = 1;
          }
        }
      }

      var invert = function(obj: any) {
        var new_obj: any = {};

        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            new_obj[obj[prop]] = prop;
          }
        }

        return new_obj;
      };

      function rgbToHsl(c: any) {
        var r = c[0] / 255,
          g = c[1] / 255,
          b = c[2] / 255;
        var max = Math.max(r, g, b),
          min = Math.min(r, g, b);
        var h: any,
          s,
          l = (max + min) / 2;

        if (max == min) {
          h = s = 0; // achromatic
        } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }
        return new Array(h * 360, s * 100, l * 100);
      }

      const colorHashInverted = invert(colorHash);
      const colorHashInvertedKeys = Object.keys(colorHashInverted)
        .map(i => +i)
        .sort((a, b) => (a > b ? 1 : -1));

      const mostCommonRGBs = colorHashInvertedKeys.map(i =>
        colorHashInverted[i].split(",").map((it: any) => +it)
      );

      var sortedRgbArr = mostCommonRGBs
        .map(function(c, i) {
          // Convert to HSL and keep track of original indices
          return { color: rgbToHsl(c), index: i };
        })
        .sort(function(c1, c2) {
          // Sort by hue
          return c1.color[0] - c2.color[0];
        })
        .map(function(data) {
          // Retrieve original RGB color
          return mostCommonRGBs[data.index];
        });

      self.setState({
        // sorted by HSL
        gradient: sortedRgbArr.map(
          (rgb: any) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
        )
        // gradient: mostCommonRGBs.map((rgb: any) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`)
      });
    }
  };

  render() {
    const { playlist, isLoading, showDescription, valenceString } = this.state;

    const { isShareMode } = this.props;

    // if (isLoading) {
    //   return null;
    // }

    const currentPlaylist: any = playlist;

    const hasMoreThan100Tracks = currentPlaylist.tracks > 100;

    const parsedTime: any = parseTime(currentPlaylist.duration_ms);

    let playTimeHours = null;
    let playTimeMinutes = null;

    if (parsedTime.hours > 0) {
      playTimeHours = (
        <React.Fragment>
          <PlaylistInfoLineSubject>{parsedTime.hours}</PlaylistInfoLineSubject>{" "}
          {`${parsedTime.hours === 1 ? "hour" : "hours"}`} and
        </React.Fragment>
      );
    }

    playTimeMinutes = (
      <React.Fragment>
        <PlaylistInfoLineSubject>{parsedTime.minutes}</PlaylistInfoLineSubject>{" "}
        {`${parsedTime.minutes === 1 ? "minute" : "minutes"}`}
      </React.Fragment>
    );

    return (
      <Container>
        <LeftSection pose={isLoading ? "closed" : "open"}>
          <CoverImageContainer>
            <CoverImage src={currentPlaylist.cover_image} />
            <ColorImageColorFingerprint gradient={this.state.gradient || []} />
          </CoverImageContainer>
          <PlaylistName>{currentPlaylist.name}</PlaylistName>
          {currentPlaylist.description && (
            <React.Fragment>
              <DescriptionToggle onClick={this.toggleDescription}>
                {`${showDescription ? "Hide" : "Show"}`} description{" "}
                <FontAwesomeIcon
                  style={{ verticalAlign: "middle", marginBottom: "2px" }}
                  icon={showDescription ? "angle-up" : "angle-down"}
                />
              </DescriptionToggle>
              <PlaylistDescription
                show={showDescription}
                dangerouslySetInnerHTML={{
                  __html: currentPlaylist.description
                }}
              />
            </React.Fragment>
          )}
          <BtnWrapper>
            <ListenOnSpotifyBtn href={currentPlaylist.uri}>
              <FontAwesomeIcon icon="music" /> Play on Spotify
            </ListenOnSpotifyBtn>
            {!isShareMode ? (
              <AnalyzeBtn
                onClick={this._createLink}
                show={!hasMoreThan100Tracks}
              >
                <FontAwesomeIcon icon="share-square" /> Share playlist
              </AnalyzeBtn>
            ) : null}
          </BtnWrapper>
        </LeftSection>
        {!hasMoreThan100Tracks ? (
          <RightMostSection pose={isLoading ? "closed" : "open"}>
            <Chart
              series={[
                currentPlaylist.danceability || 0,
                currentPlaylist.energy || 0,
                currentPlaylist.valence || 0
              ]}
              width={350}
              height={350}
              options={{
                labels: ["Danceability", "Energy", "Positiveness"],
                plotOptions: {
                  radialBar: {
                    offsetY: -30,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                      margin: 5,
                      size: "30%",
                      background: "transparent",
                      image: undefined
                    },
                    dataLabels: {
                      name: {
                        show: false
                        // fontSize: '22px',
                      },
                      value: {
                        show: false
                        // fontSize: '16px',
                      }
                      //   total: {
                      //     show: true,
                      //     label: 'Hover on ring',
                      //     formatter: function (w: any) {
                      //         // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                      //         return "to see more"
                      //     }
                      // }
                    }
                  }
                },
                colors: ["#4e007d", "#3a4688", "#182c2f"],
                legend: {
                  show: true,
                  floating: true,
                  fontSize: "16px",
                  fontFamily: "KoHo",
                  position: "right",
                  offsetX: 140,
                  offsetY: 35,
                  labels: {
                    useSeriesColors: true
                  },
                  markers: {
                    size: 0
                  },
                  formatter: function(seriesName: any, opts: any) {
                    return (
                      seriesName +
                      ":  " +
                      opts.w.globals.series[opts.seriesIndex] +
                      "%"
                    );
                  },
                  itemMargin: {
                    horizontal: 1
                  }
                }
              }}
              type="radialBar"
            />
          </RightMostSection>
        ) : null}
        <RightSection
          moreTracks={hasMoreThan100Tracks}
          pose={isLoading ? "closed" : "open"}
        >
          {hasMoreThan100Tracks ? <Separator /> : null}
          <PlaylistInfoLine show={true}>This playlist has</PlaylistInfoLine>
          <PlaylistInfoLine show={true}>
            <PlaylistInfoLineSubject>{`${
              currentPlaylist.tracks
            }`}</PlaylistInfoLineSubject>{" "}
            {`${currentPlaylist.tracks == 1 ? "track" : "tracks"}`} and{" "}
            <PlaylistInfoLineSubject>{`${
              currentPlaylist.followers
            }`}</PlaylistInfoLineSubject>{" "}
            {`${currentPlaylist.followers == 1 ? "follower" : "followers"}`}.
          </PlaylistInfoLine>
          {!hasMoreThan100Tracks && <TitleSectionSeparator />}
          <React.Fragment>
            {!hasMoreThan100Tracks ? (
              <PlaylistInfoLine show={true}>
                Play time is {playTimeHours} {playTimeMinutes}.
              </PlaylistInfoLine>
            ) : null}
          </React.Fragment>
          {!hasMoreThan100Tracks && <TitleSectionSeparator />}
          <React.Fragment>
            {!hasMoreThan100Tracks && currentPlaylist.danceability ? (
              <PlaylistInfoLine show={true}>
                <PlaylistInfoLineSubject>
                  {getDanceabilityString(currentPlaylist.danceability)}
                </PlaylistInfoLineSubject>{" "}
                danceability.
              </PlaylistInfoLine>
            ) : null}
          </React.Fragment>
          <React.Fragment>
            {!hasMoreThan100Tracks && currentPlaylist.valence ? (
              <PlaylistInfoLine show={true}>
                Sounds{" "}
                <PlaylistInfoLineSubject>
                  {valenceString}.
                </PlaylistInfoLineSubject>
              </PlaylistInfoLine>
            ) : null}
          </React.Fragment>
          <React.Fragment>
            {!hasMoreThan100Tracks && currentPlaylist.tempo ? (
              <PlaylistInfoLine show={true}>
                Number of beats per minute is{" "}
                <PlaylistInfoLineSubject>
                  {currentPlaylist.tempo}.
                </PlaylistInfoLineSubject>
              </PlaylistInfoLine>
            ) : null}
          </React.Fragment>
          {!hasMoreThan100Tracks && <TitleSectionSeparator />}
          {hasMoreThan100Tracks && (
            <HasMoreTracks>
              Insights are not available for playlists with more than 100
              tracks.
            </HasMoreTracks>
          )}
          <PlaylistInfoLine show={true}>
            Created by{" "}
            <PlaylistInfoLineSubject>
              {`${currentPlaylist.owner}`}.
            </PlaylistInfoLineSubject>
          </PlaylistInfoLine>
        </RightSection>
      </Container>
    );
  }
}

export default withAuthContext(PlaylistView);

const getDanceabilityString = (value: number) => {
  let str = "";

  if (value >= 65) {
    str = "High";
  }

  if (value >= 51 && value <= 64) {
    str = "Moderate";
  }

  if (value <= 50) {
    str = "Low";
  }

  return str;
};

const getValenceString = (value: number) => {
  let str = "";

  if (value >= 31) {
    str = ["happy", "cheerful", "upbeat", "joyful", "euphoric"][
      Math.floor(Math.random() * 5)
    ];
  }

  if (value <= 30) {
    str = ["sad", "depressed", "angry", "grumpy", "tearful"][
      Math.floor(Math.random() * 5)
    ];
  }

  return str;
};

const Container = styled.div`
  margin-top: 150px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  a {
    color: #fff;
    text-decoration: none;
  }

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    margin-bottom: 30px;
  }
`;

const LeftSectionAnimated = posed.div({
  open: {
    opacity: 1,
    x: "0%",
    transition: (props: any) => tween({ ...props, duration: "650" })
  },
  closed: { opacity: 0, x: "-100%" }
});

const LeftSection = styled(LeftSectionAnimated)`
  // width: 20%;
  // background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;

  @media (max-width: 500px) {
    width: auto;
  }
`;

const CoverImageContainer = styled.div`
  width: 250px;
  height: 250px;
  display: flex;
  flex-direction: column;
`;

const CoverImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 5px;
  box-shadow: 0 8px 6px -6px black;
  transition: 0.5s ease;
  z-index: 1;
  border-radius: 5px;

  ${CoverImageContainer}:hover & {
    // transform: rotate(-3deg);
    // transform: translate(0, -10%);
    // margin: 0 0 0 -15px;
    cursor: pointer;
    transform: scale(0.25);
    box-shadow: none;
    border-radius: 50%;
  }

  // &:hover {
  //   opacity: .5;
  // }
`;

const PlaylistName = styled.span`
  align-self: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  max-width: 250px;
  color: #fff;

  @media (max-width: 500px) {
    max-width: auto;
  }

  ${CoverImageContainer}:hover & {
    display: none;
  }
`;

const DescriptionToggle = styled(PlaylistName)`
  font-size: 14px;
  color: #e3e3e3;
  // text-decoration: underline dashed;
  cursor: pointer;
`;

const PlaylistDescription = styled(PlaylistName)<{ show?: boolean }>`
  color: #e3e3e3;
  font-size: 16px;
  max-width: 250px;
  text-align: justify;

  display: ${props => (props.show ? "block" : "none")};
`;

const RightSectionAnimated = posed.div({
  open: {
    opacity: 1,
    x: "0%",
    transition: (props: any) => tween({ ...props, duration: "650" })
  },
  closed: { opacity: 0, x: "100%" }
});

const RightSection = styled(RightSectionAnimated)<{ moreTracks?: boolean }>`
  // width: 60%;
  display: flex;
  // background-color: #e3e3e3;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 350px;
  z-index: 1;

  @media (max-width: 500px) {
    width: auto;
    margin-top: ${props => (props.moreTracks ? "30px" : 0)};
    height: auto;
  }
`;

const RightMostSectionAnimated = posed.div({
  open: {
    opacity: 1,
    transition: (props: any) => tween({ ...props, duration: "500" })
  },
  closed: { opacity: 0 }
});

const RightMostSection = styled(RightMostSectionAnimated)`
  // width: 20%;
  align-items: center;
  flex-direction: column;
  // height: 350px;
  z-index: 1;
  margin-top: -10px;

  @media (max-width: 500px) {
    width: auto;
    margin-top: 30px;
    height: auto;
  }
`;

const PlaylistInfoLine = styled.span<{ show: boolean }>`
  align-self: center;
  color: #fff;
  font-size: 26px;
  display: ${props => (props.show ? "display" : "none")};

  @media (max-width: 500px) {
    font-size: 16px;
    margin-bottom: 5px;
  }
`;

const PlaylistInfoLineSubject = styled.span`
  font-weight: bold;
  font-size: 32px;

  @media (max-width: 500px) {
    font-size: 20px;
  }
`;

const Separator = styled.div`
  display: none;

  height: 1px;
  width: 100%;
  background-color: #e3e3e3;
  margin-bottom: 20px;

  @media (max-width: 500px) {
    display: block;
  }
`;

const TitleSectionSeparator = styled.div`
  height: 20px;
`;

const BtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 200px;

  @media (max-width: 500px) {
    width: 290px;
    flex-direction: row;
  }
`;

const HasMoreTracks = styled.div`
  height: 40px;
  padding: 10px;
  text-align: center;
  margin-top: 25px;
  color: #e3e3e3;

  @media (max-width: 500px) {
    margin-top: 0;
  }
`;

const ColorImageColorFingerprint = styled.div<{ gradient: any }>`
  width: 250px;
  height: 250px;
  // margin-top: 5px;
  position: absolute;
  // padding: 5px;
  z-index: 0;
  // filter: blur(2px);
  border-radius: 50%;
  background-image: radial-gradient(${props => props.gradient.join(",")});
  transition: 1s ease;
  opacity: 0;

  ${CoverImageContainer}:hover & {
    // margin: 0 0 0 50px;
    // transform: scale(2) translate(90%, 90%);
    transform: scale(1) translate(0, 0);
    opacity: 1;
    box-shadow: 0 10px 30px -6px black;
  }
`;

const ListenOnSpotifyBtn = styled.a`
  margin-top: 15px;
  background-color: transparent;
  border-radius: 2em;
  border: 0.2em solid #fff;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  padding: 0.7em 1.5em;
  outline: none;
  min-width: 120px;
  text-align: center;
  text-transform: uppercase;
  transition: all 0.25s ease;

  @media (max-width: 500px) {
    font-size: 10px;
    min-width: 80px;
  }

  &:hover {
    background: #fff;
    color: #000;
  }
`;

const AnalyzeBtn = styled(ListenOnSpotifyBtn)<{ show: boolean }>`
  display: ${props => (props.show ? "display" : "none")};
`;
