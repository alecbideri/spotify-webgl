import { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';

export const AudioPlayer = () => {
  const { currentTrack, isPlaying, togglePlay } = useStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      // If we have a streamUrl, try to play it.
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  if (!currentTrack) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: '#181818',
      color: 'white',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      borderTop: '1px solid #282828',
      zIndex: 100
    }}>
      {/* Track Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '30%' }}>
        <img
          src={currentTrack.imageUrl}
          alt={currentTrack.title}
          style={{ width: '56px', height: '56px', objectFit: 'cover' }}
        />
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{currentTrack.title}</div>
          <div style={{ fontSize: '13px', color: '#b3b3b3' }}>{currentTrack.artist}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
        <button
          onClick={togglePlay}
          style={{
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        {/* Only show "Preview" if it's a snippet. Full tracks would have a real progress bar. */}
        <div style={{ fontSize: '11px', marginTop: '8px', color: '#b3b3b3' }}>
          {currentTrack.streamUrl ? 'Preview' : 'No Preview Available'}
        </div>
      </div>

      <div style={{ width: '30%' }}>
        {/* Placeholder for volume or extra controls */}
      </div>

      {currentTrack.streamUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.streamUrl}
          onEnded={() => useStore.getState().togglePlay()}
        />
      )}
    </div>
  );
};
