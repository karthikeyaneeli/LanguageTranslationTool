import { motion } from 'framer-motion';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <motion.div
        className="w-5 h-5 border-2 border-t-transparent border-current rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
