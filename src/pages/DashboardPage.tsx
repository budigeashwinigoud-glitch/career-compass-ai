import { motion } from "framer-motion";
import { useStudentStore } from "@/store/useStudentStore";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Target, Clock, Zap, AlertTriangle, CheckCircle, ArrowUp } from "lucide-react";

const ScoreRing = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 88;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "var(--score-excellent)" : score >= 40 ? "var(--score-good)" : "var(--score-low)";

  return (
    <div className="relative w-52 h-52 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="88" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <motion.circle
          cx="100" cy="100" r="88" fill="none"
          stroke={`hsl(${color})`}
          strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-display font-bold"
          style={{ color: `hsl(${color})` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {score}
        </motion.span>
        <span className="text-sm text-muted-foreground font-medium">out of 100</span>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { profile, getReadinessScore, getPatternAnalysis, getReadinessLevel } = useStudentStore();
  const score = getReadinessScore();
  const patterns = getPatternAnalysis();
  const level = getReadinessLevel();

  const skillsAvg = profile.skills.length > 0 ? Math.round(profile.skills.reduce((a, s) => a + s.level, 0) / profile.skills.length) : 0;
  const projectsScore = Math.min(profile.projects.length * 25, 100);
  const internshipScore = Math.min(profile.internships.length * 35, 100);
  const certScore = Math.min(profile.certificates.length * 20, 100);

  const radarData = [
    { subject: "Skills", value: skillsAvg },
    { subject: "Projects", value: projectsScore },
    { subject: "Experience", value: internshipScore },
    { subject: "Resume", value: profile.resumeCompleteness },
    { subject: "Certifications", value: certScore },
    { subject: "CGPA", value: (profile.cgpa / 10) * 100 },
  ];

  const pieData = [
    { name: "CGPA", value: 25, fill: "hsl(210, 100%, 45%)" },
    { name: "Skills", value: 20, fill: "hsl(160, 70%, 42%)" },
    { name: "Projects", value: 15, fill: "hsl(45, 95%, 55%)" },
    { name: "Internships", value: 20, fill: "hsl(280, 70%, 55%)" },
    { name: "Certs", value: 10, fill: "hsl(25, 95%, 55%)" },
    { name: "Resume", value: 10, fill: "hsl(340, 70%, 55%)" },
  ];

  const metrics = [
    { label: "CGPA", value: profile.cgpa, max: 10, pct: (profile.cgpa / 10) * 100, icon: Target },
    { label: "Skills", value: `${profile.skills.length} skills`, max: 100, pct: skillsAvg, icon: Zap },
    { label: "Projects", value: profile.projects.length, max: 4, pct: projectsScore, icon: TrendingUp },
    { label: "Internships", value: profile.internships.length, max: 3, pct: internshipScore, icon: Briefcase },
    { label: "Resume", value: `${profile.resumeCompleteness}%`, max: 100, pct: profile.resumeCompleteness, icon: FileText },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome back, <span className="text-gradient">{profile.name.split(" ")[0]}</span> 👋</h1>
          <p className="text-muted-foreground mt-1">Here's your career readiness overview</p>
        </div>
        <div className={`px-5 py-2 rounded-full font-display font-semibold text-sm flex items-center gap-2 ${
          score >= 70 ? "bg-score-excellent/10 text-score-excellent" : score >= 40 ? "bg-score-good/10 text-score-good" : "bg-score-low/10 text-score-low"
        }`}>
          <Clock className="w-4 h-4" />
          {level.label} — {level.timeline} to job ready
        </div>
      </motion.div>

      {/* Score + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 flex flex-col items-center gap-4">
          <h2 className="section-title text-lg">Readiness Score</h2>
          <ScoreRing score={score} />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowUp className="w-4 h-4 text-score-excellent" />
            <span>Updated in real-time</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h2 className="section-title text-lg mb-4">Skills Radar</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h2 className="section-title text-lg mb-4">Weight Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                {d.name} ({d.value}%)
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="metric-card">
            <div className="flex items-center gap-2">
              <m.icon className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
            </div>
            <span className="text-lg font-display font-bold">{m.value}</span>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                style={{ background: m.pct >= 70 ? "hsl(var(--score-excellent))" : m.pct >= 40 ? "hsl(var(--score-good))" : "hsl(var(--score-low))" }}
                initial={{ width: 0 }}
                animate={{ width: `${m.pct}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pattern Analysis */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
        <h2 className="section-title text-lg mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-score-good" /> AI Pattern Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {patterns.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{p}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Feedback */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="gradient-hero rounded-xl p-6 text-primary-foreground">
        <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> AI Mentor Feedback
        </h2>
        <p className="text-sm leading-relaxed opacity-90">
          {score >= 70
            ? `Great job, ${profile.name.split(" ")[0]}! Your profile is well-rounded with strong ${skillsAvg > 70 ? "technical skills" : "fundamentals"}. Focus on refining your resume and adding more certifications to stand out. You're nearly job-ready!`
            : score >= 40
            ? `You're making good progress, ${profile.name.split(" ")[0]}. Your profile shows promise ${profile.internships.length > 0 ? "with internship experience" : "but needs internship experience"}. Adding ${4 - profile.projects.length > 0 ? `${4 - profile.projects.length} more projects` : "advanced projects"} and improving your resume to ${profile.resumeCompleteness < 80 ? "at least 80%" : "completion"} will significantly boost your readiness.`
            : `Let's build your foundation, ${profile.name.split(" ")[0]}. Start by adding real-world projects, gaining internship experience, and developing in-demand skills. Your CGPA is ${profile.cgpa >= 7 ? "solid" : "an area to improve"} — complement it with practical exposure for the best results.`
          }
        </p>
      </motion.div>
    </div>
  );
}

function Briefcase(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>;
}
function FileText(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>;
}
function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>;
}
