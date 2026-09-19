import React, { useState } from 'react';
import { Sparkles, RotateCcw, Award, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';

interface SinkFloatItem {
  id: string;
  name: string;
  emoji: string;
  densityVsWater: 'floats' | 'sinks';
  densityValue: string; // g/cm³
  explanation: string;
}

const ITEMS: SinkFloatItem[] = [
  { id: 'apple', name: 'Crisp Red Apple', emoji: '🍎', densityVsWater: 'floats', densityValue: '0.84 g/cm³', explanation: 'Floats! About 25% of an apple’s volume is pocketed with air between plant cells!' },
  { id: 'coin', name: 'Metal Coin', emoji: '🪙', densityVsWater: 'sinks', densityValue: '7.8 g/cm³', explanation: 'Sinks! Copper and nickel metal atoms are packed tightly together with high density.' },
  { id: 'wood', name: 'Wooden Block', emoji: '🪵', densityVsWater: 'floats', densityValue: '0.65 g/cm³', explanation: 'Floats! Pine wood is full of microscopic air channels, making it lighter than water.' },
  { id: 'stone', name: 'River Pebble', emoji: '🪨', densityVsWater: 'sinks', densityValue: '2.6 g/cm³', explanation: 'Sinks! Heavy quartz and granite minerals displace less water than their weight.' },
  { id: 'bowling-ball', name: '10-lb Bowling Ball', emoji: '🎳', densityVsWater: 'floats', densityValue: '0.94 g/cm³', explanation: 'SURPRISE! Floats! Any regulation bowling ball under 11.8 lbs is less dense than the water it displaces!' },
  { id: 'pumice', name: 'Pumice Rock', emoji: '🌋', densityVsWater: 'floats', densityValue: '0.70 g/cm³', explanation: 'Floats! This real volcanic rock formed from frothy lava filled with thousands of tiny trapped gas bubbles!' },
  { id: 'diet-soda', name: 'Diet Soda Can', emoji: '🥤', densityVsWater: 'floats', densityValue: '0.98 g/cm³', explanation: 'Floats! Artificial sweetener requires only a tiny fraction of a gram, keeping the can buoyant!' },
  { id: 'regular-soda', name: 'Sugary Soda Can', emoji: '🥫', densityVsWater: 'sinks', densityValue: '1.04 g/cm³', explanation: 'Sinks! 39 grams of dense sugar dissolved inside makes the can denser than water!' },
];

export const DensitySinkFloatGame: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [state, setState] = useState<'predicting' | 'tested'>('predicting');
  const [userGuess, setUserGuess] = useState<'floats' | 'sinks' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [testedHistory, setTestedHistory] = useState<string[]>([]);

  const currentItem = ITEMS[selectedIdx];

  const handleGuess = (guess: 'floats' | 'sinks') => {
    setUserGuess(guess);
    setState('tested');
    soundFx.playBubble();

    const isCorrect = guess === currentItem.densityVsWater;
    if (isCorrect) {
      soundFx.playFanfare();
      setScore(s => s + 10);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      soundFx.playPop(0.8);
    }

    if (!testedHistory.includes(currentItem.id)) {
      setTestedHistory([...testedHistory, currentItem.id]);
    }
  };

  const handleNextItem = () => {
    soundFx.playPop(1.1);
    setState('predicting');
    setUserGuess(null);
    setSelectedIdx((prev) => (prev + 1) % ITEMS.length);
  };

  const handleResetGame = () => {
    soundFx.playPop(1);
    setSelectedIdx(0);
    setState('predicting');
    setUserGuess(null);
    setScore(0);
    setTestedHistory([]);
  };

  const isFloater = currentItem.densityVsWater === 'floats';

  return (
    <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border-2 border-teal-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-['Titan_One'] text-base text-teal-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Sink or Float? Density Tank Lab
          </span>
          <p className="text-xs text-teal-900 font-medium">Test Archimedes’ Principle: Will the object sink or float in water?</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-teal-100 text-teal-900 text-xs font-['Titan_One'] px-2.5 py-1 rounded-full border border-teal-300">
            ⭐ {score} Pts
          </span>
          <button
            onClick={handleResetGame}
            className="p-1.5 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-800 cursor-pointer"
            title="Reset game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Water Tank Arena */}
      <div className="relative h-44 rounded-2xl border-4 border-teal-400 bg-gradient-to-b from-sky-100 via-cyan-100 to-teal-200 overflow-hidden flex flex-col justify-end p-2 shadow-inner">
        {/* Water Surface Line */}
        <div className="absolute top-10 inset-x-0 border-b-2 border-dashed border-cyan-400 flex items-center justify-end px-3">
          <span className="text-[10px] font-mono text-cyan-700 font-bold">Water Level (Density = 1.0 g/cm³)</span>
        </div>

        {/* Bubbles in Tank */}
        <div className="absolute inset-0 pointer-events-none flex justify-around opacity-40 text-xs animate-pulse">
          <span className="self-center">🫧</span>
          <span className="self-end mb-4">🫧</span>
          <span className="self-start mt-12">🫧</span>
        </div>

        {/* Dropped Object Animation */}
        <div
          className="relative z-10 mx-auto transition-all select-none"
          style={{
            transform: state === 'predicting'
              ? 'translateY(-75px) scale(1)'
              : isFloater
              ? 'translateY(-50px) scale(1.1)' // Bobbing at water surface
              : 'translateY(10px) scale(1.1)', // Resting at bottom
            transitionDuration: '0.8s',
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <span className="text-5xl filter drop-shadow-md inline-block animate-bounce" style={{ animationDuration: isFloater ? '2s' : '0s' }}>
            {currentItem.emoji}
          </span>
        </div>

        {/* Tank Floor */}
        <div className="w-full h-3 bg-teal-600/30 rounded-full" />
      </div>

      {/* Item Info & Guess Controls */}
      <div className="bg-teal-50 p-3 rounded-xl border border-teal-200">
        <div className="flex justify-between items-center mb-2">
          <span className="font-['Titan_One'] text-sm text-teal-950">
            Testing: {currentItem.name}
          </span>
          <span className="text-xs font-semibold text-teal-700">
            Item {selectedIdx + 1} of {ITEMS.length}
          </span>
        </div>

        {state === 'predicting' ? (
          <div className="space-y-2">
            <p className="text-xs text-teal-900 font-medium">
              Make your scientific hypothesis! Will this object float on water or sink to the bottom?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleGuess('floats')}
                className="py-2.5 rounded-xl font-['Titan_One'] text-sm bg-cyan-600 hover:bg-cyan-700 text-white shadow-md cursor-pointer transition-all hover:scale-102 flex items-center justify-center gap-1.5"
              >
                <span>⬆️</span> It Floats!
              </button>
              <button
                onClick={() => handleGuess('sinks')}
                className="py-2.5 rounded-xl font-['Titan_One'] text-sm bg-teal-800 hover:bg-teal-900 text-white shadow-md cursor-pointer transition-all hover:scale-102 flex items-center justify-center gap-1.5"
              >
                <span>⬇️</span> It Sinks!
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              {userGuess === currentItem.densityVsWater ? (
                <div className="flex items-center gap-1 text-green-700 font-bold text-xs bg-green-100 px-2 py-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5" /> Hypothesis Correct! (+10 Pts)
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-700 font-bold text-xs bg-red-100 px-2 py-0.5 rounded-full">
                  <X className="w-3.5 h-3.5" /> Great Scientific Test!
                </div>
              )}
              <span className="text-xs font-mono text-teal-800 font-semibold">
                Density: {currentItem.densityValue}
              </span>
            </div>

            <p className="text-xs text-teal-950 font-medium">
              {currentItem.explanation}
            </p>

            <button
              onClick={handleNextItem}
              className="w-full py-2 rounded-full font-['Titan_One'] text-xs bg-teal-700 hover:bg-teal-800 text-white shadow cursor-pointer transition-transform hover:scale-102 mt-1"
            >
              Test Next Item in Tank ➔
            </button>
          </div>
        )}
      </div>

      {/* Item Selectors Shelf */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
        {ITEMS.map((item, idx) => {
          const isDone = testedHistory.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => {
                soundFx.playPop(1);
                setSelectedIdx(idx);
                setState('predicting');
                setUserGuess(null);
              }}
              className={`p-1.5 rounded-xl border-2 flex flex-col items-center cursor-pointer transition-all ${
                selectedIdx === idx
                  ? 'bg-teal-100 border-teal-600 scale-105 shadow-sm'
                  : 'bg-white border-teal-200 hover:bg-teal-50'
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-[9px] font-bold text-teal-900 mt-0.5 truncate w-full text-center">
                {item.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
