import React, { useEffect, useRef, useState } from "react";
import "./WebcamRecorder.css";

const style = { maxWidth: "100%", height: "auto" };

export const WebcamStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const stopButtonRef = useRef<HTMLButtonElement>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const videoConstraints: MediaStreamConstraints = {
      video: true,
      audio: true,
    };

    const successCallback = (stream: MediaStream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      audioStreamRef.current = stream;
    };

    const errorCallback = (error: MediaStream) => {
      console.error("Cannot access media devices", error);
    };

    navigator.mediaDevices
      .getUserMedia(videoConstraints)
      .then(successCallback)
      .catch(errorCallback);

    return () => {
      const currentVideoRef = videoRef.current;
      if (currentVideoRef) {
        const stream = currentVideoRef.srcObject as MediaStream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  const startScreenCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      if (screenRef.current) {
        screenRef.current.srcObject = stream;
      }
      screenStreamRef.current = stream;
    } catch (error) {
      console.error("Error accessing screen capture:", error);
    }
  };

  const startRecording = () => {
    recordedChunksRef.current = [];
    const screenStream = screenStreamRef.current;
    const audioStream = audioStreamRef.current;

    if (screenStream && audioStream) {
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      const options = { mimeType: "video/webm;codecs=vp9,opus" };
      mediaRecorderRef.current = new MediaRecorder(combinedStream, options);

      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.onstop = handleStop;
      mediaRecorderRef.current.onstart = handleStart;

      mediaRecorderRef.current.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (stopButtonRef.current) {
        stopButtonRef.current.disabled = true;
      }
    }
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      recordedChunksRef.current.push(event.data);
    }
  };

  const handleStop = () => {
    const recordedBlob = new Blob(recordedChunksRef.current, {
      type: "video/webm",
    });
    const recordedUrl = URL.createObjectURL(recordedBlob);

    const a = document.createElement("a");
    a.href = recordedUrl;
    a.download = "recorded.webm";
    a.click();
  };

  const handleStart = () => {
    if (stopButtonRef.current) {
      stopButtonRef.current.disabled = false;
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      if (screenStreamRef.current) {
        startRecording();
      } else {
        startScreenCapture().then(startRecording);
      }
    }
  };

  return (
    <>
      <div className="webcam-stream">
        <video
          ref={videoRef}
          autoPlay
          muted
          style={style}
          className="video-flip"
        />
        {recording && <video ref={screenRef} autoPlay muted style={style} />}
        <button
          disabled={recording}
          onClick={toggleRecording}
          className="start-button">
          {"Start Recording"}
        </button>
        <button
          ref={stopButtonRef}
          disabled={!recording}
          onClick={stopRecording}
          className="stop-button">
          Stop Recording
        </button>
      </div>
    </>
  );
};
