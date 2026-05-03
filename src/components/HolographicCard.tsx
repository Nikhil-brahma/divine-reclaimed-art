import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

const HolographicCard = ({ children, className = "", glowColor = "42, 85%, 55%" }: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${(mousePos.y - 0.5) * -8}deg) rotateY(${(mousePos.x - 0.5) * 8}deg)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg)",
        transition: isHovered ? "transform 0.08s linear" : "transform 0.4s ease-out",
        willChange: "transform",
      }}
    >
      {/* Holographic shimmer overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-40"
          style={{
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsla(${glowColor}, 0.3) 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Rainbow refraction edge */}
      {isHovered && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `
              linear-gradient(${mousePos.x * 360}deg, 
                hsla(42, 85%, 55%, 0.1) 0%, 
                hsla(30, 80%, 48%, 0.05) 25%,
                hsla(350, 55%, 35%, 0.05) 50%,
                hsla(42, 85%, 55%, 0.1) 75%,
                transparent 100%)
            `,
            mixBlendMode: "overlay",
          }}
        />
      )}

      {children}
    </motion.div>
  );
};

export default HolographicCard;
