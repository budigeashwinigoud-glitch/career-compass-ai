import { create } from 'zustand';

export interface StudentProfile {
  name: string;
  email: string;
  avatar: string;
  cgpa: number;
  skills: { name: string; level: number }[];
  projects: { title: string; description: string; tech: string[] }[];
  internships: { company: string; role: string; duration: string }[];
  hackathons: { name: string; position: string; year: string }[];
  certificates: { name: string; issuer: string; file?: string }[];
  languages: { name: string; proficiency: number }[];
  resumeCompleteness: number;
  gameScore: number;
  about: string;
}

interface StudentStore {
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  addSkill: (skill: { name: string; level: number }) => void;
  removeSkill: (name: string) => void;
  addProject: (project: StudentProfile['projects'][0]) => void;
  removeProject: (index: number) => void;
  addInternship: (internship: StudentProfile['internships'][0]) => void;
  removeInternship: (index: number) => void;
  addHackathon: (hackathon: StudentProfile['hackathons'][0]) => void;
  removeHackathon: (index: number) => void;
  addCertificate: (cert: StudentProfile['certificates'][0]) => void;
  removeCertificate: (index: number) => void;
  addLanguage: (lang: StudentProfile['languages'][0]) => void;
  removeLanguage: (name: string) => void;
  setGameScore: (score: number) => void;
  getReadinessScore: () => number;
  getPatternAnalysis: () => string[];
  getReadinessLevel: () => { label: string; timeline: string; color: string };
}

const defaultProfile: StudentProfile = {
  name: "Alex Johnson",
  email: "alex.j@university.edu",
  avatar: "",
  cgpa: 7.8,
  skills: [
    { name: "React", level: 80 },
    { name: "Python", level: 70 },
    { name: "TypeScript", level: 75 },
    { name: "Node.js", level: 60 },
    { name: "SQL", level: 65 },
  ],
  projects: [
    { title: "E-Commerce Platform", description: "Full-stack shopping app", tech: ["React", "Node.js", "MongoDB"] },
    { title: "Weather Dashboard", description: "Real-time weather tracking", tech: ["React", "API", "Chart.js"] },
  ],
  internships: [
    { company: "TechCorp", role: "Frontend Intern", duration: "3 months" },
  ],
  hackathons: [
    { name: "HackFest 2024", position: "2nd Place", year: "2024" },
  ],
  certificates: [
    { name: "AWS Cloud Practitioner", issuer: "Amazon" },
    { name: "React Advanced", issuer: "Udemy" },
  ],
  languages: [
    { name: "English", proficiency: 90 },
    { name: "Hindi", proficiency: 85 },
    { name: "Spanish", proficiency: 40 },
  ],
  resumeCompleteness: 65,
  gameScore: 0,
  about: "Passionate computer science student with a focus on web development and cloud technologies. Eager to apply theoretical knowledge in real-world scenarios.",
};

export const useStudentStore = create<StudentStore>((set, get) => ({
  profile: defaultProfile,
  updateProfile: (updates) => set((s) => ({ profile: { ...s.profile, ...updates } })),
  addSkill: (skill) => set((s) => ({ profile: { ...s.profile, skills: [...s.profile.skills, skill] } })),
  removeSkill: (name) => set((s) => ({ profile: { ...s.profile, skills: s.profile.skills.filter(sk => sk.name !== name) } })),
  addProject: (project) => set((s) => ({ profile: { ...s.profile, projects: [...s.profile.projects, project] } })),
  removeProject: (i) => set((s) => ({ profile: { ...s.profile, projects: s.profile.projects.filter((_, idx) => idx !== i) } })),
  addInternship: (internship) => set((s) => ({ profile: { ...s.profile, internships: [...s.profile.internships, internship] } })),
  removeInternship: (i) => set((s) => ({ profile: { ...s.profile, internships: s.profile.internships.filter((_, idx) => idx !== i) } })),
  addHackathon: (h) => set((s) => ({ profile: { ...s.profile, hackathons: [...s.profile.hackathons, h] } })),
  removeHackathon: (i) => set((s) => ({ profile: { ...s.profile, hackathons: s.profile.hackathons.filter((_, idx) => idx !== i) } })),
  addCertificate: (cert) => set((s) => ({ profile: { ...s.profile, certificates: [...s.profile.certificates, cert] } })),
  removeCertificate: (i) => set((s) => ({ profile: { ...s.profile, certificates: s.profile.certificates.filter((_, idx) => idx !== i) } })),
  addLanguage: (lang) => set((s) => ({ profile: { ...s.profile, languages: [...s.profile.languages, lang] } })),
  removeLanguage: (name) => set((s) => ({ profile: { ...s.profile, languages: s.profile.languages.filter(l => l.name !== name) } })),
  setGameScore: (score) => set((s) => ({ profile: { ...s.profile, gameScore: Math.max(s.profile.gameScore, score) } })),
  getReadinessScore: () => {
    const p = get().profile;
    const cgpaScore = (p.cgpa / 10) * 100;
    const skillsScore = p.skills.length > 0 ? p.skills.reduce((a, s) => a + s.level, 0) / p.skills.length : 0;
    const projectsScore = Math.min(p.projects.length * 25, 100);
    const internshipScore = Math.min(p.internships.length * 35, 100);
    const certScore = Math.min(p.certificates.length * 20, 100);
    const resumeScore = p.resumeCompleteness;

    return Math.round(
      cgpaScore * 0.25 +
      skillsScore * 0.20 +
      projectsScore * 0.15 +
      internshipScore * 0.20 +
      certScore * 0.10 +
      resumeScore * 0.10
    );
  },
  getPatternAnalysis: () => {
    const p = get().profile;
    const cgpaNorm = (p.cgpa / 10) * 100;
    const skillsAvg = p.skills.length > 0 ? p.skills.reduce((a, s) => a + s.level, 0) / p.skills.length : 0;
    const patterns: string[] = [];

    if (cgpaNorm > 70 && skillsAvg < 50) patterns.push("📚 Theory strong, practical skills need improvement");
    if (cgpaNorm < 50 && skillsAvg > 70) patterns.push("💪 Skill-based strength — great practical foundation");
    if (cgpaNorm > 60 && skillsAvg > 60 && p.projects.length >= 2) patterns.push("⭐ Balanced profile — highly job ready!");
    if (p.internships.length === 0) patterns.push("🔔 No internship experience — this can boost score by 30-40%");
    if (p.resumeCompleteness < 50) patterns.push("📝 Resume incomplete — strongly affects recruiter impressions");
    if (p.certificates.length === 0) patterns.push("📜 No certifications — industry certs add credibility");
    if (p.projects.length < 2) patterns.push("🛠️ Add more projects to showcase practical ability");
    if (p.skills.length > 5 && skillsAvg > 70) patterns.push("🌟 Positive outlier: diverse skill set with high proficiency");

    return patterns.length > 0 ? patterns : ["✅ Keep building your profile for more insights!"];
  },
  getReadinessLevel: () => {
    const score = get().getReadinessScore();
    if (score >= 70) return { label: "Job Ready", timeline: "~1 month", color: "score-excellent" };
    if (score >= 40) return { label: "Growing", timeline: "~3 months", color: "score-good" };
    return { label: "Not Ready", timeline: "~6 months", color: "score-low" };
  },
}));
