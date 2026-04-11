import { useMemo } from "react";
import { motion } from "framer-motion";
import { useStudentStore, StudentProfile } from "@/store/useStudentStore";
import {
  Lightbulb, BookOpen, Rocket, MapPin, Star, ArrowRight, Shield,
  TrendingUp, Laptop, Database, Cloud, Globe, Palette, BarChart3,
  GraduationCap, Target, CheckCircle2, AlertCircle, XCircle
} from "lucide-react";

// Career path matching based on skills
const careerPaths = [
  { title: "Frontend Developer", match: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Vue", "Angular", "Next.js", "Tailwind"], icon: Laptop, salary: "$70K–$120K", demand: "🔥 Very High" },
  { title: "Backend Developer", match: ["Node.js", "Python", "Java", "Go", "Express", "Django", "Spring", "FastAPI", "REST"], icon: Database, salary: "$75K–$130K", demand: "🔥 Very High" },
  { title: "Full Stack Developer", match: ["React", "Node.js", "TypeScript", "MongoDB", "PostgreSQL", "Express", "Next.js"], icon: Rocket, salary: "$80K–$140K", demand: "🔥 Very High" },
  { title: "Data Scientist", match: ["Python", "Machine Learning", "TensorFlow", "Pandas", "NumPy", "R", "Statistics", "SQL", "Data Analysis"], icon: BarChart3, salary: "$85K–$150K", demand: "📈 High" },
  { title: "Cloud Engineer", match: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Linux", "DevOps", "CI/CD"], icon: Cloud, salary: "$90K–$150K", demand: "📈 High" },
  { title: "Cybersecurity Analyst", match: ["Security", "Networking", "Linux", "Python", "Ethical Hacking", "SIEM", "Penetration Testing"], icon: Shield, salary: "$80K–$140K", demand: "📈 High" },
  { title: "UI/UX Designer", match: ["Figma", "Design", "UI", "UX", "Sketch", "Adobe", "CSS", "Prototyping"], icon: Palette, salary: "$65K–$120K", demand: "📈 High" },
  { title: "Mobile Developer", match: ["React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android", "Mobile"], icon: Globe, salary: "$75K–$135K", demand: "📈 High" },
];

// Skill recommendations based on current skills
const skillRecommendations: Record<string, string[]> = {
  "React": ["Next.js", "TypeScript", "Redux", "Testing Library"],
  "Python": ["Django", "FastAPI", "Machine Learning", "Data Analysis"],
  "JavaScript": ["TypeScript", "React", "Node.js", "Testing"],
  "TypeScript": ["Next.js", "Prisma", "tRPC", "Zod"],
  "Node.js": ["Express", "PostgreSQL", "Redis", "Docker"],
  "Java": ["Spring Boot", "Microservices", "AWS", "Kubernetes"],
  "SQL": ["PostgreSQL", "MongoDB", "Redis", "Database Design"],
  "AWS": ["Docker", "Kubernetes", "Terraform", "CI/CD"],
};

function getCareerGuidance(profile: StudentProfile, score: number) {
  const skillNames = profile.skills.map(s => s.name.toLowerCase());
  const skillsAvg = profile.skills.length > 0 ? profile.skills.reduce((a, s) => a + s.level, 0) / profile.skills.length : 0;

  // Match career paths
  const matchedPaths = careerPaths.map(path => {
    const matchCount = path.match.filter(m => skillNames.some(s => s.includes(m.toLowerCase()) || m.toLowerCase().includes(s))).length;
    const matchPct = path.match.length > 0 ? Math.round((matchCount / Math.min(path.match.length, 4)) * 100) : 0;
    return { ...path, matchPct: Math.min(matchPct, 100), matchCount };
  }).filter(p => p.matchCount > 0).sort((a, b) => b.matchPct - a.matchPct).slice(0, 3);

  // Suggest skills to learn
  const suggestedSkills: string[] = [];
  profile.skills.forEach(s => {
    const recs = skillRecommendations[s.name];
    if (recs) {
      recs.forEach(r => {
        if (!skillNames.includes(r.toLowerCase()) && !suggestedSkills.includes(r)) {
          suggestedSkills.push(r);
        }
      });
    }
  });

  // Accuracy breakdown
  const cgpaAccuracy = Math.round((profile.cgpa / 10) * 100);
  const skillsAccuracy = Math.round(skillsAvg);
  const projectsAccuracy = Math.min(profile.projects.length * 25, 100);
  const internshipAccuracy = Math.min(profile.internships.length * 35, 100);
  const certAccuracy = Math.min(profile.certificates.length * 20, 100);
  const resumeAccuracy = profile.resumeCompleteness;

  // Weakest areas (sorted)
  const areas = [
    { name: "CGPA", score: cgpaAccuracy, weight: 25 },
    { name: "Skills", score: skillsAccuracy, weight: 20 },
    { name: "Projects", score: projectsAccuracy, weight: 15 },
    { name: "Internships", score: internshipAccuracy, weight: 20 },
    { name: "Certifications", score: certAccuracy, weight: 10 },
    { name: "Resume", score: resumeAccuracy, weight: 10 },
  ].sort((a, b) => a.score - b.score);

  const weakest = areas.filter(a => a.score < 60);
  const strongest = areas.filter(a => a.score >= 70).sort((a, b) => b.score - a.score);

  // Action items with priority
  const actions: { text: string; priority: "critical" | "important" | "nice"; impact: string }[] = [];

  if (profile.internships.length === 0) actions.push({ text: "Apply for at least 1 internship in your target domain immediately", priority: "critical", impact: "+20-35 points" });
  if (profile.projects.length < 3) actions.push({ text: `Build ${3 - profile.projects.length} more real-world project${3 - profile.projects.length > 1 ? "s" : ""} with documentation and live demos`, priority: "critical", impact: `+${(3 - profile.projects.length) * 10}-${(3 - profile.projects.length) * 15} points` });
  if (skillsAvg < 60) actions.push({ text: "Dedicate 2 hours daily to deepening your weakest skills to 70%+ proficiency", priority: "critical", impact: "+10-20 points" });
  if (profile.resumeCompleteness < 70) actions.push({ text: "Complete your resume: add quantified achievements, action verbs, and clean formatting", priority: "important", impact: `+${Math.round((70 - profile.resumeCompleteness) * 0.1 * 3)}-${Math.round((70 - profile.resumeCompleteness) * 0.1 * 5)} points` });
  if (profile.certificates.length < 3) actions.push({ text: "Earn 1-2 industry certifications (AWS, Google, Meta, or Coursera specializations)", priority: "important", impact: "+5-10 points" });
  if (profile.skills.length < 5) actions.push({ text: `Learn ${5 - profile.skills.length} more in-demand skills relevant to your career path`, priority: "important", impact: "+5-15 points" });
  if (profile.hackathons.length === 0) actions.push({ text: "Participate in at least 1 hackathon to build teamwork and rapid prototyping skills", priority: "nice", impact: "+5-10 points" });
  if (profile.languages.filter(l => l.proficiency >= 70).length < 2) actions.push({ text: "Improve communication: aim for 70%+ proficiency in at least 2 languages", priority: "nice", impact: "Soft skill boost" });
  if (score >= 70 && profile.projects.length >= 3) actions.push({ text: "Contribute to open-source projects on GitHub to build credibility", priority: "nice", impact: "Portfolio boost" });
  if (score >= 70) actions.push({ text: "Start applying for jobs and practice coding interviews (LeetCode, HackerRank)", priority: "important", impact: "Direct hire path" });

  // Monthly roadmap
  const months: { month: string; tasks: string[] }[] = [];
  if (score < 40) {
    months.push({ month: "Month 1-2", tasks: ["Learn 3 core skills (pick from suggestions below)", "Start 1 portfolio project", "Build your resume draft"] });
    months.push({ month: "Month 3-4", tasks: ["Complete 2 projects with live demos", "Apply for internships", "Earn 1 certification"] });
    months.push({ month: "Month 5-6", tasks: ["Complete internship or freelance work", "Polish resume to 90%+", "Start applying for full-time roles"] });
  } else if (score < 70) {
    months.push({ month: "Month 1", tasks: ["Fill weakest areas (see below)", "Add 1-2 more projects", "Update resume with achievements"] });
    months.push({ month: "Month 2", tasks: ["Get internship/freelance experience", "Earn a certification", "Practice interview questions"] });
    months.push({ month: "Month 3", tasks: ["Apply actively for jobs", "Network on LinkedIn", "Prepare for technical interviews"] });
  } else {
    months.push({ month: "Week 1-2", tasks: ["Polish resume and LinkedIn profile", "Start applying for target roles", "Practice system design interviews"] });
    months.push({ month: "Week 3-4", tasks: ["Follow up on applications", "Continue LeetCode practice", "Attend networking events"] });
  }

  return { matchedPaths, suggestedSkills: suggestedSkills.slice(0, 8), weakest, strongest, actions, months, areas };
}

export default function CareerGuidancePage() {
  const { profile, getReadinessScore } = useStudentStore();
  const score = getReadinessScore();

  const guidance = useMemo(() => getCareerGuidance(profile, score), [profile, score]);

  const priorityConfig = {
    critical: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "🔴 Critical" },
    important: { icon: AlertCircle, color: "text-score-good", bg: "bg-score-good/10", label: "🟡 Important" },
    nice: { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10", label: "🟢 Nice to Have" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="gradient-hero rounded-2xl p-8 text-primary-foreground">
        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight flex items-center gap-3">
          🧭 Career Guidance & Suggestions
        </h1>
        <p className="mt-2 text-sm opacity-80 max-w-2xl">
          Personalized, data-driven career roadmap based on your profile analysis. Accuracy reflects how complete each area of your profile is.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="px-4 py-2 rounded-full bg-primary-foreground/10 text-sm font-bold">
            🎯 Score: {score}/100
          </div>
          <div className="px-4 py-2 rounded-full bg-primary-foreground/10 text-sm font-bold">
            📊 Profile Accuracy: {Math.round((
              (profile.about.length > 10 ? 1 : 0) +
              (profile.skills.length >= 3 ? 1 : 0) +
              (profile.projects.length >= 1 ? 1 : 0) +
              (profile.internships.length >= 1 ? 1 : 0) +
              (profile.certificates.length >= 1 ? 1 : 0) +
              (profile.resumeCompleteness >= 50 ? 1 : 0) +
              (profile.cgpa > 0 ? 1 : 0) +
              (profile.languages.length >= 1 ? 1 : 0)
            ) / 8 * 100)}% Complete
          </div>
        </div>
      </motion.div>

      {/* Accuracy Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h2 className="section-title text-lg mb-4 flex items-center gap-2">📊 Area-wise Accuracy Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {guidance.areas.map((area, i) => (
            <motion.div key={area.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-black text-sm ${
                area.score >= 70 ? "bg-score-excellent/15 text-score-excellent" : area.score >= 40 ? "bg-score-good/15 text-score-good" : "bg-score-low/15 text-score-low"
              }`}>
                {area.score}%
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">{area.name}</span>
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{area.weight}% weight</span>
                </div>
                <div className="progress-track mt-1">
                  <motion.div className="progress-fill" style={{ background: area.score >= 70 ? "hsl(var(--score-excellent))" : area.score >= 40 ? "hsl(var(--score-good))" : "hsl(var(--score-low))" }}
                    initial={{ width: 0 }} animate={{ width: `${area.score}%` }} transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {guidance.weakest.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/10 text-sm">
            <strong className="text-destructive">⚠️ Weakest Areas:</strong>{" "}
            {guidance.weakest.map(w => `${w.name} (${w.score}%)`).join(", ")} — Improving these will have the highest impact on your score.
          </div>
        )}
      </motion.div>

      {/* Matching Career Paths */}
      {guidance.matchedPaths.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h2 className="section-title text-lg mb-4 flex items-center gap-2">🚀 Recommended Career Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guidance.matchedPaths.map((path, i) => (
              <motion.div key={path.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 + i * 0.08 }}
                className="glass-card-hover p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-[10px] font-bold gradient-primary text-primary-foreground">
                  {path.matchPct}% Match
                </div>
                <path.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-display font-bold text-base">{path.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">💰 {path.salary}</p>
                <p className="text-xs text-muted-foreground">{path.demand}</p>
                <div className="progress-track mt-3">
                  <motion.div className="progress-fill" style={{ background: "hsl(var(--primary))" }}
                    initial={{ width: 0 }} animate={{ width: `${path.matchPct}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1 }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h2 className="section-title text-lg mb-4 flex items-center gap-2">✅ Prioritized Action Plan</h2>
        <div className="space-y-2">
          {guidance.actions.map((action, i) => {
            const config = priorityConfig[action.priority];
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.06 }}
                className={`flex items-start gap-3 p-4 rounded-xl ${config.bg}`}>
                <config.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{action.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{config.label}</span>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Impact: {action.impact}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Monthly Roadmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <h2 className="section-title text-lg mb-4 flex items-center gap-2">🗓️ Your Personalized Roadmap</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guidance.months.map((m, i) => (
            <motion.div key={m.month} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.1 }}
              className="relative p-5 rounded-xl bg-muted/50 border border-border/50">
              <div className="absolute -top-3 left-4 px-3 py-1 rounded-full gradient-primary text-primary-foreground text-xs font-bold">
                {m.month}
              </div>
              <ul className="mt-3 space-y-2">
                {m.tasks.map((task, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Suggested Skills */}
      {guidance.suggestedSkills.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h2 className="section-title text-lg mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-score-good" /> Skills You Should Learn Next
          </h2>
          <p className="text-sm text-muted-foreground mb-3">Based on your current skills, these will maximize your career readiness:</p>
          <div className="flex flex-wrap gap-2">
            {guidance.suggestedSkills.map((skill, i) => (
              <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 + i * 0.04 }}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-score-good/10 text-score-good border border-score-good/20 flex items-center gap-1.5">
                <Star className="w-3 h-3" /> {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Strengths */}
      {guidance.strongest.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="gradient-accent rounded-2xl p-6 text-accent-foreground">
          <h2 className="font-display font-black text-lg mb-3">💪 Your Strengths</h2>
          <div className="flex flex-wrap gap-2">
            {guidance.strongest.map(s => (
              <span key={s.name} className="px-3 py-1.5 rounded-full bg-accent-foreground/10 text-sm font-bold">
                ✅ {s.name}: {s.score}%
              </span>
            ))}
          </div>
          <p className="text-sm mt-3 opacity-90">
            Leverage these strengths in your resume and interviews. Highlight them prominently when applying for roles.
          </p>
        </motion.div>
      )}

      {/* Learning Resources */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
        <h2 className="section-title text-lg mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Recommended Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: "LeetCode", desc: "Practice coding challenges for technical interviews", tag: "Interviews", emoji: "💻" },
            { title: "Coursera / Udemy", desc: "Industry certifications and skill courses", tag: "Learning", emoji: "📚" },
            { title: "GitHub", desc: "Build public portfolio with open-source contributions", tag: "Portfolio", emoji: "🐙" },
            { title: "LinkedIn Learning", desc: "Professional development and soft skills", tag: "Networking", emoji: "🔗" },
            { title: "HackerRank", desc: "Practice problems and compete in coding challenges", tag: "Practice", emoji: "🏆" },
            { title: "Internshala / AngelList", desc: "Find internships and startup opportunities", tag: "Jobs", emoji: "🚀" },
          ].map((r, i) => (
            <motion.div key={r.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 + i * 0.05 }}
              className="p-4 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{r.emoji}</span>
                <h4 className="font-bold text-sm">{r.title}</h4>
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">{r.tag}</span>
              </div>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
