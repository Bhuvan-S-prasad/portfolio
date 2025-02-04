import React from 'react';
import { Linkedin, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Portfolio</h3>
            <p className="text-gray-400">
              Bhuvan S<br />
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="text-gray-400 hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#skills" className="text-gray-400 hover:text-primary transition-colors">
                  Skills
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-primary transition-colors">
                  Projects
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Follow me</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/bhuvan-s-prasad"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://github.com/Bhuvan-S-prasad"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Github size={24} />
              </a>
              <a
                href="https://www.instagram.com/bhuvan_s_prasad"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary/5 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Bhuvan S Prasad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;