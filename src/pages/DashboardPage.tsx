import { useState } from "react";
import { motion } from "framer-motion";
import { useStudentStore } from "@/store/useStudentStore";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Target, Clock, Zap, AlertTriangle, CheckCircle, ArrowUp, Plus, X, Sparkles, GraduationCap, Code, Briefcase, FileText, Award, ChevronDown, ChevronUp } from "lucide-react";

const ScoreRing = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 88;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "160 70% 42%" : score >= 40 ? "45 95% 55%" : "0 80% 55%";

  return (
    <div className="relative w-56 h-56 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="88" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <motion.circle
          cx="100" cy="100" r="88" fill="none"
          stroke={`hsl(${color})`}
          strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-6xl font-display font-black"
          style={{ color: `hsl(${color})` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {score}
        </motion.span>
        <span className="text-sm text-muted-foreground font-semibold tracking-wide uppercase">Readiness</span>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const store = useStudentStore();
  const { profile, updateProfile, addSkill, removeSkill, addProject, removeProject, addInternship, removeInternship } = store;
  const score = store.getReadinessScore();
  const patterns = store.getPatternAnalysis();
  const level = store.getReadinessLevel();

  const [showInputs, setShowInputs] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState(70);
  const [newProject, setNewProject] = useState("");
  const [newIntCompany, setNewIntCompany] = useState("");
  const [newIntRole, setNewIntRole] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

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
    { name: "CGPA (25%)", value: 25, fill: "hsl(210, 100%, 45%)" },
    { name: "Skills (20%)", value: 20, fill: "hsl(160, 70%, 42%)" },
    { name: "Projects (15%)", value: 15, fill: "hsl(45, 95%, 55%)" },
    { name: "Internships (20%)", value: 20, fill: "hsl(280, 70%, 55%)" },
    { name: "Certs (10%)", value: 10, fill: "hsl(25, 95%, 55%)" },
    { name: "Resume (10%)", value: 10, fill: "hsl(340, 70%, 55%)" },
  ];

  const metrics = [
    { label: "CGPA", value: `${profile.cgpa}/10`, pct: (profile.cgpa / 10) * 100, icon: GraduationCap, weight: "25%" },
    { label: "Skills", value: `${profile.skills.length} (avg ${skillsAvg}%)`, pct: skillsAvg, icon: Code, weight: "20%" },
    { label: "Projects", value: `${profile.projects.length}`, pct: projectsScore, icon: FolderKanban, weight: "15%" },
    { label: "Internships", value: `${profile.internships.length}`, pct: internshipScore, icon: Briefcase, weight: "20%" },
    { label: "Certificates", value: `${profile.certificates.length}`, pct: certScore, icon: Award, weight: "10%" },
    { label: "Resume", value: `${profile.resumeCompleteness}%`, pct: profile.resumeCompleteness, icon: FileText, weight: "10%" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="gradient-hero rounded-2xl p-8 text-primary-foreground">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight">
              🎯 Career Readiness Analyzer
            </h1>
            <p className="mt-2 text-sm opacity-80 max-w-lg">
              Your AI-powered career mentor. Edit your data below and watch your readiness score update in real-time with intelligent pattern detection and personalized feedback.
            </p>
            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
              score >= 70 ? "bg-score-excellent/20 text-score-excellent" : score >= 40 ? "bg-score-good/20 text-score-good" : "bg-score-low/20 text-score-low"
            }`}>
              <Clock className="w-4 h-4" />
              {level.label} — Estimated {level.timeline} to job ready
            </div>
          </div>
          <ScoreRing score={score} />
        </div>
      </motion.div>

      {/* Quick Input Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
        <button onClick={() => setShowInputs(!showInputs)} className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
          <h2 className="section-title text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Quick Analyzer — Edit Your Data
          </h2>
          {showInputs ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </button>

        {showInputs && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="px-5 pb-5 space-y-5">
            {/* CGPA + Resume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">CGPA (0–10)</label>
                <Input type="number" min={0} max={10} step={0.1} value={profile.cgpa}
                  onChange={(e) => updateProfile({ cgpa: Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)) })}
                  className="mt-1 text-lg font-bold" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resume Completeness: {profile.resumeCompleteness}%</label>
                <Slider value={[profile.resumeCompleteness]} onValueChange={([v]) => updateProfile({ resumeCompleteness: v })} max={100} step={5} className="mt-3" />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Skills</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((s) => (
                  <motion.span key={s.name} layout className="badge-skill flex items-center gap-1.5">
                    {s.name} <span className="opacity-50">{s.level}%</span>
                    <button onClick={() => removeSkill(s.name)}><X className="w-3 h-3 opacity-50 hover:opacity-100" /></button>
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-2 mt-2 items-center">
                <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add skill..." className="flex-1" 
                  onKeyDown={(e) => { if (e.key === "Enter" && newSkill.trim()) { addSkill({ name: newSkill.trim(), level: newSkillLevel }); setNewSkill(""); }}} />
                <div className="w-28 flex items-center gap-1">
                  <Slider value={[newSkillLevel]} onValueChange={([v]) => setNewSkillLevel(v)} max={100} className="flex-1" />
                  <span className="text-xs text-muted-foreground w-8">{newSkillLevel}%</span>
                </div>
                <Button size="sm" onClick={() => { if (newSkill.trim()) { addSkill({ name: newSkill.trim(), level: newSkillLevel }); setNewSkill(""); }}} className="gradient-primary text-primary-foreground">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Projects */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Projects ({profile.projects.length})</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.projects.map((p, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-score-good/10 text-score-good flex items-center gap-1.5">
                    {p.title} <button onClick={() => removeProject(i)}><X className="w-3 h-3 opacity-50 hover:opacity-100" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="Add project title..." className="flex-1"
                  onKeyDown={(e) => { if (e.key === "Enter" && newProject.trim()) { addProject({ title: newProject.trim(), description: "", tech: [] }); setNewProject(""); }}} />
                <Button size="sm" onClick={() => { if (newProject.trim()) { addProject({ title: newProject.trim(), description: "", tech: [] }); setNewProject(""); }}} className="gradient-primary text-primary-foreground">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Internships */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Internships ({profile.internships.length})</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.internships.map((int, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary flex items-center gap-1.5">
                    {int.role} @ {int.company} <button onClick={() => removeInternship(i)}><X className="w-3 h-3 opacity-50 hover:opacity-100" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input value={newIntCompany} onChange={(e) => setNewIntCompany(e.target.value)} placeholder="Company" className="flex-1" />
                <Input value={newIntRole} onChange={(e) => setNewIntRole(e.target.value)} placeholder="Role" className="flex-1"
                  onKeyDown={(e) => { if (e.key === "Enter" && newIntCompany.trim() && newIntRole.trim()) { addInternship({ company: newIntCompany.trim(), role: newIntRole.trim(), duration: "" }); setNewIntCompany(""); setNewIntRole(""); }}} />
                <Button size="sm" onClick={() => { if (newIntCompany.trim() && newIntRole.trim()) { addInternship({ company: newIntCompany.trim(), role: newIntRole.trim(), duration: "" }); setNewIntCompany(""); setNewIntRole(""); }}} className="gradient-primary text-primary-foreground">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Analyze Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex justify-center">
        <Button
          size="lg"
          onClick={() => setAnalyzed(true)}
          className="gradient-primary text-primary-foreground px-10 py-6 text-lg font-display font-black rounded-xl shadow-lg hover:scale-105 transition-transform gap-3"
        >
          <Sparkles className="w-6 h-6" />
          {analyzed ? "🔄 Re-Analyze My Data" : "🚀 Analyze My Data"}
        </Button>
      </motion.div>

      {analyzed && (<>
      {/* Metrics Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }} className="metric-card">
            <div className="flex items-center justify-between">
              <m.icon className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{m.weight}</span>
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{m.label}</span>
            <span className="text-lg font-display font-black">{m.value}</span>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                style={{ background: m.pct >= 70 ? "hsl(var(--score-excellent))" : m.pct >= 40 ? "hsl(var(--score-good))" : "hsl(var(--score-low))" }}
                initial={{ width: 0 }}
                animate={{ width: `${m.pct}%` }}
                transition={{ duration: 1, delay: i * 0.08 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h2 className="section-title text-lg mb-2">📊 Skills Radar</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }} className="glass-card p-6">
          <h2 className="section-title text-lg mb-2">⚖️ Weight Distribution</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                  <span className="font-medium">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pattern Detection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h2 className="section-title text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-score-good" /> 🔍 Pattern Detection
          </h2>
          <div className="space-y-2">
            {patterns.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium">{p}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Prediction & Trends */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card p-6 space-y-4">
          <h2 className="section-title text-lg flex items-center gap-2">📈 Prediction & Trends</h2>

          <div className={`p-4 rounded-xl border-2 ${
            score >= 70 ? "border-score-excellent/30 bg-score-excellent/5" : score >= 40 ? "border-score-good/30 bg-score-good/5" : "border-score-low/30 bg-score-low/5"
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5" style={{ color: score >= 70 ? "hsl(var(--score-excellent))" : score >= 40 ? "hsl(var(--score-good))" : "hsl(var(--score-low))" }} />
              <span className="font-display font-bold text-lg">{level.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">Estimated <strong>{level.timeline}</strong> to become fully job-ready with focused effort.</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
              <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Internships increase readiness by <strong>30–40%</strong> on average</span>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
              <TrendingUp className="w-4 h-4 text-score-excellent mt-0.5 flex-shrink-0" />
              <span>Skills + projects impact <strong>more than CGPA</strong> alone</span>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
              <TrendingUp className="w-4 h-4 text-score-good mt-0.5 flex-shrink-0" />
              <span>Resume completeness <strong>strongly affects</strong> recruiter impressions</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Mentor Feedback */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="gradient-hero rounded-2xl p-6 text-primary-foreground">
        <h2 className="font-display font-black text-lg mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> 🤖 AI Mentor Feedback
        </h2>
        <p className="text-sm leading-relaxed opacity-90">
          {score >= 70
            ? `Excellent work, ${profile.name.split(" ")[0]}! Your profile is well-rounded with ${skillsAvg > 70 ? "strong technical skills" : "solid fundamentals"}${profile.internships.length > 0 ? " and real-world experience" : ""}. To stand out further: ${profile.resumeCompleteness < 80 ? "polish your resume to 80%+, " : ""}${profile.certificates.length < 3 ? "add more industry certifications, " : ""}and consider contributing to open-source projects. You're nearly job-ready! 🚀`
            : score >= 40
            ? `You're on a good trajectory, ${profile.name.split(" ")[0]}! Here's your personalized roadmap: ${profile.internships.length === 0 ? "🔴 Priority #1: Secure an internship (boosts score by 30-40%). " : ""}${profile.projects.length < 3 ? `🟡 Add ${3 - profile.projects.length} more real-world projects to showcase practical ability. ` : ""}${profile.resumeCompleteness < 70 ? "🟡 Improve resume completeness — aim for 80%+. " : ""}${skillsAvg < 60 ? "🟡 Deepen your skill proficiency — aim for 70%+ average. " : ""}Focus on these areas and you'll see significant improvement within 3 months.`
            : `Let's build your foundation, ${profile.name.split(" ")[0]}! Your roadmap: 🔴 Start with 2-3 portfolio projects in your target domain. 🔴 ${profile.skills.length < 3 ? "Learn at least 3-5 in-demand skills (React, Python, SQL are great starts). " : "Deepen your existing skills to 60%+ proficiency. "}🔴 Apply for internships immediately — even short ones help enormously. ${profile.cgpa < 6 ? "🟡 Work on improving your CGPA alongside practical skills. " : ""}Your CGPA is ${profile.cgpa >= 7 ? "a solid foundation" : "an area to improve"} — complement it with hands-on experience for the best results.`
          }
        </p>
      </motion.div>
    </div>
  );
}

function FolderKanban(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M8 10v4"/><path d="M12 10v2"/><path d="M16 10v6"/></svg>;
}
