import { useState } from "react";
import { motion } from "framer-motion";
import { useStudentStore } from "@/store/useStudentStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Globe, Plus, X, BookOpen, CheckCircle } from "lucide-react";

const quizQuestions: Record<string, { q: string; options: string[]; answer: number }[]> = {
  English: [
    { q: "Which is grammatically correct?", options: ["She don't like it", "She doesn't like it", "She not like it"], answer: 1 },
    { q: "Choose the synonym of 'Eloquent':", options: ["Silent", "Articulate", "Confused"], answer: 1 },
    { q: "What is the past tense of 'begin'?", options: ["Beginned", "Began", "Begined"], answer: 1 },
  ],
  Hindi: [
    { q: "'Namaste' means:", options: ["Goodbye", "Hello/Greetings", "Thank you"], answer: 1 },
    { q: "How do you say 'water' in Hindi?", options: ["Pani", "Roti", "Chai"], answer: 0 },
  ],
  Spanish: [
    { q: "How do you say 'Thank you' in Spanish?", options: ["Gracias", "Merci", "Danke"], answer: 0 },
    { q: "'Buenos días' means:", options: ["Good night", "Good morning", "Goodbye"], answer: 1 },
  ],
};

export default function LanguagesPage() {
  const { profile, addLanguage, removeLanguage, updateProfile } = useStudentStore();
  const [newLang, setNewLang] = useState("");
  const [newProf, setNewProf] = useState(50);
  const [quizLang, setQuizLang] = useState<string | null>(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleAdd = () => {
    if (newLang.trim()) {
      addLanguage({ name: newLang.trim(), proficiency: newProf });
      setNewLang(""); setNewProf(50);
    }
  };

  const startQuiz = (lang: string) => {
    if (quizQuestions[lang]) {
      setQuizLang(lang); setQuizIdx(0); setQuizScore(0); setQuizDone(false); setSelected(null);
    }
  };

  const answerQuiz = (optIdx: number) => {
    if (!quizLang || selected !== null) return;
    setSelected(optIdx);
    const correct = quizQuestions[quizLang][quizIdx].answer === optIdx;
    const newScore = quizScore + (correct ? 1 : 0);
    setQuizScore(newScore);

    setTimeout(() => {
      if (quizIdx + 1 < quizQuestions[quizLang].length) {
        setQuizIdx(quizIdx + 1);
        setSelected(null);
      } else {
        setQuizDone(true);
        const proficiency = Math.round((newScore / quizQuestions[quizLang].length) * 100);
        const updated = profile.languages.map(l => l.name === quizLang ? { ...l, proficiency } : l);
        updateProfile({ languages: updated });
      }
    }, 800);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3"><Globe className="w-8 h-8 text-primary" /> Languages</h1>
        <p className="text-muted-foreground mt-1">Add languages and test your proficiency with quizzes</p>
      </motion.div>

      {/* Add Language */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-muted-foreground">Language</label>
            <Input value={newLang} onChange={(e) => setNewLang(e.target.value)} placeholder="e.g. French" className="mt-1" />
          </div>
          <div className="w-40">
            <label className="text-xs text-muted-foreground">Proficiency: {newProf}%</label>
            <Slider value={[newProf]} onValueChange={([v]) => setNewProf(v)} max={100} className="mt-2" />
          </div>
          <Button onClick={handleAdd} className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </motion.div>

      {/* Languages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile.languages.map((l, i) => (
          <motion.div key={l.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-card-hover p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{l.name}</h3>
                <span className="text-xs text-muted-foreground">Proficiency: {l.proficiency}%</span>
              </div>
              <button onClick={() => removeLanguage(l.name)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
            <div className="progress-track mb-3">
              <div className="progress-fill" style={{ width: `${l.proficiency}%`, background: l.proficiency >= 70 ? "hsl(var(--score-excellent))" : l.proficiency >= 40 ? "hsl(var(--score-good))" : "hsl(var(--score-low))" }} />
            </div>
            {quizQuestions[l.name] && (
              <Button variant="outline" size="sm" onClick={() => startQuiz(l.name)} className="w-full">
                <BookOpen className="w-3 h-3 mr-1" /> Take Quiz
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quiz Modal */}
      {quizLang && !quizDone && quizQuestions[quizLang] && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 border-2 border-primary/20">
          <h2 className="font-display font-bold text-lg mb-1">{quizLang} Quiz</h2>
          <p className="text-xs text-muted-foreground mb-4">Question {quizIdx + 1} of {quizQuestions[quizLang].length}</p>
          <p className="font-medium mb-4">{quizQuestions[quizLang][quizIdx].q}</p>
          <div className="space-y-2">
            {quizQuestions[quizLang][quizIdx].options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => answerQuiz(oi)}
                className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                  selected === null ? "hover:border-primary hover:bg-primary/5 border-border" :
                  oi === quizQuestions[quizLang][quizIdx].answer ? "border-score-excellent bg-score-excellent/10" :
                  oi === selected ? "border-destructive bg-destructive/10" : "border-border opacity-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {quizDone && quizLang && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 text-center">
          <CheckCircle className="w-12 h-12 text-score-excellent mx-auto mb-3" />
          <h2 className="font-display font-bold text-xl">Quiz Complete!</h2>
          <p className="text-muted-foreground">You scored {quizScore}/{quizQuestions[quizLang].length} — proficiency updated to {Math.round((quizScore / quizQuestions[quizLang].length) * 100)}%</p>
          <Button onClick={() => setQuizLang(null)} className="mt-4 gradient-primary text-primary-foreground">Close</Button>
        </motion.div>
      )}
    </div>
  );
}
