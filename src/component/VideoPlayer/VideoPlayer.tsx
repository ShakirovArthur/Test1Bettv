import React from "react";
import "./VideoPlayer.css";
import { WebcamStream } from "../WebcamRecorder/WebcamRecorder";

export const VideoPlayer = () => {
  return (
    <div className="wrapper">
      <div className="webcam-stream">
        <WebcamStream />
      </div>
      <video autoPlay muted loop className="fullscreen-video">
        <source
          src="https://pictures.s3.yandex.net/landings-video/Backend.webm"
          type="video/mp4"
        />
      </video>
    </div>
  );
};
