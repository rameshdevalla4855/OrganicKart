'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseInit';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Settings, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  Search,
  LogOut,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import Logo from '@/components/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else if (userData?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, userData, loading, router]);

  if (loading || (user && userData?.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center">
           <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-4" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Authenticating Access...</p>
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/users', icon: Users },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-primary/10 selection:text-primary">
      
      {/* PROFESSIONAL DESKTOP SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? '80px' : '280px' }}
        className="hidden lg:flex flex-col fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-50 transition-all duration-500 ease-in-out"
      >
        {/* Sidebar Header */}
        <div className="h-24 flex items-center px-6 justify-between overflow-hidden">
           <AnimatePresence mode="wait">
             {!isSidebarCollapsed && (
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="flex items-center"
               >
                  <Logo variant="footer" className="scale-75 origin-left" />
                  <span className="ml-3 text-[10px] font-black uppercase bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 tracking-tighter">Admin</span>
               </motion.div>
             )}
           </AnimatePresence>
           <button 
             onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
             className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
           >
             {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
           </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                pathname === link.href 
                  ? 'bg-primary text-white shadow-soft shadow-primary/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 focus:outline focus:outline-primary/20'
              }`}
            >
              <link.icon className={`w-5 h-5 flex-shrink-0 ${pathname === link.href ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'} transition-colors`} />
              <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-4 text-[13px] font-black uppercase tracking-widest whitespace-nowrap"
                  >
                    {link.name}
                  </motion.span>
                )}
              </AnimatePresence>
              {pathname === link.href && !isSidebarCollapsed && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-40 shadow-glow"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
           <Link 
             href="/" 
             className="flex items-center px-4 py-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
           >
              <ExternalLink className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="ml-4 text-[11px] font-black uppercase tracking-widest">Storefront</span>}
           </Link>
           <button 
             onClick={() => signOut(auth)}
             className="flex items-center px-4 py-3 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all"
           >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="ml-4 text-[11px] font-black uppercase tracking-widest">Sign Out</span>}
           </button>
        </div>
      </motion.aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-[60] flex items-center justify-between px-6">
         <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-premium">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 leading-none mb-1">Admin Panel</p>
               <p className="text-[13px] font-black text-primary leading-none tracking-tight">Shresta Control</p>
            </div>
         </div>
         <button 
           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
           className="p-3 bg-slate-50 text-slate-600 rounded-2xl border border-slate-100 active:scale-95 transition-all"
         >
           {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
         </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
         {isMobileMenuOpen && (
           <motion.div 
             initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
             animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
             exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
             className="lg:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-2xl pt-28 px-6 flex flex-col"
           >
              <nav className="space-y-3">
                 {navLinks.map((link, i) => (
                   <motion.div
                     key={link.name}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.05 }}
                   >
                     <Link 
                       href={link.href} 
                       onClick={() => setIsMobileMenuOpen(false)}
                       className={`flex items-center p-5 rounded-[1.5rem] transition-all border ${
                         pathname === link.href 
                           ? 'bg-primary text-white border-primary shadow-premium' 
                           : 'text-slate-600 bg-slate-50 border-transparent active:bg-slate-100'
                       }`}
                     >
                       <link.icon className={`w-6 h-6 mr-6 ${pathname === link.href ? 'text-white' : 'text-slate-400'}`} />
                       <span className="text-[15px] font-black uppercase tracking-[0.1em]">{link.name}</span>
                     </Link>
                   </motion.div>
                 ))}
              </nav>
              
              <div className="mt-auto pb-12 space-y-3">
                 <Link href="/" className="flex items-center justify-center p-5 bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-slate-500 text-xs">
                    <ExternalLink className="w-4 h-4 mr-3" /> View Marketplace
                 </Link>
                 <button 
                   onClick={() => signOut(auth)} 
                   className="w-full flex items-center justify-center p-5 bg-red-50 rounded-2xl font-black uppercase tracking-widest text-red-500 text-xs border border-red-100 active:bg-red-500 active:text-white transition-all"
                 >
                    <LogOut className="w-4 h-4 mr-3" /> Terminate Session
                 </button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* MAIN CONTENT CANVAS */}
      <motion.main
        animate={{ paddingLeft: isSidebarCollapsed ? '80px' : '280px' }}
        className="flex-1 w-full pt-16 lg:pt-0 transition-all duration-500"
      >
        <div className="h-full min-h-screen">
          {/* Admin Context Toolbar */}
          <header className="h-24 hidden lg:flex items-center justify-between px-12 border-b border-slate-200 bg-white/50 backdrop-blur-md sticky top-0 z-40">
             <div className="flex items-center">
                <div className="relative group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                   <input 
                     type="text" 
                     placeholder="Global Harvest Search..." 
                     className="pl-12 pr-6 py-2.5 bg-slate-100 border border-transparent focus:bg-white focus:border-primary/20 rounded-xl text-[12px] font-bold text-slate-700 transition-all outline-none w-80"
                   />
                </div>
             </div>
             
             <div className="flex items-center space-x-6">
                <button className="relative p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
                   <Bell className="w-5.5 h-5.5" />
                   <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                </button>
                <div className="h-8 w-[1px] bg-slate-200" />
                <div className="flex items-center space-x-4 pl-2">
                   <div className="text-right">
                      <p className="text-[12px] font-black text-slate-800 tracking-tight leading-none mb-1 uppercase">{userData?.name || 'Admin Master'}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Senior Controller</p>
                   </div>
                   <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white text-sm font-black shadow-soft">
                      {userData?.name ? userData.name[0].toUpperCase() : 'A'}
                   </div>
                </div>
             </div>
          </header>

          <div className="p-4 lg:p-12 pb-24 lg:pb-12">
            {children}
          </div>
        </div>
      </motion.main>
    </div>
  );
}
