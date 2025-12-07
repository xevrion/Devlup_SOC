import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTerminal } from '../context/TerminalContext';
import TerminalHeader from '../components/TerminalHeader';
import { Calendar, ExternalLink, Clock, Users } from 'lucide-react';

interface SeasonGroup {
  name: string;
  projects: any[];
}

const Timeline = () => {
  const { projects, loading } = useTerminal();

  // Group projects by category/season
  const seasonGroups = useMemo(() => {
    const groups: Record<string, SeasonGroup> = {};

    projects.forEach(project => {
      let seasonName = 'Winter of Code';
      
      // Determine season name based on category
      if (project.category) {
        const categoryLower = project.category.toString().toLowerCase().trim();
        if (categoryLower === 'soc x raid' || categoryLower === '1' || categoryLower.includes('raid')) {
          seasonName = 'SoC X RAID';
        } else if (categoryLower === 'soc' || categoryLower.includes('summer')) {
          seasonName = 'Summer of Code';
        } else if (categoryLower.includes('winter')) {
          seasonName = 'Winter of Code';
        } else if (categoryLower) {
          seasonName = categoryLower.charAt(0).toUpperCase() + categoryLower.slice(1);
        }
      }

      if (!groups[seasonName]) {
        groups[seasonName] = {
          name: seasonName,
          projects: []
        };
      }
      groups[seasonName].projects.push(project);
    });

    // Convert to array and sort (newest first - assuming more projects = newer)
    return Object.values(groups).sort((a, b) => b.projects.length - a.projects.length);
  }, [projects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-terminal flex flex-col items-center p-4">
        <div className="terminal-window max-w-6xl w-full mx-auto my-8">
          <TerminalHeader title="Timeline" />
          <div className="terminal-body min-h-[500px] flex items-center justify-center">
            <p className="text-terminal-accent">Loading timeline...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal/95 flex flex-col items-center p-2 sm:p-4">
      <div className="terminal-window max-w-7xl w-full mx-auto my-4 sm:my-8">
        <TerminalHeader title="Projects Timeline" />
        <div className="terminal-body min-h-[500px] overflow-y-auto p-4 sm:p-6">
          {seasonGroups.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-terminal-dim">No projects available.</p>
            </div>
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {/* Header Section */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-terminal-accent/10 rounded-lg">
                  <Calendar className="text-terminal-accent w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-terminal-text">Projects Timeline</h1>
                  <p className="text-sm sm:text-base text-terminal-dim mt-1">
                    Explore projects organized by season and program
                  </p>
                </div>
              </div>

              {/* Timeline Groups */}
              {seasonGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="relative">
                  {/* Timeline line and dot */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-terminal-accent via-terminal-accent/50 to-terminal-dim/30"></div>
                  <div className="absolute left-0 top-0 w-3 h-3 bg-terminal-accent rounded-full border-2 border-terminal transform -translate-x-1.5 shadow-lg shadow-terminal-accent/50"></div>
                  
                  <div className="ml-8 sm:ml-12">
                    {/* Season Header */}
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h2 className="text-xl sm:text-3xl font-bold text-terminal-text">{group.name}</h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-terminal-dim/20 rounded-full border border-terminal-dim/30">
                          <Users size={14} className="text-terminal-accent" />
                          <span className="text-terminal-dim text-xs sm:text-sm font-medium">
                            {group.projects.length} {group.projects.length === 1 ? 'project' : 'projects'}
                          </span>
                        </div>
                      </div>
                      <div className="h-0.5 w-24 bg-gradient-to-r from-terminal-accent to-transparent mt-2"></div>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {group.projects.map((project, projectIndex) => (
                        <Link
                          key={project.id}
                          to={`/projects/${project.id}`}
                          className="group relative bg-terminal-dim/10 hover:bg-terminal-dim/20 border border-terminal-dim/50 hover:border-terminal-accent/50 rounded-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-terminal-accent/10 hover:-translate-y-1"
                          style={{
                            animationDelay: `${projectIndex * 50}ms`
                          }}
                        >
                          {/* Status Badge */}
                          {project.status && (
                            <div className="absolute top-4 right-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                                project.status.toLowerCase() === 'completed' 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                project.status.toLowerCase() === 'ongoing' 
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}>
                                <Clock size={10} className="mr-1" />
                                {project.status}
                              </span>
                            </div>
                          )}

                          {/* Project Content */}
                          <div className="pr-16">
                            <h3 className="font-bold text-lg sm:text-xl text-terminal-text group-hover:text-terminal-accent mb-3 transition-colors line-clamp-2">
                              {project.name}
                            </h3>
                            
                            {project.description && (
                              <p className="text-terminal-dim text-sm sm:text-base line-clamp-3 mb-4 leading-relaxed">
                                {project.description}
                              </p>
                            )}

                            {/* View Details Link */}
                            <div className="flex items-center text-terminal-accent text-sm font-medium group-hover:gap-2 transition-all">
                              <span>View Details</span>
                              <ExternalLink size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>

                          {/* Hover Effect Gradient */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-terminal-accent/0 to-terminal-accent/0 group-hover:from-terminal-accent/5 group-hover:to-transparent transition-all duration-300 pointer-events-none"></div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;

