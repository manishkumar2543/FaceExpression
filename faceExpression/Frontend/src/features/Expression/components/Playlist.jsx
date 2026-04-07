import React from "react";
import { useSong } from "../../Home/hooks/use.Song";

const PLAYLIST = [
  {
    mood: "happy",
    title: "Happy Mood Track",
    file: "0f835247a53e15ea912083b1b683380ca9d44334_m4DGagIq3.mp3",
  },
  {
    mood: "sleep",
    title: "Sleep Chill Track",
    file: "223200983c5d180a020dd2e560efb29538bac50e_36VubyZ9w.mp3",
  },
  {
    mood: "wow",
    title: "Wow Energy Track",
    file: "486a899a0167e2dee0c63b30a8fbed2d37d97cba_br3WRwmAX.mp3",
  },
  {
    mood: "sad",
    title: "Sad Vibe Track",
    file: "e83c30dd3b78d2842e73725f4a598467536e8934_-6cGcPI5AF.mp3",
  },
];

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const normalizeMood = (value) => {
  if (!value || typeof value !== "string") return "";
  return value.toLowerCase().trim();
};

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const Playlist = ({ detectedExpression }) => {
  const activeMood = normalizeMood(detectedExpression);

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
  } = useSong();

  return (
    <aside className="playlist-panel">
      <audio ref={audioRef} src={song?.url} preload="metadata" />

      <h3 className="playlist-panel__title">Mood Playlist</h3>
      <p className="playlist-panel__subtitle">
        Current expression: <strong>{detectedExpression || "Detecting..."}</strong>
      </p>

      <div className="playlist-list">
        {PLAYLIST.map((item) => {
          const isActive = item.mood === activeMood;
          return (
            <div key={item.mood} className={`playlist-item ${isActive ? "playlist-item--active" : ""}`}>
              <div className="playlist-item__left">
                <div className="playlist-item__mood">{item.mood.toUpperCase()}</div>
                <div className="playlist-item__name">{item.title}</div>
                <div className="playlist-item__file">{item.file}</div>
              </div>
              <div className="playlist-item__status">{isActive ? "Now Selected" : "Queued"}</div>
            </div>
          );
        })}
      </div>

      <div className="playlist-now">
        <div className="playlist-now__label">Current Song</div>
        <div className="playlist-now__value">{song?.title || "No song selected"}</div>
        <div className="playlist-now__meta">
          Mood: {song?.mood || "unknown"} | {isPlaying ? "Playing" : "Paused"}
        </div>
      </div>

      <div className="playlist-controls">
        <div className="playlist-controls__buttons">
          <button type="button" onClick={skipBackward}>-5s</button>
          <button type="button" className="playlist-controls__play" onClick={togglePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={skipForward}>+5s</button>
        </div>

        <div className="playlist-controls__speed">
          <label htmlFor="playlist-speed">Speed</label>
          <select
            id="playlist-speed"
            value={playbackRate}
            onChange={(event) => setPlaybackRate(Number(event.target.value))}
          >
            {SPEED_OPTIONS.map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </div>

        <div className="playlist-controls__progress">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={Number.isFinite(duration) && duration > 0 ? duration : 0}
            value={Number.isFinite(currentTime) ? currentTime : 0}
            onChange={(event) => seekTo(Number(event.target.value))}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </aside>
  );
};

export default Playlist;
