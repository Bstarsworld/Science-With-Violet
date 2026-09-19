import React, { useState } from 'react';
import { Heart, Activity, Sparkles, CheckCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';

interface OrganItem {
  id: string;
  name: string;
  emoji: string;
  location: string;
  function: string;
  fact: string;
}

const ORGANS: OrganItem[] = [
  { id: 'brain', name: 'Brain', emoji: '🧠', location: 'Inside Cranium (Skull)', function: 'Thinks, dreams, coordinates motion', fact: 'Contains 86 billion neurons firing electrical sparks!' },
  { id: 'heart', name: 'Heart', emoji: '❤️', location: 'Center-Left Chest Cavity', function: 'Pumps blood 24 hours a day', fact: 'Beats about 100,000 times every single day!' },
  { id: 'lungs', name: 'Lungs', emoji: '🫁', location: 'Protected by Rib Cage', function: 'Breathes in oxygen, expels CO₂', fact: 'Has millions of tiny air sacs called alveoli!' },
  { id: 'stomach', name: 'Stomach', emoji: '🥣', location: 'Upper Abdomen', function: 'Charns food with digestive acid', fact: 'Produces a special mucus lining so it doesn’t digest itself!' },
  { id: 'skeleton', name: 'Skeleton', emoji: '🦴', location: 'Framework of Whole Body', function: 'Protects organs & allows walking', fact: 'Adults have 206 strong bones!' },
];

export const HumanBodyGame: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'heart' | 'organs'>('heart');

  // Heart Cardio State
  const [activityLevel, setActivityLevel] = useState<number>(1); // 0=Sleep, 1=Walk, 2=Soccer, 3=Sprint
  const bpmValues = [60, 85, 130, 175];
  const activityNames = ['Sleeping / Resting', 'Walking to Class', 'Recess Soccer Match', 'Olympic 100m Sprint'];
  const currentBpm = bpmValues[activityLevel];

  // Organ Puzzle State
  const [placedOrgans, setPlacedOrgans] = useState<string[]>([]);
  const [puzzleWon, setPuzzleWon] = useState<boolean>(false);

  const handleHeartBeat = () => {
    soundFx.playPop(0.7 + (currentBpm / 200) * 0.8);
  };

  const handlePlaceOrgan = (organId: string) => {
    if (placedOrgans.includes(organId)) return;
    soundFx.playPop(1 + placedOrgans.length * 0.15);
    const next = [...placedOrgans, organId];
    setPlacedOrgans(next);

    if (next.length === ORGANS.length) {
      setPuzzleWon(true);
      soundFx.playFanfare();
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleResetPuzzle = () => {
    soundFx.playPop(1);
    setPlacedOrgans([]);
    setPuzzleWon(false);
  };

  return (
    <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border-2 border-sky-200 shadow-sm space-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-sky-100 p-1 rounded-full">
          <button
            onClick={() => { soundFx.playPop(1); setActiveTab('heart'); }}
            className={`px-3 py-1 rounded-full text-xs font-['Titan_One'] transition-all cursor-pointer ${
              activeTab === 'heart'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-sky-900 hover:text-black'
            }`}
          >
            ❤️ Cardio Heart Pump
          </button>
          <button
            onClick={() => { soundFx.playPop(1.1); setActiveTab('organs'); }}
            className={`px-3 py-1 rounded-full text-xs font-['Titan_One'] transition-all cursor-pointer ${
              activeTab === 'organs'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-sky-900 hover:text-black'
            }`}
          >
            🧩 Organ Anatomy Puzzle
          </button>
        </div>
      </div>

      {activeTab === 'heart' ? (
        <div className="space-y-4 text-center">
          {/* Beating Heart Display Arena */}
          <div className="h-44 bg-gradient-to-b from-sky-950 to-indigo-950 rounded-2xl flex flex-col items-center justify-center p-4 border-2 border-sky-400 relative overflow-hidden">
            <div className="absolute top-2 right-3 text-xs font-mono text-sky-200 flex items-center gap-1">
              <Activity className="w-4 h-4 text-red-400 animate-pulse" />
              <span>{currentBpm} BPM (Beats/Min)</span>
            </div>

            {/* Beating Heart Icon */}
            <div
              onClick={handleHeartBeat}
              className="text-6xl cursor-pointer transition-transform select-none"
              style={{
                transform: `scale(${1 + (currentBpm / 200) * 0.3})`,
                animation: `pulse ${60 / currentBpm}s infinite`,
              }}
              title="Tap heart to feel the pulse!"
            >
              ❤️
            </div>

            <p className="font-['Titan_One'] text-sm text-sky-200 mt-2">
              State: {activityNames[activityLevel]}
            </p>
            <p className="text-[11px] text-sky-300">
              Pumping oxygen-rich red blood to {activityLevel >= 2 ? 'sprinting muscles!' : 'resting body cells!'}
            </p>
          </div>

          {/* Activity Level Selector */}
          <div>
            <label className="text-xs font-['Titan_One'] text-sky-800 block mb-2">
              Change Violet’s Activity Level:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activityNames.map((name, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundFx.playPop(0.9 + idx * 0.2);
                    setActivityLevel(idx);
                  }}
                  className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                    activityLevel === idx
                      ? 'bg-sky-600 text-white border-sky-700 shadow-md scale-105'
                      : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50'
                  }`}
                >
                  <div>{['😴', '🚶', '⚽', '🏃'][idx]}</div>
                  <div className="text-[11px] font-bold mt-0.5">{name.split(' ')[0]}</div>
                  <div className="text-[9px] opacity-80">{bpmValues[idx]} BPM</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Organ Anatomy Puzzle */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-sky-900 font-semibold">
              Assemble the essential organs inside the human body:
            </p>
            <button
              onClick={handleResetPuzzle}
              className="p-1 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-700 cursor-pointer"
              title="Reset puzzle"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Body Anatomy Silhouette Board */}
          <div className="bg-sky-50 p-3 rounded-2xl border-2 border-sky-300 grid grid-cols-1 sm:grid-cols-5 gap-2">
            {ORGANS.map((organ) => {
              const isPlaced = placedOrgans.includes(organ.id);
              return (
                <div
                  key={organ.id}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-between text-center transition-all ${
                    isPlaced
                      ? 'bg-white border-sky-500 shadow-md'
                      : 'bg-sky-100/60 border-dashed border-sky-300 opacity-70'
                  }`}
                >
                  <span className="text-3xl select-none">
                    {isPlaced ? organ.emoji : '❓'}
                  </span>
                  <p className="font-['Titan_One'] text-xs text-sky-950 mt-1">
                    {organ.name}
                  </p>
                  <p className="text-[9px] text-sky-700 leading-tight mt-0.5">
                    {isPlaced ? organ.location : 'Waiting for doctor...'}
                  </p>
                  {isPlaced && (
                    <span className="mt-1 text-[9px] font-bold bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle className="w-2.5 h-2.5" /> Healthy
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {puzzleWon && (
            <div className="bg-sky-100 border border-sky-300 p-2.5 rounded-xl text-center">
              <p className="font-['Titan_One'] text-sm text-sky-900">
                🎉 Master Anatomist! All 5 vital organs placed and functioning!
              </p>
            </div>
          )}

          {/* Organs to place */}
          <div>
            <span className="text-[11px] font-['Titan_One'] text-sky-800 uppercase block mb-1.5">
              Available Body Organs:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ORGANS.map((organ) => {
                const isPlaced = placedOrgans.includes(organ.id);
                return (
                  <button
                    key={organ.id}
                    disabled={isPlaced}
                    onClick={() => handlePlaceOrgan(organ.id)}
                    className={`p-2 rounded-xl border-2 flex flex-col items-center transition-all cursor-pointer ${
                      isPlaced
                        ? 'bg-gray-100 border-gray-200 opacity-40 cursor-not-allowed'
                        : 'bg-white border-sky-300 hover:border-sky-600 hover:scale-105 active:scale-95 shadow-sm'
                    }`}
                  >
                    <span className="text-2xl">{organ.emoji}</span>
                    <span className="text-[11px] font-bold text-sky-950 mt-0.5">{organ.name}</span>
                    <span className="text-[9px] text-sky-600">{organ.function.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
