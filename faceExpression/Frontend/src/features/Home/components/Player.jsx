import { useContext } from "react";
import { SongContext } from "../song.context";
import "./Player.scss";

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const Player = () => {
    
  const {
    song,
    audioRef,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    togglePlayPause,
    skipBackward,
    skipForward,
    setPlaybackRate,
    seekTo,
  } = useContext(SongContext);

  return (
    <div className="music-player">
      <audio ref={audioRef} src={song?.url} preload="metadata" />

      <div className="music-player__top-row">
        <img
          src={song?.posterUrl || FALLBACK_POSTER}
          alt={song?.title || "Current song"}
          className="music-player__poster"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_POSTER;
          }}
        />
        <div>
          <div className="music-player__title">
            {song?.title || "No song selected"}
          </div>
          <div className="music-player__mood">{song?.mood || "unknown mood"}</div>
        </div>
      </div>

      <div className="music-player__controls">
        <div className="music-player__button-group">
          <button className="music-player__button" type="button" onClick={skipBackward}>
            -5s
          </button>
          <button
            className="music-player__button music-player__button--primary"
            type="button"
            onClick={togglePlayPause}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button className="music-player__button" type="button" onClick={skipForward}>
            +5s
          </button>
        </div>

        <div className="music-player__button-group">
          <label htmlFor="speed-select">Speed</label>
          <select
            id="speed-select"
            value={playbackRate}
            onChange={(event) => setPlaybackRate(Number(event.target.value))}
            className="music-player__speed-select"
          >
            {SPEED_OPTIONS.map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="music-player__progress-row">
        <span className="music-player__time">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={Number.isFinite(duration) && duration > 0 ? duration : 0}
          value={Number.isFinite(currentTime) ? currentTime : 0}
          onChange={(event) => seekTo(Number(event.target.value))}
          className="music-player__range"
        />
        <span className="music-player__time">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default Player;
