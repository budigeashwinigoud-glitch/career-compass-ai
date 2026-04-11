import { useState } from "react";
import { motion } from "framer-motion";
import { useStudentStore } from "@/store/useStudentStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { User, Plus, X, GraduationCap, Code, FolderKanban } from "lucide-react";

export default function ProfilePage() {
  const { profile, updateProfile, addSkill, removeSkill, addProject, removeProject } = useStudentStore();
  const [newSkill, setNewSkill] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState(50);
  const [newProject, setNewProject] = useState({ title: "", description: "", tech: "" });

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill({ name: newSkill.trim(), level: newSkillLevel });
      setNewSkill("");
      setNewSkillLevel(50);
    }
  };

  const handleAddProject = () => {
    if (newProject.title.trim()) {
      addProject({ title: newProject.title, description: newProject.description, tech: newProject.tech.split(",").map(t => t.trim()).filter(Boolean) });
      setNewProject({ title: "", description: "", tech: "" });
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3"><User className="w-8 h-8 text-primary" /> My Profile</h1>
        <p className="text-muted-foreground mt-1">Edit your profile to update your readiness score in real-time</p>
      </motion.div>

      {/* Basic Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" /> Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <Input value={profile.name} onChange={(e) => updateProfile({ name: e.target.value })} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <Input value={profile.email} onChange={(e) => updateProfile({ email: e.target.value })} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">CGPA (0-10)</label>
            <Input type="number" min={0} max={10} step={0.1} value={profile.cgpa} onChange={(e) => updateProfile({ cgpa: Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)) })} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Resume Completeness (%)</label>
            <Slider value={[profile.resumeCompleteness]} onValueChange={([v]) => updateProfile({ resumeCompleteness: v })} max={100} step={5} className="mt-3" />
            <span className="text-xs text-muted-foreground">{profile.resumeCompleteness}%</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">About</label>
          <Textarea value={profile.about} onChange={(e) => updateProfile({ about: e.target.value })} rows={3} className="mt-1" />
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2"><Code className="w-5 h-5 text-primary" /> Skills</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((s) => (
            <motion.div key={s.name} layout className="badge-skill flex items-center gap-2">
              {s.name} <span className="opacity-60">({s.level}%)</span>
              <button onClick={() => removeSkill(s.name)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-2 items-end flex-wrap">
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-muted-foreground">Skill Name</label>
            <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="e.g. React" className="mt-1" />
          </div>
          <div className="w-32">
            <label className="text-xs text-muted-foreground">Level: {newSkillLevel}%</label>
            <Slider value={[newSkillLevel]} onValueChange={([v]) => setNewSkillLevel(v)} max={100} className="mt-1" />
          </div>
          <Button onClick={handleAddSkill} size="sm" className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </motion.div>

      {/* Projects */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2"><FolderKanban className="w-5 h-5 text-primary" /> Projects</h2>
        <div className="space-y-3">
          {profile.projects.map((p, i) => (
            <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <h3 className="font-semibold text-sm">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.description}</p>
                <div className="flex gap-1 mt-1">{p.tech.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>)}</div>
              </div>
              <button onClick={() => removeProject(i)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="Project title" />
          <Input value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Description" />
          <div className="flex gap-2">
            <Input value={newProject.tech} onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })} placeholder="Tech (comma sep)" />
            <Button onClick={handleAddProject} size="sm" className="gradient-primary text-primary-foreground flex-shrink-0"><Plus className="w-4 h-4" /></Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
