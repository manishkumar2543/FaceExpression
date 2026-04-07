import { useEffect, useRef, useState } from "react";
import { detect,init } from "../utils/utils";


export default function FaceExpression({onClick=()=>{ }}) {
  const videoRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationRef = useRef(null);

  const [expression, setExpression] = useState("Detecting...");



  useEffect(() => {
    init({ videoRef, faceLandmarkerRef}); // sirf setup
    return () => {
      if (animationRef.current)
        cancelAnimationFrame(animationRef.current);
    };
  }, []);

  async function handleClick() {

   const expression =  detect({ videoRef, faceLandmarkerRef, setExpression });
    console.log(expression);
   onClick(expression);

    
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Face Expression</h2>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "400px", border: "2px solid black" }}
      />

      <h3>{expression}</h3>

      {/* 🔥 Button se control */}
      <button className="button"
       onClick={handleClick}>Start Detect</button>

    </div>
  );
}