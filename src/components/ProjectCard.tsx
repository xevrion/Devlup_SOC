import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  mentor: {
    name: string;
    role: string;
    email: string;
    linkedin?: string;
    github?: string;
  };
  mentor2?: {
    name: string;
    role: string;
    email: string;
    linkedin?: string;
    github?: string;
  };
  mentor3?: {
    name: string;
    role: string;
    email: string;
    linkedin?: string;
    github?: string;
  };
  projectDoc?: string;
  category?: string; // Add category field
  // New optional fields from Sheets
  status?: string; // e.g. 'Completed', 'Ongoing', 'Archived'
  currentDesc?: string; // Short description of current/completed work
  liveLinks?: string[]; // Array of live/demo links
  projectGithub?: string; // optional project github url
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Determine category label and style
  let categoryLabel = '';
  let categoryClass = 'bg-blue-600/90 text-white dev-badge';
  
  // For ongoing projects, show WoC '26
  if (project.status && project.status.toLowerCase() === 'ongoing') {
    categoryLabel = "WoC '26";
  } else if (project.category && (project.category.trim().toLowerCase() === 'soc x raid' || project.category === '1' || project.category.toString().toLowerCase().includes('raid'))) {
    categoryLabel = 'SoC X RAID';
    categoryClass = 'bg-blue-600/90 text-white ai-badge';
  } else {
    categoryLabel = 'Projects Archive';
  }
  return (
    <Link 
      to={`/projects/${project.id}`}
      className="border border-terminal-dim rounded-lg p-3 sm:p-4 hover:border-terminal-accent transition-all group flex flex-col"
    >
      <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg sm:text-xl text-terminal-text group-hover:text-terminal-accent break-words">
            {project.name}
          </h2>
          {/* Status badge intentionally not shown on list cards (kept in detail page) */}
          {/* Category badge */}
          {categoryLabel && (
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${categoryClass}`}>
              <span className="relative z-10">{categoryLabel}</span>
            </span>
          )}
        </div>
        <ChevronRight className="text-terminal-dim group-hover:text-terminal-accent flex-shrink-0 mt-1" size={20} />
      </div>
      {project.status && project.status.toLowerCase() === 'completed' ? (
        <div className="mt-2 sm:mt-3">
          {project.currentDesc ? (
            <p className="text-sm sm:text-base text-terminal-dim mb-2 sm:mb-3">{project.currentDesc}</p>
          ) : (
            <p className="text-sm sm:text-base text-terminal-dim mb-2 sm:mb-3">No summary provided.</p>
          )}

          {project.liveLinks && project.liveLinks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.liveLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.startsWith('http') ? link : `https://${link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-terminal-dim/20 rounded text-xs text-terminal-accent hover:underline truncate"
                  title={link}
                >
                  {link}
                </a>
              ))}
            </div>
          ) : (
            <div className="text-terminal-dim text-sm">No live links available.</div>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm sm:text-base text-terminal-dim mb-3 sm:mb-4 flex-grow">
            {project.description}
          </p>
          
          <div className="space-y-3 sm:space-y-4">
            {project.techStack && project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.techStack.map((tech, index) => (
                  <span 
                    key={index}
                    className="bg-terminal-dim/20 px-2 py-1 text-xs text-terminal-text rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            
            <div className="border-t border-terminal-dim pt-3 sm:pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-xs sm:text-sm text-terminal-dim">
                {project.mentor && project.mentor2 && project.mentor3 ? '3 mentors' : 
                 project.mentor && project.mentor2 ? '2 mentors' : '1 mentor'}
              </span>
              <span className="text-terminal-accent text-xs sm:text-sm">View Details</span>
            </div>
          </div>
        </>
      )}
    </Link>
  );
};

export default ProjectCard;
