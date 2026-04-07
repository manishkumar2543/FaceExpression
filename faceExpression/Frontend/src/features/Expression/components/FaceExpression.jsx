import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import Playlist from "./Playlist";
import "./Playlist.scss";

export default function FaceExpression({ onClick = () => {} }) {
  const videoRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationRef = useRef(null);

  const [expression, setExpression] = useState("Detecting...");

  useEffect(() => {
    init({ videoRef, faceLandmarkerRef });
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  function handleClick() {
    const nextExpression = detect({ videoRef, faceLandmarkerRef, setExpression });
    onClick(nextExpression);
  }

  return (
    <div className="expression-layout">
      <div className="expression-panel">
        <h2>Face Expression</h2>
        <video ref={videoRef} autoPlay playsInline className="expression-panel__video" />

        <h3>{expression}</h3>

        <button className="button" onClick={handleClick}>
          Start Detect
        </button>
      </div>

      <Playlist detectedExpression={expression} />
    </div>
  );
}
