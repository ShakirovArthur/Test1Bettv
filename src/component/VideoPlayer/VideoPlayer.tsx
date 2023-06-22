import React from "react";
import "./VideoPlayer.css";

export const VideoPlayer = () => {
  return (
    <video autoPlay muted loop className="fullscreen-video">
      <source
        src="https://pictures.s3.yandex.net/landings-video/Backend.webm"
        type="video/mp4"
      />
    </video>
  );
};
