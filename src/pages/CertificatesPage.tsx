import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useStudentStore } from "@/store/useStudentStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Award, Plus, X, Upload, FileCheck } from "lucide-react";

export default function CertificatesPage() {
  const { profile, addCertificate, removeCertificate } = useStudentStore();
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const handleAdd = () => {
    if (name.trim() && issuer.trim()) {
      addCertificate({ name: name.trim(), issuer: issuer.trim(), file: fileName });
      setName(""); setIssuer(""); setFileName("");
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3"><Award className="w-8 h-8 text-primary" /> Certificates</h1>
        <p className="text-muted-foreground mt-1">Upload your certifications — each adds 20% to your cert score (max 100%)</p>
      </motion.div>

      {/* Upload */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg">Add Certificate</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Certificate name" />
          <Input value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Issuing organization" />
          <div className="flex gap-2">
            <input type="file" ref={fileRef} onChange={handleFile} className="hidden" accept=".pdf,.jpg,.png,.jpeg" />
            <Button variant="outline" onClick={() => fileRef.current?.click()} className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> {fileName || "Upload File"}
            </Button>
            <Button onClick={handleAdd} className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4" /></Button>
          </div>
        </div>
      </motion.div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile.certificates.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-card-hover p-5">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.issuer}</p>
                  {c.file && <span className="text-[10px] text-primary mt-1 block">📎 {c.file}</span>}
                </div>
              </div>
              <button onClick={() => removeCertificate(i)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {profile.certificates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No certificates yet</p>
          <p className="text-sm">Add your first certification above</p>
        </div>
      )}
    </div>
  );
}
