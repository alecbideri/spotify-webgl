import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { MediaItem as MediaItemType } from '../../services/mockData';
import { useStore } from '../../store/useStore';

interface MediaItemProps {
  item: MediaItemType;
  position: [number, number, number];
}

export const MediaItem = ({ item, position }: MediaItemProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { playTrack } = useStore();


  useFrame(() => {
    // ... lines 17-22
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        playTrack(item);
      }}


      // Optional: Add cursor pointer style logic if possible in canvas, 
      // usually handled by setting document body cursor in pointer events
      onPointerEnter={() => (document.body.style.cursor = 'pointer')}
      onPointerLeave={() => (document.body.style.cursor = 'auto')}
    >

      <Image
        url={item.imageUrl}
        transparent
        scale={[3, 4]} // Aspect ratio for card
      />
      {hovered && (
        <Text
          position={[0, -2.5, 0.1]}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {item.title}
        </Text>
      )}
    </group>
  );
};
