"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { useScroll, type MotionValue } from "framer-motion";
import * as THREE from "three";

type TraversableObject = THREE.Object3D & {
  isMesh?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
};

function ClothModel({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const { scene } = useGLTF("/models/cloth.glb");
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as TraversableObject;

      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    const normalizedProgress = Math.min(scrollYProgress.get() / 0.9, 1);
    const targetRotation = normalizedProgress * Math.PI * 1.2;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotation, 0.035);
    ref.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime) * 0.05;
  });

  return <primitive ref={ref} object={scene} scale={0.3} position={[0, 1.6, 0]} />;
}

function SceneFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white/85 px-6 py-5 text-neutral-600 shadow-lg backdrop-blur-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
          <div className="h-6 w-6 animate-[pulse_2.8s_ease-in-out_infinite] rounded-full border border-neutral-300 bg-neutral-200/70" />
        </div>
        <div className="text-xs uppercase tracking-[0.2em]">Loading 3D Model</div>
      </div>
    </Html>
  );
}

useGLTF.preload("/models/cloth.glb");

export default function ClothGLBViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative h-[180vh] w-full bg-[#f6f1e8]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#fffdf8_0%,#f6f1e8_45%,#ebe3d5_100%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9c3a6]/30 blur-[130px]" />

        <Canvas
          dpr={[1, 1.5]}
          shadows
          gl={{ antialias: false, powerPreference: "high-performance" }}
          camera={{ position: [0, 1.6, 6], fov: 40 }}
        >
          <ambientLight intensity={1.15} />
          <directionalLight position={[5, 6, 5]} intensity={2.6} castShadow color="#fff7ea" />
          <pointLight position={[-4, 3, -2]} intensity={3.2} color="#f3d2b4" />
          <pointLight position={[4, 2, -1]} intensity={2.4} color="#f6efe4" />
          <Suspense fallback={<SceneFallback />}>
            <ClothModel scrollYProgress={scrollYProgress} />
            <Environment preset="city" />
          </Suspense>
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.45}
            scale={18}
            blur={2}
            far={10}
            color="#8d7b66"
          />
          <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
        </Canvas>

        <div className="pointer-events-none absolute bottom-10 left-0 w-full text-center text-[#5f5242]">
          <p className="text-sm opacity-70">Slow scroll to inspect the cloth form</p>
        </div>
      </div>
    </div>
  );
}
