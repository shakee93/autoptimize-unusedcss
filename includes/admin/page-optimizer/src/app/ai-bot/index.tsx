"use client";

import Chat from "app/ai-bot/components/Chat2";
import { m, AnimatePresence } from "framer-motion";

export default function ChatPage() {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        ease: 'linear',
        duration: 0.04,
      }}
      id='rapidload-page-optimizer-wrapper' className="flex justify-center items-center container ">
      <Chat />
    </m.div>
  );
}
