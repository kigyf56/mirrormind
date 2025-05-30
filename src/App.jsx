import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push, onDisconnect } from "firebase/database";
import "./index.css";
import "./App.css";

const firebaseConfig = {
apiKey: "AIzaSyCrgi7BhG7D6XXzuvHUXz8rLlb-B4kgT8E",
authDomain: "mirrormind-00.firebaseapp.com",
databaseURL: "[https://mirrormind-00-default-rtdb.europe-west1.firebasedatabase.app](https://mirrormind-00-default-rtdb.europe-west1.firebasedatabase.app)",
projectId: "mirrormind-00",
storageBucket: "mirrormind-00.appspot.com",
messagingSenderId: "34866976120",
appId: "1:34866976120\:web:3f4ffc56cb2980fd54248d",
measurementId: "G-G0PMBR4XGW"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const imageUrls = \[
"[https://ik.imagekit.io/jpc6wnnmd/1748401415986.jpg](https://ik.imagekit.io/jpc6wnnmd/1748401415986.jpg)",
"[https://ik.imagekit.io/jpc6wnnmd/1748401417214.jpg](https://ik.imagekit.io/jpc6wnnmd/1748401417214.jpg)",
"[https://ik.imagekit.io/jpc6wnnmd/1748401418294.jpg](https://ik.imagekit.io/jpc6wnnmd/1748401418294.jpg)",
"[https://ik.imagekit.io/jpc6wnnmd/1748401419950.jpg](https://ik.imagekit.io/jpc6wnnmd/1748401419950.jpg)",
"[https://ik.imagekit.io/jpc6wnnmd/1748401420500.jpg](https://ik.imagekit.io/jpc6wnnmd/1748401420500.jpg)",
"[https://ik.imagekit.io/jpc6wnnmd/1748401422243.jpg](https://ik.imagekit.io/jpc6wnnmd/1748401422243.jpg)",
"[https://ik.imagekit.io/jpc6wnnmd/1748401423893.jpg](https://ik.imagekit.io/jpc6wnnmd/1748401423893.jpg)",
"[https://ik.imagekit.io/jpc6wnnmd/1748401425085.jpg](https://ik.imagekit.io/jpc6wnnmd/1748401425085.jpg)"
];

function App() {
const \[step, setStep] = useState("waiting");
const \[roomId, setRoomId] = useState(null);
const \[playerId, setPlayerId] = useState(null);
const \[playerDeck, setPlayerDeck] = useState(\[]);
const \[mirrorCard, setMirrorCard] = useState(null);
const \[association, setAssociation] = useState("");
const \[selectedCard, setSelectedCard] = useState(null);
const \[result, setResult] = useState(null);
const \[scores, setScores] = useState({ player: 0, mirror: 0 });

useEffect(() => {
const room = "room1";
const player = `player_${Math.random().toString(36).substr(2, 5)}`;
setRoomId(room);
setPlayerId(player);

```
const playerRef = ref(db, `games/${room}/players/${player}`);
set(playerRef, { online: true });
onDisconnect(playerRef).remove();

const phaseRef = ref(db, `games/${room}/phase`);
onValue(phaseRef, (snapshot) => {
  setStep(snapshot.val() || "waiting");
});

const scoresRef = ref(db, `games/${room}/scores`);
onValue(scoresRef, (snap) => {
  if (snap.exists()) setScores(snap.val());
});

const mirrorCardRef = ref(db, `games/${room}/mirrorCard`);
onValue(mirrorCardRef, (snap) => {
  if (snap.exists()) setMirrorCard(snap.val());
});

const assocRef = ref(db, `games/${room}/association`);
onValue(assocRef, (snap) => {
  if (snap.exists()) setAssociation(snap.val());
});

const choiceRef = ref(db, `games/${room}/choices/${player}`);
onValue(choiceRef, (snap) => {
  if (snap.exists()) setSelectedCard(snap.val());
});
```

}, \[]);

const startGame = () => {
const shuffled = \[...imageUrls].sort(() => 0.5 - Math.random());
const myDeck = shuffled.slice(0, 3);
const mirror = shuffled\[3];
set(ref(db, `games/${roomId}/mirrorCard`), mirror);
set(ref(db, `games/${roomId}/deck/${playerId}`), myDeck);
setPlayerDeck(myDeck);
set(ref(db, `games/${roomId}/phase`), "association");
};

const submitAssociation = () => {
set(ref(db, `games/${roomId}/association`), association);
set(ref(db, `games/${roomId}/phase`), "choice");
};

const chooseCard = (card) => {
set(ref(db, `games/${roomId}/choices/${playerId}`), card);
setSelectedCard(card);
set(ref(db, `games/${roomId}/phase`), "result");
};

const newRound = () => {
setAssociation("");
setSelectedCard(null);
setResult(null);
startGame();
};

return ( <div className="game-container"> <h1 className="title">MirrorMind</h1>
{step === "waiting" && ( <div className="fade-in"> <p className="subtitle">Ожидание второго игрока...</p> </div>
)}

```
  {step === "association" && (
    <div className="fade-in">
      <p>Введите ассоциацию для вашей карты:</p>
      <input value={association} onChange={(e) => setAssociation(e.target.value)} />
      <button onClick={submitAssociation}>Отправить</button>
    </div>
  )}

  {step === "choice" && (
    <div className="fade-in">
      <p>Выберите карту, подходящую к ассоциации: "{association}"</p>
      <div className="cards">
        {playerDeck.map((card, index) => (
          <img
            key={index}
            src={card}
            alt="card"
            className={`card ${selectedCard === card ? "selected" : ""}`}
            onClick={() => chooseCard(card)}
          />
        ))}
      </div>
    </div>
  )}

  {step === "result" && (
    <div className="fade-in">
      <p>Результат:</p>
      <p>Вы выбрали {selectedCard === mirrorCard ? "зеркальную" : "неверную"} карту.</p>
      <p>Очки — Игрок: {scores.player} | Зеркало: {scores.mirror}</p>
      <button onClick={newRound}>Новый раунд</button>
    </div>
  )}
</div>
```

);
}

export default App;
