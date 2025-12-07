import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTerminal } from '../context/TerminalContext';
import { ArrowLeft, FileText, Github, Linkedin, Mail, ExternalLink, User } from 'lucide-react';
import TerminalHeader from '../components/TerminalHeader';
import Footer from '../components/Footer';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { projects, loading } = useTerminal();
  const [project, setProject] = useState(null);
  const [detailTab, setDetailTab] = useState<'Overview' | 'Links' | 'Docs' | 'Mentors'>('Overview');

  useEffect(() => {
    if (!loading && projects.length > 0) {
      const foundProject = projects.find(p => p.id === projectId);
      setProject(foundProject);
    }
  }, [projectId, projects, loading]);

  // Helper function to render mentor card with all available info
  const renderMentorCard = (mentor, index) => {
    if (!mentor || !mentor.name) return null;
    
    return (
      <div key={`mentor-${index}`} className="border border-terminal-dim p-4 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <User size={18} className="text-terminal-accent" />
          <h3 className="font-semibold text-terminal-text">{mentor.name}</h3>
        </div>
        <p className="text-terminal-dim text-sm mb-3">{mentor.role}</p>
        
        <div className="space-y-2">
          {mentor.email && (
            <a 
              href={`mailto:${mentor.email}`} 
              className="flex items-center gap-2 text-terminal-accent hover:underline text-sm"
            >
              <Mail size={14} />
              <span>{mentor.email}</span>
            </a>
          )}
          
          {mentor.linkedin && (
            <a 
              href={mentor.linkedin}
              className="flex items-center gap-2 text-terminal-accent hover:underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={14} />
              <span>LinkedIn Profile</span>
            </a>
          )}
          
          {mentor.github && (
            <a 
              href={mentor.github}
              className="flex items-center gap-2 text-terminal-accent hover:underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={14} />
              <span>GitHub Profile</span>
            </a>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-terminal flex flex-col items-center p-4">
        <div className="terminal-window max-w-4xl w-full mx-auto my-8">
          <TerminalHeader title="Loading Project Details..." />
          <div className="terminal-body min-h-[500px] flex items-center justify-center">
            <p className="text-terminal-accent">Loading project information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-terminal flex flex-col items-center p-4">
        <div className="terminal-window max-w-4xl w-full mx-auto my-8">
          <TerminalHeader title="Project Not Found" />
          <div className="terminal-body min-h-[500px] flex flex-col items-center justify-center">
            <p className="text-terminal-error mb-4">Project with ID {projectId} not found.</p>
            <Link to="/projects" className="bg-terminal-dim hover:bg-terminal-accent hover:text-black text-terminal-text px-4 py-2 rounded transition-colors flex items-center">
              <ArrowLeft size={16} className="mr-2" />
              Return to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get all mentors in an array for easier rendering
  const mentors = [
    project.mentor,
    project.mentor2,
    project.mentor3
  ].filter(Boolean);

  // Determine header text and category badge style based on category
  let headerText = `Project: ${project.name}`;
  let categoryLabel = '';
  let categoryClass = '';
  let footerLabel = undefined; // Default footer text
  let showRaidLogo = false; // Default to not showing RAID logo
  
  // For ongoing projects, show WoC '26
  if (project.status && project.status.toLowerCase() === 'ongoing') {
    categoryLabel = "WoC '26";
    categoryClass = 'bg-blue-600/90 text-white dev-badge';
  } else if (project.category) {
    // Check if category indicates SoC X RAID (could be '1' or text containing 'raid')
    if (project.category === '1' || 
        project.category.toString().toLowerCase().includes('soc x raid') || 
        project.category.toString().toLowerCase().includes('raid')) {
      headerText = `Project: ${project.name} (SoC X RAID)`;
      categoryLabel = 'SoC X RAID';
      categoryClass = 'bg-blue-600/90 text-white ai-badge';
      footerLabel = 'Summer of Code X Summer Of Raid'; // Custom footer text for SoC X RAID
      showRaidLogo = true; // Show RAID logo in footer
    } else {
      categoryLabel = 'Projects Archive';
      categoryClass = 'bg-blue-600/90 text-white dev-badge';
    }
  } else {
    // Default when category is undefined or empty
    categoryLabel = 'Projects Archive';
    categoryClass = 'bg-blue-600/90 text-white dev-badge';
  }

  return (
    <div className="min-h-screen bg-terminal/95 flex flex-col">
      <div className="flex-grow flex flex-col items-center p-4">
        <div className="terminal-window max-w-4xl w-full mx-auto my-8">
          <TerminalHeader title={headerText} />
          <div className="terminal-body min-h-[500px] overflow-y-auto">
            <Link to="/projects" className="flex items-center text-terminal-accent mb-6 hover:underline">
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Link>
            
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-terminal-text mb-1">{project.name}</h1>
                {/* Category badge */}
                {categoryLabel && (
                  <span className={`inline-block mb-3 px-2 py-0.5 rounded text-xs font-semibold ${categoryClass}`}>
                    <span className="relative z-10">{categoryLabel}</span>
                  </span>
                )}
                {/* Status badge */}
                {project.status && (
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      project.status.toLowerCase() === 'completed' ? 'bg-emerald-600/90 text-white' :
                      project.status.toLowerCase() === 'ongoing' ? 'bg-amber-500/90 text-black' :
                      'bg-gray-600/80 text-white'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                )}

                {/* Tabbed view: Overview | Links | Docs | Mentors */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    {(['Overview','Links','Docs','Mentors'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setDetailTab(tab)}
                        className={`px-3 py-1 rounded text-sm ${detailTab === tab ? 'bg-terminal-accent text-black' : 'bg-terminal-dim/20'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="mb-4">
                    {detailTab === 'Overview' && (
                      <div>
                        <h2 className="text-xl text-terminal-text mb-2">{project.status && project.status.toLowerCase() === 'completed' ? 'Summary' : 'Description'}</h2>
                        <div className="text-terminal-dim mb-3">{project.status && project.status.toLowerCase() === 'completed' ? (project.currentDesc || 'No completion summary provided.') : project.description}</div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.techStack && project.techStack.map((tech: string) => (
                            <span key={tech} className="bg-terminal-dim/20 px-2 py-1 text-sm text-terminal-text rounded">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {detailTab === 'Links' && (
                      <div>
                        <h2 className="text-xl text-terminal-text mb-2">Project Links</h2>

                        {/* Project Github (from sheet) */}
                        {project.projectGithub && (
                          <div className="mb-3">
                            <a href={project.projectGithub.startsWith('http') ? project.projectGithub : `https://${project.projectGithub}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-terminal-accent hover:underline">
                              <Github size={16} />
                              <span>Project Github</span>
                            </a>
                          </div>
                        )}

                        <h3 className="text-lg text-terminal-text mb-2">Live Links</h3>
                        {project.liveLinks && project.liveLinks.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            {project.liveLinks.map((link, idx) => {
                              const url = link.startsWith('http') ? link : `https://${link}`;
                              const domain = (() => {
                                try { return new URL(url).hostname; } catch { return link; }
                              })();

                              return (
                                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="border border-terminal-dim p-3 rounded flex items-center gap-3 hover:border-terminal-accent">
                                  <img src={`https://www.google.com/s2/favicons?domain=${domain}`} alt="favicon" className="w-6 h-6" />
                                  <div className="flex-1">
                                    <div className="text-terminal-text font-medium truncate">{domain}</div>
                                    <div className="text-terminal-dim text-sm truncate">{url}</div>
                                  </div>
                                  <ExternalLink className="text-terminal-accent" />
                                </a>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-terminal-dim mb-3">No live links provided.</div>
                        )}
                      </div>
                    )}

                    {detailTab === 'Docs' && (
                      <div>
                        <h2 className="text-xl text-terminal-text mb-3">Project Documentation</h2>
                        {project.projectDoc ? (
                          <div className="space-y-2">
                            <a href={project.projectDoc} className="flex items-center gap-2 text-terminal-accent hover:underline" target="_blank" rel="noopener noreferrer">
                              <FileText size={16} />
                              Project Doc
                            </a>
                          </div>
                        ) : (
                          <div className="text-terminal-dim">No documentation link provided.</div>
                        )}
                      </div>
                    )}

                    {detailTab === 'Mentors' && (
                      <div>
                        <h2 className="text-xl text-terminal-text mb-3">Project Mentors ({mentors.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {renderMentorCard(project.mentor, 1)}
                          {renderMentorCard(project.mentor2, 2)}
                          {renderMentorCard(project.mentor3, 3)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            
            {/* Apply Section - Show for ongoing projects only */}
            {project.status && project.status.toLowerCase() === 'ongoing' && (
              <div className="border-t border-terminal-dim pt-4 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-terminal-dim">Interested in contributing to this project?</p>
                </div>
                <div>
                  <Link 
                    to="/apply" 
                    state={{ selectedProjectId: project.id }}
                    className="bg-terminal-accent hover:bg-terminal-accent/80 text-black font-semibold px-4 py-2 rounded transition-colors flex items-center shadow-lg"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            )}
            {/* For completed projects show Project Github link if available */}
            {project.status && project.status.toLowerCase() === 'completed' && project.projectGithub && (
              <div className="border-t border-terminal-dim pt-4">
                <a href={project.projectGithub.startsWith('http') ? project.projectGithub : `https://${project.projectGithub}`} target="_blank" rel="noopener noreferrer" className="text-terminal-accent hover:underline flex items-center gap-2">
                  <Github size={14} />
                  <span>Project Github</span>
                </a>
              </div>
            )}
            
            </div> {/* Close space-y-6 div */}
          </div>
        </div>
      </div>
      {/* Custom Footer for ProjectDetail with conditional text and logo */}
      <Footer label={footerLabel} showRaidLogo={showRaidLogo} />
    </div>
  );
};

export default ProjectDetail;
