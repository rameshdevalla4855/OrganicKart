'use client';

import Link from 'next/link';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaLeaf, FaArrowRight } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-32 pb-12 relative overflow-hidden">
      {/* Background technical elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
      <div className="absolute -top-64 -right-64 w-[600px] h-[600px] bg-secondary opacity-[0.05] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand Hub */}
          <div className="lg:col-span-5 space-y-10">
            <Link href="/" className="inline-block group">
               <div className="flex flex-col">
                  <span className="text-4xl font-playfair font-black tracking-tight italic">
                    Shresta<span className="text-secondary italic">Organics</span>
                  </span>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-2">Pure Food • Pure Life</span>
               </div>
            </Link>
            <p className="text-white/50 text-[13px] font-black uppercase tracking-widest leading-[1.8] max-w-sm">
              We provide traditional, unadulterated food products sourced directly from Indian farms. Heritage quality for modern living.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: FaInstagram, href: "#" },
                { icon: FaFacebookF, href: "#" },
                { icon: FaTwitter, href: "#" },
                { icon: FaYoutube, href: "#" }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-500"
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="lg:col-span-1" /> {/* Spacer */}
          
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Foundation</h4>
            <ul className="space-y-4">
              {['Home', 'Shop All', 'Our Story', 'Wholesale', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[12px] font-black text-white/50 hover:text-secondary uppercase tracking-widest transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-3 h-[1px] bg-secondary transition-all mr-0 group-hover:mr-2" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Support</h4>
            <ul className="space-y-4">
              {['Delivery', 'Returns', 'Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[12px] font-black text-white/50 hover:text-secondary uppercase tracking-widest transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-3 h-[1px] bg-secondary transition-all mr-0 group-hover:mr-2" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Contact</h4>
            <div className="space-y-6">
               <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Direct Line</p>
                  <p className="text-sm font-black text-white tracking-widest">+91 9573485548</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Digital Mail</p>
                  <p className="text-sm font-black text-white tracking-widest">shrestaarogya18@gmail.com</p>
               </div>
            </div>
          </div>
        </div>

        {/* Global Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
            © {currentYear} Shresta Organics. All rights reserved.
          </p>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Farm-to-Door Service Active</span>
            </div>
            <div className="flex items-center space-x-2">
               <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Premium Certification</span>
               <FaLeaf className="w-3 h-3 text-secondary" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
