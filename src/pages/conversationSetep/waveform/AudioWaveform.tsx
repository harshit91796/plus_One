import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './AudioWaveform.css'; // Custom CSS for styling the waveform
import { FaPlay, FaPause } from 'react-icons/fa';
import '../customAudio/CustomAudioPlayer.css';

const AudioWaveform = ({ audioUrl , togglePlay }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  

  useEffect(() => {
    // Initialize Wavesurfer
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#ccc', // Customize the waveform color
      progressColor: '#007bff', // Customize the played portion color
      height: 100, // Height of the waveform
      cursorColor: '#333', // Color of the progress cursor
      responsive: true, // Responsive resize of the waveform
      barWidth: 5, // Width of waveform bars
      barRadius: 3, // Rounded corners for bars
      barGap: 3, // Gap between bars
      width: 200,
    });

    // Load the audio file into the waveform
    wavesurfer.current.load(audioUrl);

    // Cleanup on component unmount
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [audioUrl]);

  const handlePlayPause = () => {
    togglePlay();
    if (wavesurfer.current?.isPlaying()) {
      wavesurfer.current.pause();
    } else {
      wavesurfer.current.play();
    }
  };

  return (
    <div className="audio-waveform-container">
     
      <div className="controls">
     
      <button className={`play-button ${wavesurfer.current?.isPlaying() ? 'playing' : ''}`} onClick={handlePlayPause}>
        {wavesurfer.current?.isPlaying() ? <FaPause /> : <FaPlay />}
        </button>
        <audio ref={audioRef} src={audioUrl} />
        
      </div>
      <div id="waveform" ref={waveformRef}></div>
    </div>
  );
};

export default AudioWaveform;
