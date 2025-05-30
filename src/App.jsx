
import React, { useEffect, useState } from "react";
import { database } from "./firebase";
import { ref, onValue, set } from "firebase/database";

export default function App() {
  const [message, setMessage] = useState("Загрузка...");
  useEffect(() => {
    const messageRef = ref(database, "demo/message");
    onValue(messageRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setMessage(val);
    });
    set(messageRef, "MirrorMind готов!");
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 text-white text-3xl font-bold">
      {message}
    </div>
  );
}
