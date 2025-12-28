import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Points, BufferGeometry, Float32BufferAttribute, PointsMaterial } from "three";

export function Particles() {
  const pointsRef = useRef<Points>(null);
  const { viewport } = useThree();

  const particleCount = 200;

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [viewport.width, viewport.height]);

  const geometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geometry;
  }, [positions]);

  const material = useMemo(() => {
    return new PointsMaterial({
      color: 0xff6b9d,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const time = clock.elapsedTime;
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.001;
        positions[i3] += Math.cos(time + i * 0.1) * 0.0005;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}
