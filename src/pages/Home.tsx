import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTerminal } from '../context/TerminalContext';
import TerminalHeader from '../components/TerminalHeader';
import CommandOutput from '../components/CommandOutput';
import CommandLine from '../components/CommandLine';

const Home = () => {
  const { 
    commandHistory, 
    executeCommand, 
    isProcessing 
  } = useTerminal();
  
  const handleCommand = (command: string) => {
    // We just need to forward the command to the terminal context
    // The CommandLine component will now handle navigation directly
    executeCommand(command);
  };

  return (
    <div className="min-h-screen bg-terminal/95 p-2 sm:p-4">
      {/* Introduction Section */}
      <div className="max-w-4xl mx-auto py-6 sm:py-12 px-2 sm:px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img 
              src="/uploads/a04b4cd1-93e6-496f-a36f-bae3a41203d5.png" 
              alt="DevlUp Labs Logo" 
              className="h-16 w-16 sm:h-24 sm:w-24"
            />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-terminal-text mb-3 sm:mb-4 px-2">DevlUp Projects Archive</h1>
          <p className="text-base sm:text-xl text-terminal-dim max-w-2xl mx-auto px-2">
            Explore all projects and programs. Browse, connect with mentors, and contribute to exciting initiatives.
          </p>
        </div>
        
        <div className="grid md:grid-cols-1 gap-4 sm:gap-8 mb-8 sm:mb-16">
          <Link 
            to="/projects" 
            className="bg-terminal-dim/20 hover:bg-terminal-dim/30 border border-terminal-dim rounded-lg p-4 sm:p-6 transition-all group"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-terminal-text mb-2 group-hover:text-terminal-accent">Browse Projects</h2>
            <p className="text-sm sm:text-base text-terminal-dim mb-3 sm:mb-4">
              Explore available and completed projects and find opportunities that match your skills.
            </p>
            <div className="flex items-center text-terminal-accent text-sm sm:text-base">
              <span>View all projects</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          <Link 
            to="/apply" 
            className="bg-terminal-dim/20 hover:bg-terminal-dim/30 border border-terminal-dim rounded-lg p-4 sm:p-6 transition-all group"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-terminal-text mb-2 group-hover:text-terminal-accent">Apply Now</h2>
            <p className="text-sm sm:text-base text-terminal-dim mb-3 sm:mb-4">
              Ready to contribute? Submit your application to join a project.
            </p>
            <div className="flex items-center text-terminal-accent text-sm sm:text-base">
              <span>Apply now</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
      
      {/* Terminal Section */}
      <div className="max-w-4xl mx-auto mb-6 sm:mb-12 px-2 sm:px-0">
        <div className="terminal-window">
          <TerminalHeader title="DevlUp Projects Archive Terminal" />
          <div className="terminal-body min-h-[300px] sm:min-h-[400px] max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
            <CommandOutput output={commandHistory} />
            <CommandLine onCommand={handleCommand} isProcessing={isProcessing} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
