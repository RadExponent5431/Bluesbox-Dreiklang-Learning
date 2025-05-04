import { useState, JSX } from "react";

const NOTES: string[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// Helper functions for note and interval calculations
function noteIndex(note: string): number {
  return NOTES.indexOf(note);
}

function transpose(note: string, interval: number): string {
  const idx = (noteIndex(note) + interval + 12) % 12;
  return NOTES[idx];
}

function generateMajorTriad(root: string): string[] {
  return [root, transpose(root, 4), transpose(root, 7)];
}

function generateMinorTriad(root: string): string[] {
  return [root, transpose(root, 3), transpose(root, 7)];
}

function arraysEqualIgnoreOrder(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((val, idx) => val === sorted2[idx]);
}

export default function ChordQuizApp(): JSX.Element {
  const [triadRoot, setTriadRoot] = useState<string>(NOTES[0]); // Start with the first note
  const [triadType, setTriadType] = useState<"major" | "minor">("major");
  const [triadAnswer, setTriadAnswer] = useState<string[]>(Array(3).fill(""));
  const [triadFeedback, setTriadFeedback] = useState<string>("");
  const [triadScore, setTriadScore] = useState<number>(0);

  const handleTriadInputChange = (idx: number, value: string): void => {
    const newAnswer = [...triadAnswer];
    newAnswer[idx] = value;
    setTriadAnswer(newAnswer);
  };

  const checkTriadAnswer = (): void => {
    const correctTriad =
      triadType === "major"
        ? generateMajorTriad(triadRoot)
        : generateMinorTriad(triadRoot);

    if (arraysEqualIgnoreOrder(triadAnswer, correctTriad)) {
      setTriadFeedback("Richtig! 👍");
      setTriadScore((prev) => prev + 1);
    } else {
      setTriadFeedback(
        "Falsch! Die korrekten Töne sind: " + correctTriad.join(", ")
      );
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dreiklänge Quiz</h1>
      <section>
        <h2>Dur- und Moll-Dreiklänge</h2>
        <div>
          <label>
            Grundton:
            <select
              value={triadRoot}
              onChange={(e) => setTriadRoot(e.target.value)}
            >
              {NOTES.map((root) => (
                <option key={root} value={root}>
                  {root}
                </option>
              ))}
            </select>
          </label>
          <label>
            Typ:
            <select
              value={triadType}
              onChange={(e) =>
                setTriadType(e.target.value as "major" | "minor")
              }
            >
              <option value="major">Dur</option>
              <option value="minor">Moll</option>
            </select>
          </label>
        </div>
        <div>
          {triadAnswer.map((note, idx) => (
            <input
              key={idx}
              value={note}
              onChange={(e) => handleTriadInputChange(idx, e.target.value)}
              placeholder={`Note ${idx + 1}`}
            />
          ))}
        </div>
        <button onClick={checkTriadAnswer}>Prüfen</button>
        <p>{triadFeedback}</p>
        <p>Punkte: {triadScore}</p>
      </section>
    </div>
  );
}

export { ChordQuizApp };
