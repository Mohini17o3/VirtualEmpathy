'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '../components/Navbar';
import { auth } from '../firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/Login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSendMessage = async () => {
    if (input.trim() && !isTyping) {
      // Add user's message to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: 'user' },
      ]);
      setInput('');
      setIsTyping(true);

      // API request to get bot's response
      try {
        const response = await fetch('http://localhost:5001/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input,
            conversation_history: messages.map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }],
            })),
          }),
        });

        const data = await response.json();

        // Add bot's response to the messages array
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.response, sender: 'bot' },
        ]);
      } catch (error) {
        console.error('Error:', error);
        // If there's an error, display a fallback message
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "I'm having trouble responding right now.", sender: 'bot' },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center text-3xl">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cover bg-center bg-gradient-to-t from-pink-200 via-pink-300 to-pink-400 bg-opacity-50 sm-w-screen">
        <div className="flex flex-col justify-end min-h-screen pt-20 pb-16 px-4">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-pink-100 bg-opacity-80 rounded-lg shadow-xl ">
      
            {/* Displaying Messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md p-3 flex flex-row gap-4   rounded-lg border-2 border-white ${msg.sender === 'user' ? 'bg-pink-500 text-white' : 'bg-pink-300 text-gray-700 '}`}
                >
                <div className='flex flex-start flex-row'>{msg.sender === 'user' ?  
                <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                 <AvatarFallback>CN</AvatarFallback>
                 </Avatar> 
                 
                 :  

                 <Avatar>
                <AvatarImage src="brain.webp" />
                 <AvatarFallback>Bot</AvatarFallback>
                 </Avatar> 
                 
                 
                   }
                   
                   </div>
                  {msg.text}

                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-xs p-3 rounded-lg bg-pink-100 text-gray-700">
                  <div className="flex space-x-1">
                    <div className="w-2.5 h-2.5 bg-pink-600 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-pink-600 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-pink-600 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 mt-4 p-4 bg-white rounded-lg shadow-lg">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 rounded-lg text-pink-600 focus:outline-none"
            />
            <Button
              className="bg-pink-600 text-white p-3 rounded-lg"
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;


