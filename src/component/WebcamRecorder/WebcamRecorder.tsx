import React, { useEffect, useRef } from "react";

export const WebcamStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const constraints = { video: true, audio: true };

    const successCallback = (stream: MediaStream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };

    const errorCallback = (error: MediaStream) => {
      console.error("Cannot access media devices", error);
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(successCallback)
      .catch(errorCallback);

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  return (
    <div className="webcam-stream">
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};
