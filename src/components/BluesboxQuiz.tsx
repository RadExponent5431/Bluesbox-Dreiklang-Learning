import React, { useState, ChangeEvent, JSX } from "react";

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

// Hilfsfunktionen
function noteIndex(note: string): number {
  return NOTES.indexOf(note);
}

function transpose(note: string, interval: number): string {
  const idx = (noteIndex(note) + interval + 12) % 12;
  return NOTES[idx];
}

function generateBluesbox(root: string): string[][] {
  // const scaleDegrees = [0, 5, 7]; // C entspricht 1, F entspricht 4, G entspricht 5
  const intervals = [
    [0, 0, 0, 0], // 1, 1, 1, 1
    [5, 5, 0, 0], // 4, 4, 1, 1
    [7, 5, 0, 0], // 5, 4, 1, 1
  ];
  const box: string[][] = intervals.map((row) =>
    row.map((interval) => transpose(root, interval))
  );
  return box;
}

export default function BluesboxApp(): JSX.Element {
  const [rootNote, setRootNote] = useState<string>("C");
  const [userAnswers, setUserAnswers] = useState<string[][]>(
    Array(3).fill(Array(4).fill(""))
  );
  const [feedback, setFeedback] = useState<string>("");
  const [score, setScore] = useState<number>(0);

  const correctBluesbox = generateBluesbox(rootNote);

  const handleRootNoteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newRoot = e.target.value;
    setRootNote(newRoot);
    setFeedback("");
    setUserAnswers(Array(3).fill(Array(4).fill("")));
  };

  const handleInputChange = (
    boxIdx: number,
    noteIdx: number,
    value: string
  ) => {
    const updatedAnswers = userAnswers.map((box, i) =>
      i === boxIdx ? box.map((note, j) => (j === noteIdx ? value : note)) : box
    );
    setUserAnswers(updatedAnswers);
  };

  const checkAnswers = () => {
    let newScore = 0;
    const feedbackMessages: string[] = [];

    userAnswers.forEach((box, i) => {
      if (box.join() === correctBluesbox[i].join()) {
        newScore++;
        feedbackMessages.push(`Box ${i + 1}: Richtig! 🎉`);
      } else {
        feedbackMessages.push(
          `Box ${i + 1}: Falsch! Richtige Noten: ${correctBluesbox[i].join(
            ", "
          )}`
        );
      }
    });

    setScore(newScore);
    setFeedback(feedbackMessages.join(" | "));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bluesbox Quiz</h1>
      <section style={styles.section}>
        <label>
          Wähle Grundton:
          <select
            value={rootNote}
            onChange={handleRootNoteChange}
            style={styles.select}
          >
            {NOTES.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </label>

        {userAnswers.map((box, boxIdx) => (
          <div key={boxIdx} style={styles.box}>
            <h3>Box {boxIdx + 1}</h3>
            <div style={styles.row}>
              {box.map((note, noteIdx) => (
                <input
                  key={noteIdx}
                  type="text"
                  value={note}
                  onChange={(e) =>
                    handleInputChange(boxIdx, noteIdx, e.target.value)
                  }
                  placeholder={`Note ${noteIdx + 1}`}
                  style={styles.input}
                  maxLength={2}
                />
              ))}
            </div>
          </div>
        ))}

        <button onClick={checkAnswers} style={styles.button}>
          Antwort prüfen
        </button>

        {feedback && <p style={styles.feedback}>{feedback}</p>}
        <p>Deine Punktzahl: {score}/3</p>
      </section>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "20px",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "20px",
  },
  box: {
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
  },
  input: {
    width: "60px",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  feedback: {
    marginTop: "20px",
    fontSize: "16px",
    fontWeight: "bold",
  },
};
