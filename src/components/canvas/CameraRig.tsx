import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

export const CameraRig = () => {
  const { zoomLevel, setZoomLevel } = useStore();
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // e.deltaY > 0 means scrolling down (zoom out)
      // e.deltaY < 0 means scrolling up (zoom in)

      // Clamp zoom level between 2 (close) and 20 (far)
      const newZoom = Math.min(Math.max(zoomLevel + e.deltaY * 0.01, 2), 20);
      setZoomLevel(newZoom);
    };

    // Add listener to the canvas element
    gl.domElement.addEventListener('wheel', handleWheel, { passive: false }); // passive false to allow preventDefault if needed

    return () => {
      gl.domElement.removeEventListener('wheel', handleWheel);
    };
  }, [zoomLevel, setZoomLevel, gl.domElement]);

  useFrame(() => {
    // Smoothly interpolate camera position
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, zoomLevel, 0.1);
  });

  return null;
};
