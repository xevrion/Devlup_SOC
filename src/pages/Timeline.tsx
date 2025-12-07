import React from "react";
import TerminalHeader from "../components/TerminalHeader";
import {
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Rocket,
  Award,
  Flag,
  LucideIcon,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { getTheme, themes } from "../config/themes";

interface TimelineMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: LucideIcon;
  status?: "completed" | "ongoing" | "upcoming" | "tentative" | "na";
  endDate?: string;
}

interface ProgramTimeline {
  name: string;
  milestones: TimelineMilestone[];
}

const Timeline = () => {
  // Function to parse date strings and determine status
  const calculateStatus = (
    date: string,
    endDate?: string
  ): "completed" | "ongoing" | "upcoming" | "tentative" | "na" => {
    if (date === "NA" || date === "Tentative") {
      return date === "Tentative" ? "tentative" : "na";
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (date.startsWith("Till ")) {
      const dateStr = date.replace("Till ", "").trim();
      const endDate = parseDate(dateStr);
      if (endDate) {
        if (now > endDate) return "completed";
        const daysUntil = Math.ceil(
          (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntil >= 0 && daysUntil <= 30) return "ongoing";
        return "upcoming";
      }
    }

    if (date.includes(" or ")) {
      const parts = date.replace("Till ", "").split(" or ");
      const laterDate = parts
        .map((p) => parseDate(p.trim()))
        .filter((d) => d)
        .sort((a, b) => (b?.getTime() || 0) - (a?.getTime() || 0))[0];
      if (laterDate) {
        if (now > laterDate) return "completed";
        const daysUntil = Math.ceil(
          (laterDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntil >= 0 && daysUntil <= 7) return "ongoing";
        return "upcoming";
      }
    }

    if (date.includes("First week of") || date.includes("first week of")) {
      const monthStr = date
        .replace(/First week of |first week of /i, "")
        .trim();
      const monthDate = parseDate(`1st ${monthStr}`);
      if (monthDate) {
        const weekEnd = new Date(monthDate);
        weekEnd.setDate(weekEnd.getDate() + 7);
        if (now > weekEnd) return "completed";
        if (now >= monthDate && now <= weekEnd) return "ongoing";
        return "upcoming";
      }
    }

    if (date.startsWith("Mid ")) {
      const monthStr = date.replace("Mid ", "").trim();
      const midDate = parseDate(`15th ${monthStr}`);
      if (midDate) {
        if (now > midDate) return "completed";
        const daysUntil = Math.ceil(
          (midDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntil >= 0 && daysUntil <= 14) return "ongoing";
        return "upcoming";
      }
    }

    return "upcoming";
  };

  const parseDate = (dateStr: string): Date | null => {
    const months: Record<string, number> = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    };

    try {
      const match = dateStr.match(/(\d+)(?:st|nd|rd|th)?\s+(\w+)/i);
      if (match) {
        const day = parseInt(match[1]);
        const monthName = match[2].toLowerCase();
        const month = months[monthName];
        if (month !== undefined) {
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth();

          let date = new Date(currentYear, month, day);

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
      name: "Winter of Code",
      milestones: [
        {
          id: "woc-proposals",
          title: "Proposal Submission",
          date: "Till 20th December",
          endDate: "20th December",
          description: "We accept proposals from contributors",
          icon: FileText,
        },
        {
          id: "woc-landing",
          title: "Landing Page Public",
          date: "Till 4th or 5th January",
          endDate: "5th January",
          description: "Public landing page will be available",
          icon: Rocket,
        },
        {
          id: "woc-start",
          title: "Project Work Begins",
          date: "First week of January",
          description: "Contributors start working on selected projects",
          icon: CheckCircle2,
        },
        {
          id: "woc-mid",
          title: "Mid Evaluations",
          date: "Tentative",
          description: "Mid-term evaluation of project progress",
          icon: Flag,
        },
        {
          id: "woc-end",
          title: "Program Ends",
          date: "Mid March",
          description: "Winter of Code program concludes",
          icon: Award,
        },
      ],
    },
    {
      name: "Summer of Code",
      milestones: [
        {
          id: "soc-proposals",
          title: "Proposal Submission",
          date: "NA",
          description: "NA",
          icon: FileText,
          status: "na",
        },
        {
          id: "soc-landing",
          title: "Landing Page Public",
          date: "NA",
          description: "NA",
          icon: Rocket,
          status: "na",
        },
        {
          id: "soc-start",
          title: "Project Work Begins",
          date: "NA",
          description: "NA",
          icon: CheckCircle2,
          status: "na",
        },
        {
          id: "soc-mid",
          title: "Mid Evaluations",
          date: "NA",
          description: "NA",
          icon: Flag,
          status: "na",
        },
        {
          id: "soc-end",
          title: "Program Ends",
          date: "NA",
          description: "NA",
          icon: Award,
          status: "na",
        },
      ],
    },
  ];

  // Get current theme
  const currentTheme = getTheme();
  const theme = themes[currentTheme];
  const isWinter = currentTheme === 1;
  const isSummer = currentTheme === 2;

  // Theme-aware color scheme
  const getStatusColor = (
    status: "completed" | "ongoing" | "upcoming" | "tentative" | "na"
  ) => {
    if (isWinter) {
      // Winter theme: Blue/white colors
      switch (status) {
        case "completed":
          return "bg-blue-500/20 text-blue-300 border-blue-400/30";
        case "ongoing":
          return "bg-cyan-400/20 text-cyan-300 border-cyan-400/30";
        case "upcoming":
          return "bg-sky-400/20 text-sky-300 border-sky-400/30";
        case "tentative":
          return "bg-indigo-400/20 text-indigo-300 border-indigo-400/30";
        case "na":
          return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        default:
          return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      }
    } else {
      // Summer/Default theme: Green colors
      switch (status) {
        case "completed":
          return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        case "ongoing":
          return "bg-green-500/20 text-green-400 border-green-500/30";
        case "upcoming":
          return "bg-lime-500/20 text-lime-400 border-lime-500/30";
        case "tentative":
          return "bg-teal-500/20 text-teal-400 border-teal-500/30";
        case "na":
          return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        default:
          return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      }
    }
  };

  const getStatusLabel = (
    status: "completed" | "ongoing" | "upcoming" | "tentative" | "na"
  ) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "ongoing":
        return "Ongoing";
      case "upcoming":
        return "Upcoming";
      case "tentative":
        return "Tentative";
      case "na":
        return "TBA";
      default:
        return "TBA";
    }
  };

  const getStatusIconColor = (
    status: "completed" | "ongoing" | "upcoming" | "tentative" | "na"
  ) => {
    if (isWinter) {
      // Winter theme: Blue/white colors
      switch (status) {
        case "completed":
          return "text-blue-300 border-blue-400";
        case "ongoing":
          return "text-cyan-300 border-cyan-400";
        case "upcoming":
          return "text-sky-300 border-sky-400";
        case "tentative":
          return "text-indigo-300 border-indigo-400";
        case "na":
          return "text-gray-400 border-gray-500";
        default:
          return "text-gray-400 border-gray-500";
      }
    } else {
      // Summer/Default theme: Green colors
      switch (status) {
        case "completed":
          return "text-emerald-400 border-emerald-500";
        case "ongoing":
          return "text-green-400 border-green-500";
        case "upcoming":
          return "text-lime-400 border-lime-500";
        case "tentative":
          return "text-teal-400 border-teal-500";
        case "na":
          return "text-gray-400 border-gray-500";
        default:
          return "text-gray-400 border-gray-500";
      }
    }
  };

  const getStatusBorderColor = (
    status: "completed" | "ongoing" | "upcoming" | "tentative" | "na"
  ) => {
    if (isWinter) {
      switch (status) {
        case "completed":
          return "rgb(96, 165, 250)"; // blue-400
        case "ongoing":
          return "rgb(103, 232, 249)"; // cyan-400
        case "upcoming":
          return "rgb(125, 211, 252)"; // sky-400
        case "tentative":
          return "rgb(129, 140, 248)"; // indigo-400
        default:
          return "rgb(107, 114, 128)"; // gray-500
      }
    } else {
      switch (status) {
        case "completed":
          return "rgb(16, 185, 129)"; // emerald-500
        case "ongoing":
          return "rgb(34, 197, 94)"; // green-500
        case "upcoming":
          return "rgb(132, 204, 22)"; // lime-500
        case "tentative":
          return "rgb(20, 184, 166)"; // teal-500
        default:
          return "rgb(107, 114, 128)"; // gray-500
      }
    }
  };

  const getStatusGlowColor = (
    status: "completed" | "ongoing" | "upcoming" | "tentative" | "na"
  ) => {
    if (isWinter) {
      switch (status) {
        case "completed":
          return "rgba(96, 165, 250, 0.5)"; // blue-400
        case "ongoing":
          return "rgba(103, 232, 249, 0.5)"; // cyan-400
        case "upcoming":
          return "rgba(125, 211, 252, 0.5)"; // sky-400
        case "tentative":
          return "rgba(129, 140, 248, 0.5)"; // indigo-400
        default:
          return "rgba(107, 114, 128, 0.3)";
      }
    } else {
      switch (status) {
        case "completed":
          return "rgba(52, 211, 153, 0.5)"; // emerald-400
        case "ongoing":
          return "rgba(74, 222, 128, 0.5)"; // green-400
        case "upcoming":
          return "rgba(163, 230, 53, 0.5)"; // lime-400
        case "tentative":
          return "rgba(45, 212, 191, 0.5)"; // teal-400
        default:
          return "rgba(107, 114, 128, 0.3)";
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-terminal/95 flex flex-col items-center p-2 sm:p-4">
      <div className="terminal-window max-w-7xl w-full mx-auto my-4 sm:my-8">
        <TerminalHeader title="Program Timeline" />
        <div className="terminal-body min-h-[500px] overflow-y-auto p-4 sm:p-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-16"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-2 bg-terminal-accent/10 rounded-lg"
              >
                <Calendar className="text-terminal-accent w-6 h-6 sm:w-8 sm:h-8" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-terminal-text">
                  Program Timeline
                </h1>
                <p className="text-sm sm:text-base text-terminal-dim mt-1">
                  Important dates and milestones for our programs
                </p>
              </div>
            </motion.div>

            {/* Programs */}
            {programs.map((program, programIndex) => {
              return (
                <motion.div
                  key={programIndex}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Program Title */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: programIndex * 0.2 }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold text-terminal-text mb-2">
                      {program.name}
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-terminal-accent to-transparent rounded-full" />
                  </motion.div>

                  {/* Show Coming Soon for Summer of Code */}
                  {program.name === "Summer of Code" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: programIndex * 0.2 + 0.3 }}
                      className="flex flex-col items-center justify-center py-16 lg:py-24"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="inline-block mb-6"
                        >
                          <div className="w-24 h-24 rounded-full bg-terminal-accent/10 border-2 border-terminal-accent/30 flex items-center justify-center">
                            <Calendar className="text-terminal-accent w-12 h-12" />
                          </div>
                        </motion.div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-terminal-text mb-3">
                          Coming Soon
                        </h3>
                        <p className="text-terminal-dim text-lg">
                          Timeline will be announced soon
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      {/* Mobile: Vertical Timeline */}
                      <div className="lg:hidden space-y-6">
                        {program.milestones.map((milestone, milestoneIndex) => {
                      const Icon = milestone.icon;
                      const status =
                        milestone.status ||
                        calculateStatus(milestone.date, milestone.endDate);
                      const isLast =
                        milestoneIndex === program.milestones.length - 1;

                      return (
                        <motion.div
                          key={milestone.id}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: milestoneIndex * 0.1,
                            duration: 0.5,
                          }}
                          className="relative flex gap-4"
                        >
                          {!isLast && (
                            <div className="absolute left-6 top-12 w-0.5 h-full bg-terminal-dim/30" />
                          )}

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-terminal border-2 ${getStatusIconColor(
                              status
                            )} relative z-10`}
                          >
                            <Icon size={20} className={getStatusIconColor(status).split(" ")[0]} />
                          </motion.div>

                          <div className="flex-1 pb-6">
                            <div
                              className={`bg-terminal/80 backdrop-blur-sm border ${getStatusColor(
                                status
                              )} rounded-lg p-4`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-lg font-bold text-terminal-text">
                                  {milestone.title}
                                </h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getStatusColor(
                                    status
                                  )}`}
                                >
                                  {getStatusLabel(status)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <Clock size={14} className="text-terminal-dim" />
                                <span
                                  className={`text-sm ${
                                    milestone.date === "NA"
                                      ? "text-terminal-dim"
                                      : "text-terminal-accent"
                                  }`}
                                >
                                  {milestone.date}
                                </span>
                              </div>
                              <p
                                className={`text-sm ${
                                  milestone.description === "NA"
                                    ? "text-terminal-dim italic"
                                    : "text-terminal-dim"
                                }`}
                              >
                                {milestone.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Desktop: Horizontal Timeline */}
                  <div className="hidden lg:block relative py-24 min-h-[500px]">
                    {/* Connecting line through all nodes */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="absolute top-1/2 left-8 right-8 h-[2px] bg-terminal-dim/60 origin-left z-0"
                      style={{ transformOrigin: "left center" }}
                    />

                    {/* Milestones with proper spacing */}
                    <div className="relative flex items-center justify-between w-full px-8 gap-4">
                      {program.milestones.map((milestone, index) => {
                        const Icon = milestone.icon;
                        const status =
                          milestone.status ||
                          calculateStatus(milestone.date, milestone.endDate);
                        const total = program.milestones.length;
                        const delay = 0.4 + index * 0.15;

                        return (
                          <React.Fragment key={milestone.id}>
                            <div className="flex flex-col items-center flex-1 relative z-10">
                              {/* Top Card */}
                              <motion.div
                                initial={{ opacity: 0, y: -30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay, duration: 0.4 }}
                                whileHover={{ y: -6 }}
                                className="mb-8 w-full max-w-[220px]"
                              >
                                <div
                                  className={`bg-terminal/90 backdrop-blur-sm border ${getStatusColor(
                                    status
                                  )} rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300`}
                                >
                                  <h3 className="text-base font-bold text-terminal-text mb-2">
                                    {milestone.title}
                                  </h3>
                                  <p
                                    className={`text-sm leading-relaxed ${
                                      milestone.description === "NA"
                                        ? "text-terminal-dim italic"
                                        : "text-terminal-dim"
                                    }`}
                                  >
                                    {milestone.description}
                                  </p>
                                </div>
                              </motion.div>

                              {/* Center Node - on the line */}
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.15, rotate: 5 }}
                                transition={{
                                  delay: delay + 0.1,
                                  duration: 0.5,
                                  type: "spring",
                                  stiffness: 200,
                                }}
                                className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center bg-terminal border-2 shadow-xl relative z-20"
                                style={{
                                  borderColor: getStatusBorderColor(status),
                                }}
                              >
                                {/* Glow effect */}
                                <motion.div
                                  animate={{
                                    boxShadow: [
                                      `0 0 20px ${getStatusGlowColor(status)}`,
                                      `0 0 30px ${getStatusGlowColor(status).replace("0.5", "0.3")}`,
                                      `0 0 20px ${getStatusGlowColor(status)}`,
                                    ],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                  className={`absolute inset-0 rounded-full blur-xl ${
                                    isWinter
                                      ? status === "completed"
                                        ? "bg-blue-400/30"
                                        : status === "ongoing"
                                        ? "bg-cyan-400/30"
                                        : status === "upcoming"
                                        ? "bg-sky-400/30"
                                        : status === "tentative"
                                        ? "bg-indigo-400/30"
                                        : "bg-gray-500/20"
                                      : status === "completed"
                                      ? "bg-emerald-500/30"
                                      : status === "ongoing"
                                      ? "bg-green-500/30"
                                      : status === "upcoming"
                                      ? "bg-lime-500/30"
                                      : status === "tentative"
                                      ? "bg-teal-500/30"
                                      : "bg-gray-500/20"
                                  }`}
                                />

                                <Icon
                                  size={28}
                                  className={`relative z-10 ${
                                    getStatusIconColor(status).split(" ")[0]
                                  }`}
                                />
                              </motion.div>

                              {/* Bottom date + status */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: delay + 0.2, duration: 0.4 }}
                                className="flex flex-col items-center gap-2 mt-8"
                              >
                                <div className="flex items-center gap-2">
                                  <Clock size={14} className="text-terminal-dim" />
                                  <span
                                    className={`text-sm font-medium ${
                                      milestone.date === "NA"
                                        ? "text-terminal-dim"
                                        : "text-terminal-accent"
                                    }`}
                                  >
                                    {milestone.date}
                                  </span>
                                </div>

                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                    status
                                  )}`}
                                >
                                  {getStatusLabel(status)}
                                </span>
                              </motion.div>
                            </div>

                            {/* Arrow between nodes */}
                            {index < total - 1 && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: delay + 0.3,
                                  duration: 0.4,
                                }}
                                className="flex-shrink-0 z-10"
                              >
                                <ArrowRight
                                  size={20}
                                  className="text-terminal-dim/60"
                                />
                              </motion.div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                    </>
                  )}

                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
