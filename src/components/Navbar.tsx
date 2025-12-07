import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, User, BarChart, Phone, Calendar, Menu, X } from 'lucide-react';
import { useTerminal } from '../context/TerminalContext';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const location = useLocation();
  const { projects } = useTerminal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Extract projectId from the URL path manually since useParams() doesn't work at this level
  const projectId = location.pathname.startsWith('/projects/') && location.pathname !== '/projects' 
    ? location.pathname.split('/projects/')[1] 
    : null;
  
  // Find current project if we're on a project detail page
  const currentProject = projectId ? projects.find(p => p.id === projectId) : null;
  
  // Determine navbar text and logo based on current project category
  const getNavbarContent = () => {
    if (currentProject && currentProject.category) {
      // Check if category indicates SoC X RAID (could be '1' or text containing 'raid')
      if (currentProject.category === '1' || 
          currentProject.category.toString().toLowerCase().includes('soc x raid') || 
          currentProject.category.toString().toLowerCase().includes('raid')) {
        return {
          text: 'DevlUp Labs X RAID',
          showRaidLogo: true
        };
      }
    }
    return {
      text: 'DevlUp Labs',
      showRaidLogo: false
    };
  };

  const navbarContent = getNavbarContent();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-terminal-accent' : 'text-terminal-dim hover:text-terminal-text';
  };

  const navLinks = [
    { path: '/', icon: Home, label: 'Home', shortcut: 'Alt+H' },
    { path: '/projects', icon: Briefcase, label: 'Projects', shortcut: 'Alt+P' },
    { path: '/apply', icon: User, label: 'Apply', shortcut: 'Alt+A' },
    { path: '/timeline', icon: Calendar, label: 'Timeline' },
    { path: '/stats', icon: BarChart, label: 'Stats', shortcut: 'Alt+S' },
    { path: '/contact', icon: Phone, label: 'Contact', shortcut: 'Alt+C' },
  ];
  
  return (
    <nav className="bg-terminal border-b border-terminal-dim px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/uploads/a04b4cd1-93e6-496f-a36f-bae3a41203d5.png" 
              alt="DevlUp Labs Logo" 
              className="h-8 w-8"
            />
            <span className="text-terminal-text font-bold text-lg hidden sm:flex items-center">
              {navbarContent.text}
              {navbarContent.showRaidLogo && (
                <img 
                  src="/uploads/raid.png" 
                  alt="RAID Logo" 
                  className="h-8 w-8 ml-2"
                />
              )}
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex font-bold items-center space-x-4">
          <TooltipProvider>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Tooltip key={link.path}>
                  <TooltipTrigger asChild>
                    <Link to={link.path} className={`${isActive(link.path)} transition-colors flex items-center`}>
                      <Icon size={16} className="mr-1" />
                      <span>{link.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex items-center gap-1">
                      <span>{link.label}</span>
                      {link.shortcut && (
                        <kbd className="px-1.5 py-0.5 text-xs bg-terminal-dim rounded">{link.shortcut}</kbd>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="text-terminal-text hover:text-terminal-accent transition-colors p-2">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-terminal border-b border-terminal-dim w-full h-auto">
              <div className="flex flex-col space-y-1 pt-4 pb-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-terminal-dim">
                  <div className="flex items-center space-x-2">
                    <img 
                      src="/uploads/a04b4cd1-93e6-496f-a36f-bae3a41203d5.png" 
                      alt="DevlUp Labs Logo" 
                      className="h-8 w-8"
                    />
                    <span className="text-terminal-text font-bold text-lg">
                      {navbarContent.text}
                    </span>
                    {navbarContent.showRaidLogo && (
                      <img 
                        src="/uploads/raid.png" 
                        alt="RAID Logo" 
                        className="h-8 w-8 ml-2"
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`${isActive(link.path)} transition-colors flex items-center space-x-2 py-3 px-4 rounded-lg hover:bg-terminal-dim/20 border border-terminal-dim/30`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon size={18} />
                        <span className="font-medium text-sm">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
