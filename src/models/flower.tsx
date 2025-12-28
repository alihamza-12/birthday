import { useFrame } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

type FlowerProps = ThreeElements["group"] & {
  petalCount?: number;
  petalColor?: string;
  centerColor?: string;
  stemColor?: string;
};

export function Flower({
  petalCount = 8,
  petalColor = "#ff69b4",
  centerColor = "#ffd700",
  stemColor = "#228b22",
  ...groupProps
}: FlowerProps) {
  const flowerRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const flower = flowerRef.current;
    if (!flower) return;

    // Gentle swaying motion
    flower.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.05;
    flower.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.02;
  });

  const petals = Array.from({ length: petalCount }, (_, i) => {
    const angle = (i / petalCount) * Math.PI * 2;
    const x = Math.cos(angle) * 0.15;
    const z = Math.sin(angle) * 0.15;
    const rotation = angle;

    return (
      <mesh
        key={i}
        position={[x, 0.05, z]}
        rotation={[0, rotation, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.08, 0.02, 0.12]} />
        <meshLambertMaterial color={petalColor} />
      </mesh>
    );
  });

  return (
    <group ref={flowerRef} {...groupProps}>
      {/* Stem */}
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.2]} />
        <meshLambertMaterial color={stemColor} />
      </mesh>

      {/* Flower center */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.04]} />
        <meshLambertMaterial color={centerColor} />
      </mesh>

      {/* Petals */}
      {petals}

      {/* Leaves */}
      <mesh position={[0.03, -0.05, 0]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.01, 0.08]} />
        <meshLambertMaterial color={stemColor} />
      </mesh>
      <mesh position={[-0.03, -0.08, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.01, 0.08]} />
        <meshLambertMaterial color={stemColor} />
      </mesh>
    </group>
  );
}
