import React from 'react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useCart();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-foreground text-background px-6 py-3 flex items-center gap-2 shadow-2xl"
        >
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}