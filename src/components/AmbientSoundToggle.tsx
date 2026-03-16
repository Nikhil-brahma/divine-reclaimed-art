import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const AmbientSoundToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = useCallback(() => {
    if (!audioRef.current) {
      // Use a royalty-free temple bell / ambient URL or generate oscillator
      const ctx = new AudioContext();
      
      // Create a gentle ambient drone with temple bell character
      const createDrone = () => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc1.type = "sine";
        osc1.frequency.value = 136.1; // Om frequency
        osc2.type = "sine";
        osc2.frequency.value = 272.2;
        
        filter.type = "lowpass";
        filter.frequency.value = 800;
        filter.Q.value = 1;
        
        gain.gain.value = 0;
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start();
        osc2.start();
        
        return { osc1, osc2, gain, ctx };
      };
      
      const drone = createDrone();
      (audioRef as any).current = drone;
      setIsLoaded(true);
      setIsPlaying(true);
      return;
    }

    const drone = (audioRef as any).current;
    if (isPlaying) {
      drone.gain.gain.linearRampToValueAtTime(0, drone.ctx.currentTime + 0.5);
      setTimeout(() => {
        drone.osc1.stop();
        drone.osc2.stop();
        drone.ctx.close();
        audioRef.current = null;
        setIsLoaded(false);
      }, 600);
      setIsPlaying(false);
    } else {
      audioRef.current = null;
      setIsLoaded(false);
      toggleSound(); // Reinitialize
    }
  }, [isPlaying]);

  return (
    <motion.button
      onClick={toggleSound}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 3, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-24 right-4 z-40 w-10 h-10 rounded-full flex items-center justify-center glass-sacred border border-gold/20 group"
      aria-label={isPlaying ? "Mute ambient sound" : "Play ambient temple sound"}
      title={isPlaying ? "Mute" : "Play sacred ambience"}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div key="on" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Volume2 className="w-4 h-4 text-gold" />
          </motion.div>
        ) : (
          <motion.div key="off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <VolumeX className="w-4 h-4 text-ivory/50 group-hover:text-gold transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse ring when playing */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full border border-gold/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

export default AmbientSoundToggle;
