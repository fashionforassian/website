"use client";

import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function Fashion3DHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 3D rotation based on scroll
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 360, 720]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 25]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.8, 1.2, 0.8]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-white py-20"
      style={{ perspective: "1200px" }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          backgroundPosition: "0 0",
          willChange: "background-position",
        }}
      />

      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #000, transparent)",
          willChange: "transform",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #333, transparent)",
          willChange: "transform",
        }}
        animate={{
          scale: [1.5, 1, 1.5],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen mx-auto px-4">
        {/* Title Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h1
            className="font-playfair text-5xl md:text-7xl font-light text-black leading-tight mb-4"
            style={{ willChange: "transform" }}
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Signature Collection
          </motion.h1>
          <motion.p
            className="text-neutral-600 text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Experience the evolution of fashion through interactive 3D showcase
          </motion.p>
        </motion.div>

        {/* 3D Fashion Display Container */}
        <motion.div
          className="relative w-full max-w-4xl h-96 md:h-[500px] flex items-center justify-center"
          style={{
            perspective: "1500px",
            willChange: "transform",
          }}
        >
          {/* Central 3D Fashion Element */}
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              rotateY,
              rotateX,
              scale,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {/* Jacket-like Shape (Layer 1) */}
            <motion.div
              className="absolute w-64 h-80 md:w-80 md:h-96"
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #333333 50%, #1a1a1a 100%)",
                borderRadius: "40% 40% 50% 50%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 20px rgba(255,255,255,0.1)",
                transformStyle: "preserve-3d",
                willChange: "box-shadow",
              }}
              animate={{
                boxShadow: [
                  "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 20px rgba(255,255,255,0.1)",
                  "0 30px 80px rgba(0,0,0,0.4), inset 0 1px 30px rgba(255,255,255,0.15)",
                  "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 20px rgba(255,255,255,0.1)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Accent Stripe */}
            <motion.div
              className="absolute w-2 h-96 md:h-[400px] bg-gradient-to-b from-white via-transparent to-white"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                transformStyle: "preserve-3d",
                zIndex: 10,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Left Sleeve */}
            <motion.div
              className="absolute"
              style={{
                width: "120px",
                height: "40px",
                background: "linear-gradient(90deg, #000, #222)",
                borderRadius: "50%",
                left: "-60px",
                top: "120px",
                transformStyle: "preserve-3d",
                boxShadow: "-10px 5px 20px rgba(0,0,0,0.4)",
              }}
              animate={{
                scaleX: [1, 1.15, 1],
                skewY: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Right Sleeve */}
            <motion.div
              className="absolute"
              style={{
                width: "120px",
                height: "40px",
                background: "linear-gradient(90deg, #222, #000)",
                borderRadius: "50%",
                right: "-60px",
                top: "120px",
                transformStyle: "preserve-3d",
                boxShadow: "10px 5px 20px rgba(0,0,0,0.4)",
              }}
              animate={{
                scaleX: [1, 1.15, 1],
                skewY: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Dynamic Color Overlay based on scroll */}
            <motion.div
              className="absolute w-64 h-80 md:w-80 md:h-96"
              style={{
                borderRadius: "40% 40% 50% 50%",
                background: useMotionTemplate`linear-gradient(135deg, hsl(${useTransform(scrollYProgress, [0, 1], [0, 360])}, 100%, 30%), hsl(${useTransform(scrollYProgress, [0, 1], [180, 540])}, 100%, 40%))`,
                opacity: 0.2,
                pointerEvents: "none",
              }}
            />
          </motion.div>

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-black rounded-full"
              animate={{
                x: [
                  Math.cos((i / 6) * Math.PI * 2) * 200,
                  Math.cos((i / 6) * Math.PI * 2) * 250,
                  Math.cos((i / 6) * Math.PI * 2) * 200,
                ],
                y: [
                  Math.sin((i / 6) * Math.PI * 2) * 200,
                  Math.sin((i / 6) * Math.PI * 2) * 250,
                  Math.sin((i / 6) * Math.PI * 2) * 200,
                ],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl">
          {[
            {
              icon: "✨",
              title: "Premium Materials",
              desc: "Handpicked fabrics from around the world",
            },
            {
              icon: "🎨",
              title: "Signature Design",
              desc: "Timeless pieces with modern aesthetics",
            },
            {
              icon: "♻️",
              title: "Sustainable",
              desc: "Eco-friendly production methods",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="group relative p-7 rounded-xl bg-white border border-neutral-200 backdrop-blur hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{ willChange: "transform, box-shadow" }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
            >
              <motion.p 
                className="text-4xl mb-3 inline-block"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {item.icon}
              </motion.p>
              <h3 className="font-semibold text-black mb-2 text-sm">{item.title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
              
              {/* Decorative line on hover */}
              <motion.div 
                className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-black to-transparent group-hover:w-full transition-all duration-500"
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-8 py-3 bg-black text-white font-medium rounded-full text-sm uppercase tracking-widest border border-black hover:bg-white hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Signature
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom scroll indicator - Moved outside */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-xs text-neutral-600 uppercase tracking-widest text-center">
          Scroll to explore more
        </p>
        <svg
          className="w-6 h-6 mx-auto mt-2 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </div>
  );
}
