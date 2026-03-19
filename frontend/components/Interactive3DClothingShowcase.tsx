"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScroll, useTransform, motion } from "framer-motion";
import * as THREE from "three";

// --- 1. FABRIC GENERATOR (Creates "Real" Clothing Textures) ---
function createFabricTexture(color: string, type: "wool" | "silk" | "denim") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Base color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 512);

  // Add fabric noise/fiber details
  if (type === "wool") {
    for (let i = 0; i < 15000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 1);
    }
  } else if (type === "silk") {
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, "rgba(255,255,255,0.1)");
    gradient.addColorStop(0.5, "rgba(0,0,0,0.05)");
    gradient.addColorStop(1, "rgba(255,255,255,0.1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// --- 2. MANNEQUIN BODY SHAPE (Realistic Human Proportions) ---
function MannequinBody() {
  // A curve that defines the human silhouette (side profile of a torso/legs)
  const points = useMemo(() => {
    const pts = [];
    // Head (Sphere approx)
    pts.push(new THREE.Vector2(0.35, 4.8)); 
    pts.push(new THREE.Vector2(0.5, 4.2)); // Neck width
    // Shoulders
    pts.push(new THREE.Vector2(0.8, 3.8)); 
    // Chest
    pts.push(new THREE.Vector2(0.95, 3.0)); 
    // Waist
    pts.push(new THREE.Vector2(0.75, 2.2)); 
    // Hips
    pts.push(new THREE.Vector2(0.9, 1.4)); 
    // Legs Start
    pts.push(new THREE.Vector2(0.6, 1.0)); 
    // Knees
    pts.push(new THREE.Vector2(0.5, 0.0)); 
    // Ankles
    pts.push(new THREE.Vector2(0.25, -1.8)); 
    // Feet
    pts.push(new THREE.Vector2(0, -2.0)); 
    
    return pts;
  }, []);

  return (
    <group position={[0, -1.2, 0]}>
      {/* The Main Body Mesh - LatheGeometry spins the 2D points into 3D */}
      <mesh castShadow>
        <latheGeometry args={[points, 32]} />
        <meshStandardMaterial color="#e8d6c4" roughness={0.7} />
      </mesh>

      {/* Arms - detached for realism */}
      {[-1, 1].map((side) => (
        <mesh 
          key={side} 
          position={[side * 1.1, 2.8, 0]} 
          rotation={[0, 0, side * 0.3]}
        >
          <capsuleGeometry args={[0.18, 2.0, 8, 16]} />
          <meshStandardMaterial color="#e8d6c4" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// --- 3. CLOTHING SYSTEM ---
const outfits = [
  {
    id: 1,
    name: "Premium Linen Jacket",
    category: "Outerwear",
    description: "Heavy texture with lapel collars.",
    color: "#2F4F4F",
    type: "wool",
    geometry: () => {
      const shape = new THREE.Shape();
      shape.moveTo(-0.9, 3.8);
      shape.lineTo(-1.1, 3.0); 
      shape.lineTo(-1.0, 1.5);
      shape.lineTo(-0.5, 1.2);
      shape.lineTo(0, 3.2); // Center opening
      shape.lineTo(0.5, 1.2);
      shape.lineTo(1.0, 1.5);
      shape.lineTo(1.1, 3.0);
      shape.lineTo(0.9, 3.8);
      shape.lineTo(-0.9, 3.8);
      
      const extrudeSettings = { depth: 1.2, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 };
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }
  },
  {
    id: 2,
    name: "Silk Evening Dress",
    category: "Dresses",
    description: "Fluid silk with high sheen.",
    color: "#800000",
    type: "silk",
    geometry: () => {
       const shape = new THREE.Shape();
       shape.moveTo(-0.7, 3.5);
       shape.lineTo(-1.2, 1.0); 
       shape.lineTo(-1.0, -0.5);
       shape.lineTo(1.0, -0.5);
       shape.lineTo(1.2, 1.0);
       shape.lineTo(0.7, 3.5);
       
       const extrudeSettings = { depth: 0.9, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 };
       return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }
  },
  {
    id: 3,
    name: "Casual Denim & Tee",
    category: "Streetwear",
    description: "Classic casual fit.",
    color: "#87CEEB",
    type: "denim",
    geometry: () => {
       const shape = new THREE.Shape();
       shape.moveTo(-0.6, 3.4);
       shape.lineTo(-0.9, 2.8);
       shape.lineTo(-0.7, 1.6);
       shape.lineTo(0.7, 1.6);
       shape.lineTo(0.9, 2.8);
       shape.lineTo(0.6, 3.4);
       
       const extrudeSettings = { depth: 0.7, bevelEnabled: false };
       return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }
  },
  {
    id: 4,
    name: "Modern Knitwear",
    category: "Sweaters",
    description: "Chunky knit texture.",
    color: "#F5F5DC",
    type: "wool",
    geometry: () => {
       const shape = new THREE.Shape();
       shape.moveTo(-0.7, 3.5);
       shape.lineTo(-0.85, 2.5);
       shape.lineTo(-0.75, 1.4);
       shape.lineTo(0.75, 1.4);
       shape.lineTo(0.85, 2.5);
       shape.lineTo(0.7, 3.5);
       
       const extrudeSettings = { depth: 0.85, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 };
       return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }
  }
];

function ClothingMesh({ outfit, activeIndex, index }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  
  const texture = useMemo(() => createFabricTexture(outfit.color, outfit.type), [outfit]);
  const geometry = useMemo(() => outfit.geometry(), [outfit]);

  useFrame(() => {
    if (!meshRef.current || !matRef.current) return;
    
    // Smooth Opacity Transition
    const targetOpacity = activeIndex === index ? 1 : 0;
    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, targetOpacity, 0.1);
    
    // Scale transition (pop effect)
    const targetScale = activeIndex === index ? 1 : 0.9;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, -1.2, -0.2]} castShadow>
      <meshStandardMaterial 
        ref={matRef}
        map={texture} 
        color={outfit.color} 
        transparent 
        opacity={0} 
        roughness={outfit.type === "silk" ? 0.1 : 0.8}
        metalness={outfit.type === "silk" ? 0.1 : 0}
      />
    </mesh>
  );
}

// --- 4. SCENE SETUP ---
function Scene({ scrollProgress }: { scrollProgress: any }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // FIX: Use useState instead of useRef for the array destructuring
  const [activeIndex, setActiveIndex] = useState(0);

  useFrame(() => {
    if (!groupRef.current) return;
    
    const progress = scrollProgress.get();
    
    // Rotation
    groupRef.current.rotation.y = progress * Math.PI * 2.5;
    
    // Calculate active index (0 to 3)
    const idx = Math.min(Math.floor(progress * outfits.length), outfits.length - 1);
    
    // Only update state if it changed (prevents lag)
    if (idx !== activeIndex) {
      setActiveIndex(idx);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Studio Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={2} castShadow />
      <spotLight position={[-5, 5, -5]} angle={0.5} intensity={1} color="#88ccff" />

      {/* The Mannequin */}
      <MannequinBody />

      {/* The Clothes */}
      {outfits.map((outfit, index) => (
        <ClothingMesh 
          key={outfit.id} 
          outfit={outfit} 
          index={index} 
          activeIndex={activeIndex} 
        />
      ))}
      
      {/* Trousers (Permanent part of mannequin style) */}
      <mesh position={[0, -1.2, 0]}>
         <cylinderGeometry args={[0.6, 0.4, 2.5, 32]} />
         <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
    </group>
  );
}

// --- 5. MAIN COMPONENT ---
export default function FashionShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-zinc-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* 3D Canvas */}
        <Canvas 
          camera={{ position: [0, 2, 10], fov: 40 }} 
          className="absolute inset-0"
          shadows
        >
          <Scene scrollProgress={scrollYProgress} />
        </Canvas>

        {/* UI Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-none">
          
          {/* Top Branding */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-white text-2xl md:text-4xl font-light tracking-widest">ATELIER</h1>
              <div className="h-0.5 w-12 bg-blue-500 mt-2" />
            </div>
          </div>

          {/* Bottom Product Info */}
          <div className="w-full md:w-1/2 self-end">
            <div className="relative h-48 md:h-64 flex items-end">
              {outfits.map((item, idx) => {
                const start = idx / outfits.length;
                const end = (idx + 1) / outfits.length;
                const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
                const y = useTransform(scrollYProgress, [start, start + 0.1], [50, 0]);

                return (
                  <motion.div 
                    key={item.id} 
                    style={{ opacity, y }} 
                    className="absolute bottom-0 right-0 text-right bg-black/30 backdrop-blur-md p-6 rounded-l-xl border border-white/10 pointer-events-auto"
                  >
                    <p className="text-blue-400 text-xs uppercase tracking-widest mb-1">{item.category}</p>
                    <h2 className="text-white text-2xl md:text-4xl font-semibold mb-2 font-serif">{item.name}</h2>
                    <p className="text-neutral-400 text-sm md:text-base max-w-xs ml-auto">{item.description}</p>
                    <button className="mt-4 px-6 py-2 bg-white text-black text-xs font-bold rounded hover:bg-blue-500 hover:text-white transition-colors">
                      Shop Now
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}