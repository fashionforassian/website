"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { useRef } from "react";
import { useScroll } from "framer-motion";
import * as THREE from "three";

function ClothModel({ scrollYProgress }: { scrollYProgress: any }) {
  const { scene } = useGLTF("/models/cloth.glb");
  const ref = useRef<THREE.Group>(null);

  // Prepare model for shadows
  useFrame(() => {
    if (scene) {
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  });

  useFrame(() => {
    if (!ref.current) return;

    // 1. ROTATION CONTROLLED BY SCROLL
    // Get the current progress (0 to 1) from the sticky container
    const progress = scrollYProgress.get();
    
    // Map 0-1 progress to 0 to 720 degrees (2 full rotations)
    // We use lerp for smooth easing, but track the target tightly
    const targetRotation = progress * Math.PI * 4; 
    
    // Smoothing: Lower damping value = smoother/slower reaction
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y, 
      targetRotation, 
      0.1
    );

    // 2. EXTRA ANIMATION: Floating & Breathing
    // Add a subtle floating motion based on time, not scroll
    const time = performance.now() * 0.001;
    ref.current.position.y = 1.2 + Math.sin(time) * 0.05;
  });

  return <primitive ref={ref} object={scene} scale={0.3} position={[0, 1.6, 0]} />;
}

export default function ClothGLBViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  // This hook tracks scroll specifically for the containerRef
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"] // Starts when top hits top, ends when bottom hits bottom
  });

  return (
    // This container creates the "stuck" area. 
    // Height is 400vh, meaning user scrolls 4 screens worth of space here.
    <div ref={containerRef} className="relative w-full h-[400vh] bg-black">
      
      {/* The Sticky Wrapper - This stays on screen while the parent scrolls */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Gradient Background for vibe */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-900 pointer-events-none" />
        
        {/* Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <Canvas shadows camera={{ position: [0, 1.6, 6], fov: 40 }}>
          <ambientLight intensity={0.5} />
          
          {/* Main Light */}
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={2.5} 
            castShadow 
          />
          
          {/* Rim Lights for that "Amazing" look */}
          <pointLight position={[-5, 2, -2]} intensity={10} color="#4f46e5" /> {/* Indigo */}
          <pointLight position={[5, 2, -2]} intensity={10} color="#ec4899" /> {/* Pink */}

          <ClothModel scrollYProgress={scrollYProgress} />

          {/* Ground Shadows */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.5}
            scale={20}
            blur={2}
            far={10}
            color="#000"
          />

          <Environment preset="city" />
          
          {/* OrbitControls disabled because we want scroll to control rotation */}
          <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
        </Canvas>
        
        {/* UI Overlay - Optional Text to guide user */}
        <div className="absolute bottom-10 left-0 w-full text-center text-white pointer-events-none">
          <p className="text-sm opacity-50 animate-bounce">Scroll to Rotate</p>
        </div>
      </div>
    </div>
  );
}