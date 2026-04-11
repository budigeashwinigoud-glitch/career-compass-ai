import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useStudentStore } from "@/store/useStudentStore";
import { Button } from "@/components/ui/button";
import { Brain, RotateCcw, Trophy, Zap } from "lucide-react";

// Memory card game
const emojis = ["🚀", "💡", "🎯", "⚡", "🔥", "🌟", "💎", "🧠"];
type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function MemoryGame({ onScore }: { onScore: (s: number) => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initGame = useCallback(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(shuffled);
    setFlippedIds([]);
    setMoves(0);
    setMatched(0);
    setGameOver(false);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const flipCard = (id: number) => {
    if (flippedIds.length === 2 || cards[id].flipped || cards[id].matched || gameOver) return;
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        newCards[a].matched = true;
        newCards[b].matched = true;
        setCards([...newCards]);
        setFlippedIds([]);
        const newMatched = matched + 1;
        setMatched(newMatched);
        if (newMatched === emojis.length) {
          setGameOver(true);
          const score = Math.max(10, 100 - (moves * 3));
          onScore(score);
        }
      } else {
        setTimeout(() => {
          newCards[a].flipped = false;
          newCards[b].flipped = false;
          setCards([...newCards]);
          setFlippedIds([]);
        }, 600);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">Moves: <strong>{moves}</strong></span>
        <span className="text-sm text-muted-foreground">Matched: <strong>{matched}/{emojis.length}</strong></span>
        <Button variant="outline" size="sm" onClick={initGame}><RotateCcw className="w-3 h-3 mr-1" /> Reset</Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => flipCard(card.id)}
            whileTap={{ scale: 0.95 }}
            className={`aspect-square rounded-lg text-2xl flex items-center justify-center transition-all duration-300 font-bold ${
              card.flipped || card.matched
                ? "bg-primary/10 border-2 border-primary/30"
                : "bg-muted hover:bg-muted/80 border-2 border-border"
            }`}
          >
            {card.flipped || card.matched ? card.emoji : "?"}
          </motion.button>
        ))}
      </div>
      {gameOver && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-4 p-4 rounded-lg bg-score-excellent/10">
          <Trophy className="w-8 h-8 text-score-excellent mx-auto mb-2" />
          <p className="font-display font-bold">Completed in {moves} moves!</p>
          <p className="text-sm text-muted-foreground">Score: {Math.max(10, 100 - (moves * 3))}%</p>
        </motion.div>
      )}
    </div>
  );
}

// Pattern recognition
function PatternGame({ onScore }: { onScore: (s: number) => void }) {
  const patterns = [
    { sequence: [2, 4, 6, 8], answer: 10, hint: "Even numbers" },
    { sequence: [1, 1, 2, 3, 5], answer: 8, hint: "Fibonacci" },
    { sequence: [3, 9, 27, 81], answer: 243, hint: "Powers of 3" },
    { sequence: [1, 4, 9, 16], answer: 25, hint: "Perfect squares" },
  ];
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const check = () => {
    const isCorrect = parseInt(input) === patterns[idx].answer;
    const newCorrect = correct + (isCorrect ? 1 : 0);
    setCorrect(newCorrect);
    setInput("");
    if (idx + 1 < patterns.length) {
      setIdx(idx + 1);
    } else {
      setDone(true);
      onScore(Math.round((newCorrect / patterns.length) * 100));
    }
  };

  return (
    <div>
      {!done ? (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Question {idx + 1}/{patterns.length}</p>
          <p className="font-display font-bold text-lg mb-1">What comes next?</p>
          <div className="flex gap-2 mb-4">
            {patterns[idx].sequence.map((n, i) => (
              <span key={i} className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">{n}</span>
            ))}
            <span className="w-10 h-10 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center text-primary">?</span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && check()}
              className="border rounded-lg px-3 py-2 w-24 text-center bg-background"
              placeholder="?"
            />
            <Button onClick={check} className="gradient-primary text-primary-foreground">Submit</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Hint: {patterns[idx].hint}</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-4">
          <Zap className="w-8 h-8 text-score-good mx-auto mb-2" />
          <p className="font-display font-bold">Pattern Score: {Math.round((correct / patterns.length) * 100)}%</p>
          <p className="text-sm text-muted-foreground">{correct}/{patterns.length} correct</p>
          <Button onClick={() => { setIdx(0); setCorrect(0); setDone(false); setInput(""); }} variant="outline" size="sm" className="mt-3">
            <RotateCcw className="w-3 h-3 mr-1" /> Retry
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export default function BrainPowerPage() {
  const { profile, setGameScore } = useStudentStore();

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3"><Brain className="w-8 h-8 text-primary" /> Brain Power Zone</h1>
        <p className="text-muted-foreground mt-1">Train your brain — game scores contribute to your overall readiness</p>
        {profile.gameScore > 0 && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-score-excellent/10 text-score-excellent text-sm font-semibold">
            <Trophy className="w-4 h-4" /> Best Score: {profile.gameScore}%
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">🧩 Memory Match</h2>
          <MemoryGame onScore={setGameScore} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">🔢 Pattern Recognition</h2>
          <PatternGame onScore={setGameScore} />
        </motion.div>
      </div>
    </div>
  );
}
