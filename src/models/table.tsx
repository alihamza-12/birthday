import { useLoader } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import { useMemo } from "react";
import type { Group } from "three";
import { Mesh, MeshStandardMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type TableProps = ThreeElements["group"];

export function Table({ children, ...groupProps }: TableProps) {
  const gltf = useLoader(GLTFLoader, "/table.glb");
  const tableScene = useMemo<Group | null>(() => {
    if (!gltf.scene) return null;
    const cloned = gltf.scene.clone(true);

    // Enhance table materials for better appearance
    cloned.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if (mat instanceof MeshStandardMaterial) {
              mat.metalness = 0.1;
              mat.roughness = 0.4;
              mat.envMapIntensity = 0.5;
            }
          });
        } else if (child.material instanceof MeshStandardMaterial) {
          child.material.metalness = 0.1;
          child.material.roughness = 0.4;
          child.material.envMapIntensity = 0.5;
        }
      }
    });

    return cloned;
  }, [gltf.scene]);

  if (!tableScene) {
    return null;
  }

  return (
    <group {...groupProps}>
      <primitive object={tableScene} />
      {children}
    </group>
  );
}
