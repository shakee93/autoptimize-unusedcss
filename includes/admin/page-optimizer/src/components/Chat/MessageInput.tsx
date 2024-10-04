import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../store/slices/chatSlice';
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch(
        addMessage({
          id: uuidv4(),
          text: input.trim(),
          sender: 'user',
          timestamp: Date.now(),
        })
      );
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full space-x-2">
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow"
      />
      <Button type="submit">Send</Button>
    </form>
  );
};

export default MessageInput;