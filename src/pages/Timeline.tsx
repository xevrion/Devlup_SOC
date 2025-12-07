import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTerminal } from '../context/TerminalContext';
import TerminalHeader from '../components/TerminalHeader';
import { Calendar, ExternalLink } from 'lucide-react';

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
      let seasonName = 'Other Projects';
      
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
      <div className="terminal-window max-w-6xl w-full mx-auto my-4 sm:my-8">
        <TerminalHeader title="Projects Timeline" />
        <div className="terminal-body min-h-[500px] overflow-y-auto p-3 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-3xl font-bold text-terminal-text mb-2">Projects Timeline</h1>
            <p className="text-sm sm:text-base text-terminal-dim">
              Browse projects organized by season and program. Each section shows all projects from that program.
            </p>
          </div>

          {seasonGroups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-terminal-dim">No projects available.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {seasonGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="border-l-2 border-terminal-accent pl-6 relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-terminal-accent rounded-full border-2 border-terminal"></div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Calendar size={18} className="text-terminal-accent sm:w-5 sm:h-5" />
                      <h2 className="text-lg sm:text-2xl font-bold text-terminal-text">{group.name}</h2>
                      <span className="text-terminal-dim text-xs sm:text-sm">
                        ({group.projects.length} {group.projects.length === 1 ? 'project' : 'projects'})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ml-0 sm:ml-6">
                    {group.projects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="border border-terminal-dim rounded-lg p-4 hover:border-terminal-accent transition-all group"
                      >
                        <h3 className="font-semibold text-lg text-terminal-text group-hover:text-terminal-accent mb-2">
                          {project.name}
                        </h3>
                        {project.status && (
                          <span className={`inline-block mb-2 px-2 py-0.5 rounded text-xs font-semibold ${
                            project.status.toLowerCase() === 'completed' ? 'bg-emerald-600/90 text-white' :
                            project.status.toLowerCase() === 'ongoing' ? 'bg-amber-500/90 text-black' :
                            'bg-gray-600/80 text-white'
                          }`}>
                            {project.status}
                          </span>
                        )}
                        {project.description && (
                          <p className="text-terminal-dim text-sm line-clamp-2 mt-2">
                            {project.description}
                          </p>
                        )}
                        <div className="flex items-center text-terminal-accent text-sm mt-3 group-hover:underline">
                          <span>View Details</span>
                          <ExternalLink size={14} className="ml-1" />
                        </div>
                      </Link>
                    ))}
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

