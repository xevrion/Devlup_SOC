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
  let categoryLabel = 'SoC';
  let categoryClass = 'bg-blue-600/90 text-white dev-badge';
  
  if (project.category && project.category.trim().toLowerCase() === 'soc x raid') {
    categoryLabel = 'SoC X RAID';
    categoryClass = 'bg-blue-600/90 text-white ai-badge';
  }
  return (
    <Link 
      to={`/projects/${project.id}`}
      className="border border-terminal-dim rounded-lg p-4 hover:border-terminal-accent transition-all group flex flex-col"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="font-bold text-xl text-terminal-text group-hover:text-terminal-accent">
            {project.name}
          </h2>
          {/* Status badge intentionally not shown on list cards (kept in detail page) */}
          {/* Category badge */}
          {project.category && (
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${categoryClass}`}>
              <span className="relative z-10">{categoryLabel}</span>
            </span>
          )}
        </div>
        <ChevronRight className="text-terminal-dim group-hover:text-terminal-accent" />
      </div>
      {project.status && project.status.toLowerCase() === 'completed' ? (
        <div className="mt-3">
          {project.currentDesc ? (
            <p className="text-terminal-dim mb-3">{project.currentDesc}</p>
          ) : (
            <p className="text-terminal-dim mb-3">No summary provided.</p>
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
          <p className="text-terminal-dim mb-4 flex-grow">
            {project.description}
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <span 
                  key={index}
                  className="bg-terminal-dim/20 px-2 py-1 text-xs text-terminal-text rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="border-t border-terminal-dim pt-4 flex justify-between items-center">
              <span className="text-sm text-terminal-dim">
                {project.mentor && project.mentor2 && project.mentor3 ? '3 mentors' : 
                 project.mentor && project.mentor2 ? '2 mentors' : '1 mentor'}
              </span>
              <span className="text-terminal-accent text-sm">View Details</span>
            </div>
          </div>
        </>
      )}
    </Link>
  );
};

export default ProjectCard;
