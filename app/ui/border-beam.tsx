import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export const BorderBeam = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: ["0%", "100%"],
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [controls]);

  return (
    <motion.div
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
        animate={controls}
      />
    </motion.div>
  );
};