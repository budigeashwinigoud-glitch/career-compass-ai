import { motion } from "framer-motion";
import { useStudentStore } from "@/store/useStudentStore";
import { User, MapPin, Mail, Code, FolderKanban, Briefcase, Award, GraduationCap } from "lucide-react";

export default function LinkedProfilePage() {
  const { profile, getReadinessScore } = useStudentStore();
  const score = getReadinessScore();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3"><User className="w-8 h-8 text-primary" /> Linked Profile</h1>
      </motion.div>

      {/* Banner + Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        <div className="h-32 gradient-hero" />
        <div className="px-6 pb-6 -mt-12">
          <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-3xl font-display font-bold text-primary-foreground border-4 border-card">
            {profile.name.split(" ").map(n => n[0]).join("")}
          </div>
          <h2 className="text-xl font-display font-bold mt-3">{profile.name}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {profile.email}</p>
          <div className="flex gap-4 mt-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><GraduationCap className="w-3 h-3" /> CGPA: {profile.cgpa}</span>
            <span className="text-xs flex items-center gap-1" style={{ color: score >= 70 ? "hsl(var(--score-excellent))" : score >= 40 ? "hsl(var(--score-good))" : "hsl(var(--score-low))" }}>
              🎯 Readiness: {score}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <ProfileSection title="About" icon={User} delay={0.1}>
        <p className="text-sm leading-relaxed">{profile.about}</p>
      </ProfileSection>

      {/* Skills */}
      <ProfileSection title="Skills" icon={Code} delay={0.15}>
        <div className="space-y-2">
          {profile.skills.map(s => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="text-sm font-medium w-24">{s.name}</span>
              <div className="flex-1 progress-track">
                <motion.div className="progress-fill" style={{ background: "hsl(var(--primary))" }} initial={{ width: 0 }} animate={{ width: `${s.level}%` }} transition={{ duration: 0.8 }} />
              </div>
              <span className="text-xs text-muted-foreground w-10 text-right">{s.level}%</span>
            </div>
          ))}
        </div>
      </ProfileSection>

      {/* Projects */}
      <ProfileSection title="Projects" icon={FolderKanban} delay={0.2}>
        {profile.projects.map((p, i) => (
          <div key={i} className="mb-4 last:mb-0 p-3 rounded-lg bg-muted/50">
            <h4 className="font-semibold text-sm">{p.title}</h4>
            <p className="text-xs text-muted-foreground">{p.description}</p>
            <div className="flex gap-1 mt-2">{p.tech.map(t => <span key={t} className="badge-skill text-[10px]">{t}</span>)}</div>
          </div>
        ))}
      </ProfileSection>

      {/* Experience */}
      <ProfileSection title="Experience" icon={Briefcase} delay={0.25}>
        {profile.internships.map((int, i) => (
          <div key={i} className="mb-3 last:mb-0 flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{int.role}</h4>
              <p className="text-xs text-muted-foreground">{int.company} · {int.duration}</p>
            </div>
          </div>
        ))}
        {profile.hackathons.map((h, i) => (
          <div key={`h-${i}`} className="mb-3 last:mb-0 flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-score-good/10 flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 text-score-good" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{h.name}</h4>
              <p className="text-xs text-muted-foreground">{h.position} · {h.year}</p>
            </div>
          </div>
        ))}
      </ProfileSection>
    </div>
  );
}

function ProfileSection({ title, icon: Icon, children, delay }: { title: string; icon: React.ElementType; children: React.ReactNode; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="glass-card p-6">
      <h3 className="font-display font-semibold text-base flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-primary" /> {title}
      </h3>
      {children}
    </motion.div>
  );
}
