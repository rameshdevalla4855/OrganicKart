'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Mail, MapPin, Phone } from 'lucide-react';

import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-primary pt-24 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Logo and About */}
        <div className="lg:col-span-2">
            <Logo variant="footer" className="mb-6" />
            <p className="text-white/70 mb-8 leading-relaxed max-w-sm">
              Bringing you nature&apos;s finest, ethically sourced organic essentials directly from traditional Indian farms. Certified pure and chemical-free.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/shrestaorganics" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/shrestaorganics" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Explore</h4>
            <ul className="space-y-4 text-white/70">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-accent transition-colors">All Products</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Collections</h4>
            <ul className="space-y-4 text-white/70">
              <li><Link href="/products?category=Oils" className="hover:text-accent transition-colors">Wood Pressed Oils</Link></li>
              <li><Link href="/products?category=Spices" className="hover:text-accent transition-colors">Organic Spices</Link></li>
              <li><Link href="/products?category=Sweeteners" className="hover:text-accent transition-colors">Natural Sweeteners</Link></li>
              <li><Link href="/products?category=Grains" className="hover:text-accent transition-colors">Grains & Pulses</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Get In Touch</h4>
            <div className="flex items-start space-x-3 text-white/70">
              <FaMapMarkerAlt className="w-5 h-5 text-accent shrink-0 mt-1" />
              <p>123 Organic Lane, Farm Estate, Hyderabad, Telangana - 500001</p>
            </div>
            <div className="flex items-center space-x-3 text-white/70">
              <FaPhone className="w-5 h-5 text-accent shrink-0" />
              <p>+91 98765 43210</p>
            </div>
            <div className="flex items-center space-x-3 text-white/70">
              <FaEnvelope className="w-5 h-5 text-accent shrink-0" />
              <p>rameshdevalla144@gmail.com</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/40">
          <p>© 2024 Shresta Organics. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
