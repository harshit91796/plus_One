import React, { useState, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import './CustomAudioPlayer.css'; // Link to your custom CSS file
import AudioWaveform from '../waveform/AudioWaveform';

const CustomAudioPlayer = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);


  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="audio-player-container">
      
      <div className="audio-waveform-container">
           
           <AudioWaveform audioUrl={audioSrc} togglePlay={togglePlay} />
      </div>
      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
};

export default CustomAudioPlayer;
