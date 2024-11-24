import { useState, useRef, useEffect } from 'react';
import './CustomAudioPlayer.css';
import { FaPlay, FaPause } from 'react-icons/fa';
// import AudioWaveform from '../waveform/AudioWaveform';

const CustomAudioPlayer = ({ audioSrc }: { audioSrc: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * duration;
    }
  };

  return (
    <div className="custom-audio-player">
      <button className={`play-button ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      
      <div className="audio-controls">
        <div className="time">{formatTime(currentTime)}</div>
        <div className="progress-bar" ref={progressBarRef} onClick={handleProgressClick}>
          <div className="wave-container">
            {/* {[...Array(40)].map((_, i) => (
              <div 
                key={i} 
                className={`wave-bar ${currentTime / duration > i / 40 ? 'active' : ''}`}
                style={{ 
                  height: `${Math.random() * 100}%`,
                }}
              />
            ))} */}

            
          </div>
          <audio ref={audioRef} src={audioSrc} />
          <div 
            className="progress" 
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <span>/</span>
        <div className="time">{formatTime(duration)}</div>
      </div>
      
      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
};

export default CustomAudioPlayer;
