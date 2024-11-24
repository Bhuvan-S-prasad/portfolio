import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Bhuvan S";
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isTyping) {
      if (displayText !== fullText) {
        timeout = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, 200);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1000);
      }
    } else {
      if (displayText !== "") {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(true);
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-center lg:text-left"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            Hello, I'm{' '}
            <span className="text-primary">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            A passionate Computer Science and Artificial Intelligence
            student with a knack for solving complex problems using technology
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="public/BHUVAN_CV (2).pdf"
              download
              className="inline-flex items-center px-6 py-3 bg-primary text-black rounded-lg font-semibold 
              transform hover:scale-105 hover:bg-primary-hover transition-all duration-300 shadow-lg 
              hover:shadow-primary/25 group w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Download CV
            </a>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/Bhuvan-S-prasad" 
                className="text-gray-300 hover:text-primary transition-colors transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={24} />
              </a>
              <a 
                href="https://www.linkedin.com/in/bhuvan-s-prasad" 
                className="text-gray-300 hover:text-primary transition-colors transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="mailto:bhuvansbhuvans113@gmail.com" 
                className="text-gray-300 hover:text-primary transition-colors transform hover:scale-110"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative order-first lg:order-last"
        >
          <img
            src="bhuvan-port.png"
            alt="Profile"
            className="rounded-full shadow-2xl w-full max-w-md mx-auto"
          />
        </motion.div>
      </div>
    </div>
  );
}
