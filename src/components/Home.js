import React, { useState } from 'react';
import Confetti from 'react-confetti';
import './Home.css';

const taglines = [
  "Talk to strangers. Anonymously.",
  "Find someone who matches your vibe!",
  "Omagle: Random but real connections.",
  "Chat. Connect. Click Next."
];

function Home({ onSubmit }) {
  const [mood, setMood] = useState('');
  const [interests, setInterests] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);

  const handleSubmit = e => {
    e.preventDefault();
    if (mood && interests) {
      setShowConfetti(true);
      setTimeout(() => {
        onSubmit({ mood, interests: interests.split(',').map(s => s.trim()) });
      }, 1500);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(prev => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {showConfetti && <Confetti />}
      <h1>Omagle 🚀</h1>
      <p className="tagline">{taglines[taglineIndex]}</p>
      <form onSubmit={handleSubmit}>
        <input placeholder="Your Mood (e.g. happy, bored)" value={mood} onChange={e => setMood(e.target.value)} />
        <input placeholder="Your Interests (comma-separated)" value={interests} onChange={e => setInterests(e.target.value)} />
        <button type="submit">Start Chat</button>
      </form>
    </div>
  );
}

export default Home;
