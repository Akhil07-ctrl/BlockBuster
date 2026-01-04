import React from 'react';
import { motion as Motion } from 'framer-motion';

const Loader = () => {
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-950"
    >
      <div className="relative">
        {/* Animated Rings */}
        <Motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 border-4 border-brand-500 rounded-full border-t-transparent"
        />
        
        <Motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 w-24 h-24 border-4 border-purple-600 rounded-full border-b-transparent opacity-50"
        />

        {/* Center Icon/Logo placeholder */}
        <Motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-8 h-8 bg-brand-500 rounded-lg rotate-45 shadow-lg shadow-brand-500/50" />
        </Motion.div>
      </div>

      <Motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <h2 className="text-3xl font-black tracking-tighter text-white">
          BLOCK<span className="text-brand-500">BUSTER</span>
        </h2>
        <div className="mt-2 flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <Motion.div
              key={i}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-brand-500 rounded-full"
            />
          ))}
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default Loader;
