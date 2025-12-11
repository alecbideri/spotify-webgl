import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import { MediaItem } from './MediaItem';
import * as THREE from 'three';

export const InfiniteScene = () => {
  const { items } = useStore();

  // Initial random positions
  const initialPositions = useMemo(() => {
    return items.map(() => ({
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 80,
      z: (Math.random() - 0.5) * 15,
    }));
  }, [items]);

  return (
    <group>
      {items.map((item, i) => (
        <WrappingMediaItem
          key={item.id}
          item={item}
          initialPos={initialPositions[i] || { x: 0, y: 0, z: 0 }}
        />
      ))}
    </group>
  );
};

// Internal component that handles its own wrapping
const WrappingMediaItem = ({ item, initialPos }: { item: any, initialPos: { x: number, y: number, z: number } }) => {
  const meshRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Offset to keep track of accumulated wrapping
  const offset = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!meshRef.current) return;

    // Check distance to camera
    const worldPos = meshRef.current.position;
    const dx = camera.position.x - worldPos.x;
    const dy = camera.position.y - worldPos.y;

    const wrapX = 80; // Width of the "world"
    const wrapY = 60; // Height of the "world"

    if (Math.abs(dx) > wrapX / 2) {
      const sign = Math.sign(dx);
      offset.current.x += sign * wrapX;
      meshRef.current.position.x += sign * wrapX;
    }

    if (Math.abs(dy) > wrapY / 2) {
      const sign = Math.sign(dy);
      offset.current.y += sign * wrapY;
      meshRef.current.position.y += sign * wrapY;
    }
  });

  // Set initial position once
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(initialPos.x, initialPos.y, initialPos.z);
    }
  }, [initialPos]);

  return (
    <group ref={meshRef}>
      <MediaItem item={item} position={[0, 0, 0]} />
    </group>
  );
};
