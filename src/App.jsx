import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import "./index.css";

const firebaseConfig = {
  apiKey: "AIzaSyCrgi7BhG7D6XXzuvHUXz8rLlb-B4kgT8E",
  authDomain: "mirrormind-00.firebaseapp.com",
  databaseURL: "https://mirrormind-00-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mirrormind-00",
  storageBucket: "mirrormind-00.firebasestorage.app",
  messagingSenderId: "34866976120",
  appId: "1:34866976120:web:3f4ffc56cb2980fd54248d",
  measurementId: "G-G0PMBR4XGW"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const imageUrls = [
  "https://ik.imagekit.io/jpc6wnnmd/1748401415986.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401417214.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401418294.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401419950.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401420500.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401422243.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401425600.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401295351.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401293211.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401294198.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401297435.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401304912.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401310186.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401313853.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401318455.jpg",
  "https://ik.imagekit.io/jpc6wnnmd/1748401326888.jpg"
];

function getUniqueDecks() {
  const shuffled = [...imageUrls].sort(() => 0.5 - Math.random());
  return {
    player1: shuffled.slice(0, 6),
    player2: shuffled.slice(6, 12),
    mirror: shuffled.slice(12, 18)
  };
}

export default function App() {
  const [step, setStep] = useState<"start" | "player1" | "player2" | "result">("start");
  const [decks, setDecks] = useState({ player1: [], player2: [], mirror: [] });
  const [association, setAssociation] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [mirrorCards, setMirrorCards] = useState<string[]>([]);
  const [scores, setScores] = useState({ players: 0, mirror: 0 });

  useEffect(() => {
    const assocRef = ref(db, "round1/player1/association");
    onValue(assocRef, (snapshot) => {
      if (snapshot.exists()) {
        setAssociation(snapshot.val());
        setStep("player2");
      }
    });
  }, []);

  const handleStart = () => {
    const newDecks = getUniqueDecks();
    setDecks(newDecks);
    setMirrorCards(newDecks.mirror.slice(0, 2));
    setStep("player1");
    setAssociation("");
    setSelected([]);
  };

  const handleCardClick = (url: string) => {
    setSelected((prev) => {
      if (prev.includes(url)) {
        return prev.filter((u) => u !== url);
      } else if (prev.length < 2) {
        return [...prev, url];
      } else {
        return prev;
      }
    });
  };

  const handleSubmit = () => {
    if (step === "player1") {
      if (association && selected.length === 2) {
        set(ref(db, "round1/player1"), {
          association,
          cards: selected
        });
        setSelected([]);
      } else {
        alert("Введите ассоциацию и выберите 2 карты.");
      }
    } else if (step === "player2") {
      if (selected.length === 2) {
        set(ref(db, "round1/player2"), {
          cards: selected
        });
        setStep("result");
      } else {
        alert("Выберите 2 карты.");
      }
    }
  };

  const calculateResults = () => {
    const guesses = [...selected];
    const correct = guesses.filter((card) => mirrorCards.includes(card));
    if (correct.length === 2) setScores((prev) => ({ players: prev.players + 2, mirror: prev.mirror }));
    else if (correct.length === 1) setScores((prev) => ({ players: prev.players + 1, mirror: prev.mirror + 1 }));
    else setScores((prev) => ({ players: prev.players, mirror: prev.mirror + 2 }));
  };

  useEffect(() => {
    if (step === "result") {
      calculateResults();
    }
  }, [step]);

  const currentDeck = step === "player1" ? decks.player1 : decks.player2;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 animate-gradient-x p-6">
      <h1 className="text-4xl font-bold text-white mb-4 drop-shadow">MirrorMind</h1>

      {step === "start" && (
        <button className="text-lg px-6 py-2 bg-white rounded" onClick={handleStart}>Начать игру</button>
      )}

      {(step === "player1" || step === "player2") && (
        <div className="bg-white/10 p-4 rounded-xl w-full max-w-md">
          {step === "player1" ? (
            <>
              <label className="block text-white font-semibold mb-2">Твоя ассоциация:</label>
              <input
                className="w-full p-2 rounded-lg mb-4"
                type="text"
                value={association}
                onChange={(e) => setAssociation(e.target.value)}
                placeholder="Например: Страх"
              />
            </>
          ) : (
            <>
              <p className="text-white font-semibold mb-2">Ассоциация:</p>
              <p className="text-white text-lg italic mb-4">{association}</p>
            </>
          )}

          <p className="text-white mb-2">Выбери 2 карты:</p>
          <div className="grid grid-cols-3 gap-2">
            {currentDeck.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="card"
                onClick={() => handleCardClick(url)}
                className={`rounded-xl border-4 cursor-pointer ${selected.includes(url) ? "border-yellow-400" : "border-transparent"}`}
              />
            ))}
          </div>
          <button className="mt-4 w-full bg-white text-black rounded py-2" onClick={handleSubmit}>
            {step === "player1" ? "Отправить подсказку" : "Отправить выбор"}
          </button>
        </div>
      )}

      {step === "result" && (
        <div className="bg-white/10 p-6 rounded-xl text-white w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Результаты раунда</h2>
          <p className="mb-2">Карты MirrorAI:</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {mirrorCards.map((url, idx) => (
              <img key={idx} src={url} alt="mirror-card" className="rounded-xl" />
            ))}
          </div>
          <p>Счёт Игроки: {scores.players} | MirrorAI: {scores.mirror}</p>
          <button className="mt-4 bg-white text-black rounded py-2" onClick={handleStart}>Следующий раунд</button>
        </div>
      )}
    </div>
  );
}
