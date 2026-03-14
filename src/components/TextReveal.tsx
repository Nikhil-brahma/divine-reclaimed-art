import { motion } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const TextReveal = ({ text, className = "", delay = 0, stagger = 0.03, as: Tag = "span" }: TextRevealProps) => {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.3em]">
          {word.split("").map((char, charIndex) => {
            const globalIndex = words.slice(0, wordIndex).join("").length + charIndex;
            return (
              <motion.span
                key={charIndex}
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: delay + globalIndex * stagger,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="inline-block"
                style={{ transformOrigin: "bottom" }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
};

export default TextReveal;
