"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  X,
  MessageCircle,
  Send,
  Loader2,
  ArrowDownCircleIcon,
} from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "@ai-sdk/react";

import LandingSections from "@/components/LandingSections";

export default function Chat() {
  //is chat window open?
  const [isChatOpen, setIsChatOpen] = useState(false);
  //is chat icon visible?
  const [showChatIcon, setShowChatIcon] = useState(false);
  const chatIconRef = useRef<HTMLButtonElement>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    error
  } = useChat({api: "/api/gemini"})

  useEffect(() => {
    const handleScroll = () => {
      if(window.scrollY > 200) {
        setShowChatIcon(true);
      } else {
        setShowChatIcon(false);
        setIsChatOpen(false)
      }
    }

    handleScroll();
    //when the component mounts
    //see where the user is currently scrolled to 

    //add listener for the scroll and the function 
    window.addEventListener("scroll", handleScroll);

    return () => {
      //clean up when the component unmounts
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LandingSections />
      <AnimatePresence>
        {showChatIcon && (
          <motion.div
          initial={{ opacity: 0, y:100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 z-50"
          >
            <Button 
              ref={chatIconRef}
              onClick={toggleChat} 
              size="icon"
              className="rounded-full size-12 p-2 shadow-lg"
              >
              {!isChatOpen ? (
                <MessageCircle className="size-12"/> 
              ) : (
                <ArrowDownCircleIcon />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 right-4 z-50 w-[95%] md:w-[500px]"
        >
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-bold">
                Chat with NoteWorthy AI
              </CardTitle>
              <Button onClick={toggleChat}
              size="sm"
              className="px-2 py-0"
              variant="ghost"
            >
                <X className="size-4" />
                <span className="sr-only">Close chat</span>
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="w-full mt-32 text-gray-500 items-center justify-center flex gap-3">
                  No messages yet.
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form
                onSubmit={handleSubmit} 
                className="flex w-full items-center space-x-2">
                  <Input 
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1"
                    placeholder="Type your message here..."
                    />
                    <Button
                      type="submit"
                      className="size-9"
                      disabled={isLoading}
                      size="icon"
                    >
                      <Send className="size-4" />
                    </Button>
                </form>
            </CardFooter>
          </Card>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
