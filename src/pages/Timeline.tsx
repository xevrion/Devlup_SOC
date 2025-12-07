import React from 'react';
import TerminalHeader from '../components/TerminalHeader';
import { Calendar, Clock, CheckCircle2, FileText, Rocket, Award, Flag, LucideIcon } from 'lucide-react';

interface TimelineMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: LucideIcon;
  status?: 'completed' | 'ongoing' | 'upcoming' | 'tentative' | 'na';
  endDate?: string; // For date ranges like "Till 20th December"
}

interface ProgramTimeline {
  name: string;
  milestones: TimelineMilestone[];
}

const Timeline = () => {
  // Function to parse date strings and determine status
  const calculateStatus = (date: string, endDate?: string): 'completed' | 'ongoing' | 'upcoming' | 'tentative' | 'na' => {
    if (date === 'NA' || date === 'Tentative') {
      return date === 'Tentative' ? 'tentative' : 'na';
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Parse "Till 20th December" - end date
    if (date.startsWith('Till ')) {
      const dateStr = date.replace('Till ', '').trim();
      const endDate = parseDate(dateStr);
      if (endDate) {
        if (now > endDate) return 'completed';
        // Check if we're in a reasonable range before the end date (e.g., within 30 days)
        const daysUntil = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil >= 0 && daysUntil <= 30) return 'ongoing';
        return 'upcoming';
      }
    }

    // Parse "Till 4th or 5th January" - use the later date
    if (date.includes(' or ')) {
      const parts = date.replace('Till ', '').split(' or ');
      const laterDate = parts.map(p => parseDate(p.trim())).filter(d => d).sort((a, b) => (b?.getTime() || 0) - (a?.getTime() || 0))[0];
      if (laterDate) {
        if (now > laterDate) return 'completed';
        const daysUntil = Math.ceil((laterDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil >= 0 && daysUntil <= 7) return 'ongoing';
        return 'upcoming';
      }
    }

    // Parse "First week of January" - date range
    if (date.includes('First week of') || date.includes('first week of')) {
      const monthStr = date.replace(/First week of |first week of /i, '').trim();
      const monthDate = parseDate(`1st ${monthStr}`);
      if (monthDate) {
        const weekEnd = new Date(monthDate);
        weekEnd.setDate(weekEnd.getDate() + 7);
        if (now > weekEnd) return 'completed';
        if (now >= monthDate && now <= weekEnd) return 'ongoing';
        return 'upcoming';
      }
    }

    // Parse "Mid March" - approximate to middle of month
    if (date.startsWith('Mid ')) {
      const monthStr = date.replace('Mid ', '').trim();
      const midDate = parseDate(`15th ${monthStr}`);
      if (midDate) {
        if (now > midDate) return 'completed';
        const daysUntil = Math.ceil((midDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil >= 0 && daysUntil <= 14) return 'ongoing';
        return 'upcoming';
      }
    }

    return 'upcoming';
  };

  // Helper function to parse date strings
  const parseDate = (dateStr: string): Date | null => {
    const months: Record<string, number> = {
      'january': 0, 'february': 1, 'march': 2, 'april': 3,
      'may': 4, 'june': 5, 'july': 6, 'august': 7,
      'september': 8, 'october': 9, 'november': 10, 'december': 11
    };

    try {
      // Match patterns like "20th December" or "4th January"
      const match = dateStr.match(/(\d+)(?:st|nd|rd|th)?\s+(\w+)/i);
      if (match) {
        const day = parseInt(match[1]);
        const monthName = match[2].toLowerCase();
        const month = months[monthName];
        if (month !== undefined) {
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth();
          
          // Create date for current year
          let date = new Date(currentYear, month, day);
          
          // If the month has already passed this year, assume it's for next year
          // (e.g., if we're in March and see "January", it's next January)
          if (month < currentMonth) {
            date = new Date(currentYear + 1, month, day);
          }
          
          return date;
        }
      }
    } catch (e) {
      // Ignore parsing errors
    }
    return null;
  };

  const programs: ProgramTimeline[] = [
    {
      name: 'Winter of Code',
      milestones: [
        {
          id: 'woc-proposals',
          title: 'Proposal Submission',
          date: 'Till 20th December',
          endDate: '20th December',
          description: 'We accept proposals from contributors',
          icon: FileText
        },
        {
          id: 'woc-landing',
          title: 'Landing Page Public',
          date: 'Till 4th or 5th January',
          endDate: '5th January',
          description: 'Public landing page will be available',
          icon: Rocket
        },
        {
          id: 'woc-start',
          title: 'Project Work Begins',
          date: 'First week of January',
          description: 'Contributors start working on selected projects',
          icon: CheckCircle2
        },
        {
          id: 'woc-mid',
          title: 'Mid Evaluations',
          date: 'Tentative',
          description: 'Mid-term evaluation of project progress',
          icon: Flag
        },
        {
          id: 'woc-end',
          title: 'Program Ends',
          date: 'Mid March',
          description: 'Winter of Code program concludes',
          icon: Award
        }
      ]
    },
    {
      name: 'Summer of Code',
      milestones: [
        {
          id: 'soc-proposals',
          title: 'Proposal Submission',
          date: 'NA',
          description: 'NA',
          icon: FileText,
          status: 'na'
        },
        {
          id: 'soc-landing',
          title: 'Landing Page Public',
          date: 'NA',
          description: 'NA',
          icon: Rocket,
          status: 'na'
        },
        {
          id: 'soc-start',
          title: 'Project Work Begins',
          date: 'NA',
          description: 'NA',
          icon: CheckCircle2,
          status: 'na'
        },
        {
          id: 'soc-mid',
          title: 'Mid Evaluations',
          date: 'NA',
          description: 'NA',
          icon: Flag,
          status: 'na'
        },
        {
          id: 'soc-end',
          title: 'Program Ends',
          date: 'NA',
          description: 'NA',
          icon: Award,
          status: 'na'
        }
      ]
    }
  ];

  const getStatusColor = (status: 'completed' | 'ongoing' | 'upcoming' | 'tentative' | 'na') => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ongoing':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'upcoming':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'tentative':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'na':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: 'completed' | 'ongoing' | 'upcoming' | 'tentative' | 'na') => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'ongoing':
        return 'Ongoing';
      case 'upcoming':
        return 'Upcoming';
      case 'tentative':
        return 'Tentative';
      case 'na':
        return 'TBA';
      default:
        return 'TBA';
    }
  };

  return (
    <div className="min-h-screen bg-terminal/95 flex flex-col items-center p-2 sm:p-4">
      <div className="terminal-window max-w-7xl w-full mx-auto my-4 sm:my-8">
        <TerminalHeader title="Program Timeline" />
        <div className="terminal-body min-h-[500px] overflow-y-auto p-4 sm:p-6">
          <div className="space-y-12 sm:space-y-16">
            {/* Header Section */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 bg-terminal-accent/10 rounded-lg flex-shrink-0">
                <Calendar className="text-terminal-accent w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-terminal-text break-words">Program Timeline</h1>
                <p className="text-xs sm:text-sm md:text-base text-terminal-dim mt-1 break-words">
                  Important dates and milestones for our programs
                </p>
              </div>
            </div>

            {/* Program Timelines */}
            {programs.map((program, programIndex) => (
              <div key={programIndex} className="relative">
                <div>
                  {/* Program Header */}
                  <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                      <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-terminal-text break-words">{program.name}</h2>
                    </div>
                    <div className="h-0.5 w-16 sm:w-24 bg-gradient-to-r from-terminal-accent to-transparent mt-2"></div>
                  </div>

                  {/* Milestones */}
                  <div className="relative">
                    <div className="space-y-4 sm:space-y-6">
                      {program.milestones.map((milestone, milestoneIndex) => {
                        const Icon = milestone.icon;
                        const status = milestone.status || calculateStatus(milestone.date, milestone.endDate);
                        const isLast = milestoneIndex === program.milestones.length - 1;
                        
                        return (
                          <div key={milestone.id} className="relative flex gap-3 sm:gap-4 md:gap-6">
                            {/* Vertical connector line from this milestone icon to the next */}
                            {!isLast && (
                              <div className="absolute left-[20px] sm:left-6 top-10 sm:top-12 w-0.5 h-full bg-terminal-dim/30 z-0"></div>
                            )}
                            
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-colors relative z-20 bg-terminal ${
                              status === 'na' 
                                ? 'border border-terminal-dim' 
                                : status === 'completed'
                                ? 'border border-emerald-500'
                                : status === 'ongoing'
                                ? 'border border-cyan-500'
                                : 'border border-terminal-accent'
                            }`}>
                              <Icon 
                                size={18} 
                                className={`sm:w-5 sm:h-5 ${
                                  status === 'na' ? 'text-terminal-dim' : 
                                  status === 'completed' ? 'text-emerald-400' :
                                  status === 'ongoing' ? 'text-cyan-400' :
                                  'text-terminal-accent'
                                }`}
                              />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 pb-4 sm:pb-6 min-w-0 relative z-10">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-terminal-text mb-1 break-words">
                                    {milestone.title}
                                  </h3>
                                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
                                    <Clock size={12} className="text-terminal-dim sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                    <span className={`text-xs sm:text-sm font-medium break-words ${
                                      milestone.date === 'NA' ? 'text-terminal-dim' : 'text-terminal-accent'
                                    }`}>
                                      {milestone.date}
                                    </span>
                                  </div>
                                </div>
                                <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getStatusColor(status)}`}>
                                  {getStatusLabel(status)}
                                </span>
                              </div>
                              <p className={`text-xs sm:text-sm break-words ${
                                milestone.description === 'NA' ? 'text-terminal-dim italic' : 'text-terminal-dim'
                              }`}>
                                {milestone.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

