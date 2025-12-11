import { Canvas } from '@react-three/fiber';
import { MapControls } from '@react-three/drei';
import { InfiniteScene } from './components/canvas/InfiniteScene';
import { AutoPanner } from './components/canvas/AutoPanner';
import { useStore } from './store/useStore';
import { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { AudioPlayer } from './components/ui/AudioPlayer';



import { fetchSongs, fetchPodcasts } from './services/spotify';

function App() {
  const { mode, setMode, setItems } = useStore();

  useEffect(() => {
    const loadData = async () => {

      const data = mode === 'song' ? await fetchSongs() : await fetchPodcasts();
      setItems(data);
    };
    loadData();
  }, [mode, setItems]);



  // Failsafe: Reset interaction state on global pointer up
  // This handles cases where MapControls.onEnd doesn't fire (e.g. mouse leaves canvas)
  // or if damping interferes with the event.
  useEffect(() => {
    const handlePointerUp = () => {
      useStore.getState().setIsInteracting(false);
    };
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);


  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={() => setMode('song')}
          style={{
            fontWeight: mode === 'song' ? 'bold' : 'normal',
            padding: '10px 20px',
            background: mode === 'song' ? '#1DB954' : 'black',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Songs
        </button>
        <button
          onClick={() => setMode('podcast')}
          style={{
            fontWeight: mode === 'podcast' ? 'bold' : 'normal',
            padding: '10px 20px',
            background: mode === 'podcast' ? '#1DB954' : 'black',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Podcasts
        </button>
        <button
          onClick={useStore(state => state.toggleAutoScroll)}
          style={{
            padding: '10px 20px',
            background: useStore(state => state.autoScrollEnabled) ? '#1DB954' : '#333',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          {useStore(state => state.autoScrollEnabled) ? 'Auto-Scroll: ON' : 'Auto-Scroll: OFF'}
        </button>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        color: '#333',
        pointerEvents: 'none'
      }}>
        <p>Scroll to Zoom • Left Click to Pan</p>
      </div>


      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={1.5} />

        <MapControls
          makeDefault
          enableRotate={false}
          enableDamping={false}
          enableZoom={true} // Ensure zoom is enabled
          screenSpacePanning={true} // 2D Pan (Up/Down/Left/Right)
          minDistance={10} // Adjusted min distance to prevent getting too close
          maxDistance={100} // Increased max distance
          zoomSpeed={1} // Standard zoom speed
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE // unused if enableRotate=false but kept for safety
          }}

          touches={{
            ONE: THREE.TOUCH.PAN,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
          onEnd={() => useStore.getState().setIsInteracting(false)}
        />
        <AutoPanner />
        <Suspense fallback={null}>
          <InfiniteScene />
        </Suspense>
      </Canvas>
      <AudioPlayer />
    </div>
  );
}

export default App;

