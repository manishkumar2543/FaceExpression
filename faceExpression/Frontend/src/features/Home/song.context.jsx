import { createContext, useEffect, useRef, useState } from "react";

export const SongContext = createContext();

const DEFAULT_PLAYBACK_RATE = 1;
const SEEK_STEP_SECONDS = 5;
// const DEFAULT_POSTER = "https://ik.imagekit.io/9xmdsgbfi/songs/Chumma__From__Vicky_Vidya_Ka_Woh_Wala_Video____DownloadMing.WS__wV-Ybga5k";
const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
        "url": "https://ik.imagekit.io/9xmdsgbfi/songs/Chumma__From__Vicky_Vidya_Ka_Woh_Wala_Video____DownloadMing.WS__wV-Ybga5k",
        "posterUrl": "https://ik.imagekit.io/9xmdsgbfi/songs/Chumma__From__Vicky_Vidya_Ka_Woh_Wala_Video____DownloadMing.WS__wV-Ybga5k",
        "title": "Chumma (From \"Vicky Vidya Ka Woh Wala Video\") [DownloadMing.WS]",
         "mood": "happy",
  });

  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRateState] = useState(DEFAULT_PLAYBACK_RATE);

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime || 0);
    const updateDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.load();
    audio.playbackRate = playbackRate;
    setCurrentTime(0);
    setDuration(0);

    if (!isPlaying) return;

    audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, [song?.url]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });
  };

  const seekBy = (seconds) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;

    const targetTime = Math.min(
      Math.max(audio.currentTime + seconds, 0),
      audio.duration
    );
    audio.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const skipBackward = () => seekBy(-SEEK_STEP_SECONDS);
  const skipForward = () => seekBy(SEEK_STEP_SECONDS);

  const setPlaybackRate = (rate) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = rate;
    setPlaybackRateState(rate);
  };

  const seekTo = (time) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;

    const targetTime = Math.min(Math.max(time, 0), audio.duration);
    audio.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  return (
    <SongContext.Provider
      value={{
        song,
        setSong,
        loading,
        setLoading,
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
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export default SongContextProvider;
