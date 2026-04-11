import { useState } from "react";
import { motion } from "framer-motion";
import { useStudentStore } from "@/store/useStudentStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus, X, Trophy, Calendar } from "lucide-react";

export default function InternshipsPage() {
  const { profile, addInternship, removeInternship, addHackathon, removeHackathon } = useStudentStore();
  const [newInt, setNewInt] = useState({ company: "", role: "", duration: "" });
  const [newHack, setNewHack] = useState({ name: "", position: "", year: "" });

  const handleAddInt = () => {
    if (newInt.company.trim() && newInt.role.trim()) {
      addInternship(newInt);
      setNewInt({ company: "", role: "", duration: "" });
    }
  };

  const handleAddHack = () => {
    if (newHack.name.trim()) {
      addHackathon(newHack);
      setNewHack({ name: "", position: "", year: "" });
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3"><Briefcase className="w-8 h-8 text-primary" /> Internships & Hackathons</h1>
        <p className="text-muted-foreground mt-1">Add your professional experience — internships boost readiness by 30-40%</p>
      </motion.div>

      {/* Internships */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Internships</h2>
        <div className="space-y-3">
          {profile.internships.map((int, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <h3 className="font-semibold text-sm">{int.role}</h3>
                <p className="text-xs text-muted-foreground">{int.company} · {int.duration}</p>
              </div>
              <button onClick={() => removeInternship(i)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Input value={newInt.company} onChange={(e) => setNewInt({ ...newInt, company: e.target.value })} placeholder="Company" />
          <Input value={newInt.role} onChange={(e) => setNewInt({ ...newInt, role: e.target.value })} placeholder="Role" />
          <Input value={newInt.duration} onChange={(e) => setNewInt({ ...newInt, duration: e.target.value })} placeholder="Duration (e.g. 3 months)" />
          <Button onClick={handleAddInt} className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </motion.div>

      {/* Hackathons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2"><Trophy className="w-5 h-5 text-score-good" /> Hackathons</h2>
        <div className="space-y-3">
          {profile.hackathons.map((h, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <h3 className="font-semibold text-sm">{h.name}</h3>
                <p className="text-xs text-muted-foreground">{h.position} · {h.year}</p>
              </div>
              <button onClick={() => removeHackathon(i)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Input value={newHack.name} onChange={(e) => setNewHack({ ...newHack, name: e.target.value })} placeholder="Hackathon name" />
          <Input value={newHack.position} onChange={(e) => setNewHack({ ...newHack, position: e.target.value })} placeholder="Position/Prize" />
          <Input value={newHack.year} onChange={(e) => setNewHack({ ...newHack, year: e.target.value })} placeholder="Year" />
          <Button onClick={handleAddHack} className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </motion.div>
    </div>
  );
}
