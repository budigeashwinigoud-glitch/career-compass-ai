import { motion } from "framer-motion";
import { useStudentStore, StudentProfile } from "@/store/useStudentStore";
import { Button } from "@/components/ui/button";
import { FileText, Download, User, Code, FolderKanban, Briefcase, Award, Globe, GraduationCap } from "lucide-react";

export default function ResumePage() {
  const { profile, getReadinessScore } = useStudentStore();
  const score = getReadinessScore();

  const handleDownload = () => {
    const p = profile;
    const resumeText = generateResumeText(profile);
    const blob = new Blob([resumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, "_")}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3"><FileText className="w-8 h-8 text-primary" /> AI Resume Builder</h1>
          <p className="text-muted-foreground mt-1">Auto-generated resume based on your profile data</p>
        </div>
        <Button onClick={handleDownload} className="gradient-primary text-primary-foreground"><Download className="w-4 h-4 mr-2" /> Download</Button>
      </motion.div>

      {/* Resume Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center border-b border-border pb-4">
          <h2 className="text-2xl font-display font-bold">{profile.name}</h2>
          <p className="text-muted-foreground text-sm">{profile.email}</p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> CGPA: {profile.cgpa}/10</span>
            <span className="flex items-center gap-1">🎯 Readiness: {score}%</span>
          </div>
        </div>

        {/* About */}
        {profile.about && (
          <Section icon={User} title="About">
            <p className="text-sm leading-relaxed">{profile.about}</p>
          </Section>
        )}

        {/* Skills */}
        <Section icon={Code} title="Technical Skills">
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(s => (
              <span key={s.name} className="badge-skill">{s.name} ({s.level}%)</span>
            ))}
          </div>
        </Section>

        {/* Projects */}
        {profile.projects.length > 0 && (
          <Section icon={FolderKanban} title="Projects">
            {profile.projects.map((p, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <h4 className="font-semibold text-sm">{p.title}</h4>
                <p className="text-xs text-muted-foreground">{p.description}</p>
                <div className="flex gap-1 mt-1">{p.tech.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>)}</div>
              </div>
            ))}
          </Section>
        )}

        {/* Internships */}
        {profile.internships.length > 0 && (
          <Section icon={Briefcase} title="Internships">
            {profile.internships.map((int, i) => (
              <div key={i} className="mb-2 last:mb-0">
                <h4 className="font-semibold text-sm">{int.role} — {int.company}</h4>
                <p className="text-xs text-muted-foreground">{int.duration}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {profile.certificates.length > 0 && (
          <Section icon={Award} title="Certifications">
            {profile.certificates.map((c, i) => (
              <p key={i} className="text-sm">{c.name} — <span className="text-muted-foreground">{c.issuer}</span></p>
            ))}
          </Section>
        )}

        {/* Languages */}
        {profile.languages.length > 0 && (
          <Section icon={Globe} title="Languages">
            <div className="flex flex-wrap gap-3">
              {profile.languages.map(l => (
                <span key={l.name} className="text-sm">{l.name} ({l.proficiency >= 80 ? "Fluent" : l.proficiency >= 50 ? "Intermediate" : "Beginner"})</span>
              ))}
            </div>
          </Section>
        )}
      </motion.div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display font-semibold text-sm flex items-center gap-2 mb-2 text-primary">
        <Icon className="w-4 h-4" /> {title}
      </h3>
      {children}
    </div>
  );
}

function generateResumeText(p: StudentProfile) {
  let text = `${p.name}\n${p.email}\nCGPA: ${p.cgpa}/10\n\n`;
  text += `ABOUT\n${p.about}\n\n`;
  text += `SKILLS\n${p.skills.map(s => `${s.name} (${s.level}%)`).join(", ")}\n\n`;
  text += `PROJECTS\n${p.projects.map(pr => `${pr.title} - ${pr.description} [${pr.tech.join(", ")}]`).join("\n")}\n\n`;
  text += `INTERNSHIPS\n${p.internships.map(i => `${i.role} at ${i.company} (${i.duration})`).join("\n")}\n\n`;
  text += `CERTIFICATIONS\n${p.certificates.map(c => `${c.name} - ${c.issuer}`).join("\n")}\n\n`;
  text += `LANGUAGES\n${p.languages.map(l => `${l.name} (${l.proficiency}%)`).join(", ")}\n`;
  return text;
}
