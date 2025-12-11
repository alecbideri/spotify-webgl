import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../../store/useStore';

export const AutoPanner = () => {
  const { isInteracting, autoScrollEnabled } = useStore();
  const { camera, controls } = useThree();

  useFrame((_, delta) => {
    if (autoScrollEnabled && !isInteracting && controls) {
      const speed = 2 * delta;

      camera.position.x += speed;

      // CRITICAL: Synch controls target with camera to maintain relative position
      // @ts-ignore - target exists on MapControls/OrbitControls
      if (controls.target) {
        // @ts-ignore
        controls.target.x += speed;
      }
    }
  });

  return null;
};
