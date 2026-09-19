import React, { useState } from 'react';
import { Rocket, Sparkles, Orbit, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';

interface CelestialBody {
  id: string;
  name: string;
  emoji: string;
  gravityFactor: number; // relative to Earth 1.0
  jumpHeightMultiplier: number;
  hangtimeSec: number;
  funFact: string;
  color: string;
}

const WORLDS: CelestialBody[] = [
  { id: 'earth', name: 'Earth', emoji: '🌍', gravityFactor: 1.0, jumpHeightMultiplier: 1.0, hangtimeSec: 0.8, funFact: 'Our home planet! 1G of gravity holds our oceans and atmosphere tight.', color: '#3b82f6' },
  { id: 'moon', name: 'The Moon', emoji: '🌕', gravityFactor: 0.166, jumpHeightMultiplier: 6.0, hangtimeSec: 3.5, funFact: '1/6th gravity! Apollo astronauts bounded across lunar dust like gazelles.', color: '#94a3b8' },
  { id: 'mars', name: 'Mars', emoji: '🪐', gravityFactor: 0.38, jumpHeightMultiplier: 2.6, hangtimeSec: 1.8, funFact: 'The Red Planet has 38% of Earth gravity. You could easily dunk a basketball!', color: '#ef4444' },
  { id: 'jupiter', name: 'Jupiter', emoji: '🌀', gravityFactor: 2.53, jumpHeightMultiplier: 0.39, hangtimeSec: 0.4, funFact: 'Massive gas giant! Gravity is 2.5x stronger—jumping feels like wearing iron boots.', color: '#f59e0b' },
  { id: 'pluto', name: 'Pluto', emoji: '❄️', gravityFactor: 0.06, jumpHeightMultiplier: 16.0, hangtimeSec: 5.0, funFact: 'Icy dwarf planet! A small jump could launch you high above the frozen nitrogen glaciers.', color: '#67e8f9' },
];

const CORRECT_PLANET_ORDER = [
  { name: 'Mercury', emoji: '🪨' },
  { name: 'Venus', emoji: '🟡' },
  { name: 'Earth', emoji: '🌍' },
  { name: 'Mars', emoji: '🔴' },
  { name: 'Jupiter', emoji: '🪐' },
  { name: 'Saturn', emoji: '💫' },
  { name: 'Uranus', emoji: '❄️' },
  { name: 'Neptune', emoji: '🔵' },
];

export const SpaceGravityGame: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gravity' | 'order'>('gravity');

  // Gravity Lab State
  const [selectedWorld, setSelectedWorld] = useState<CelestialBody>(WORLDS[1]); // Default Moon
  const [earthWeight, setEarthWeight] = useState<number>(60); // standard elementary weight in lbs
  const [isJumping, setIsJumping] = useState<boolean>(false);

  // Planet Sorter State
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [orderCompleted, setOrderCompleted] = useState<boolean>(false);

  const handleJump = () => {
    if (isJumping) return;
    soundFx.playPop(1.2);
    soundFx.playWhoosh();
    setIsJumping(true);
    setTimeout(() => {
      setIsJumping(false);
      soundFx.playPop(0.8);
    }, selectedWorld.hangtimeSec * 1000);
  };

  const handleAddPlanetToOrder = (planetName: string) => {
    if (userOrder.includes(planetName)) return;
    soundFx.playPop(1.1 + userOrder.length * 0.1);
    const next = [...userOrder, planetName];
    setUserOrder(next);

    if (next.length === CORRECT_PLANET_ORDER.length) {
      // Check if correctly ordered
      const isPerfect = next.every((p, i) => p === CORRECT_PLANET_ORDER[i].name);
      if (isPerfect) {
        setOrderCompleted(true);
        soundFx.playFanfare();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  const handleResetOrder = () => {
    soundFx.playPop(0.9);
    setUserOrder([]);
    setOrderCompleted(false);
  };

  const calculatedWeight = Math.round(earthWeight * selectedWorld.gravityFactor * 10) / 10;

  return (
    <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border-2 border-purple-200 shadow-sm space-y-4">
      {/* Game Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-purple-100 p-1 rounded-full">
          <button
            onClick={() => { soundFx.playPop(1); setActiveTab('gravity'); }}
            className={`px-3 py-1 rounded-full text-xs font-['Titan_One'] transition-all cursor-pointer ${
              activeTab === 'gravity'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-purple-800 hover:text-purple-950'
            }`}
          >
            🚀 Planetary Gravity Jumper
          </button>
          <button
            onClick={() => { soundFx.playPop(1.1); setActiveTab('order'); }}
            className={`px-3 py-1 rounded-full text-xs font-['Titan_One'] transition-all cursor-pointer ${
              activeTab === 'order'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-purple-800 hover:text-purple-950'
            }`}
          >
            🪐 Solar System Order Quest
          </button>
        </div>
      </div>

      {activeTab === 'gravity' ? (
        <div className="space-y-4">
          {/* Planet Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {WORLDS.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  soundFx.playPop(1.1);
                  setSelectedWorld(w);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-2 ${
                  selectedWorld.id === w.id
                    ? 'bg-purple-700 text-white border-purple-700 scale-105 shadow-md'
                    : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
                }`}
              >
                <span>{w.emoji}</span>
                <span>{w.name}</span>
              </button>
            ))}
          </div>

          {/* Jump Stage Arena */}
          <div className="relative h-44 bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-900 rounded-2xl overflow-hidden p-3 flex flex-col justify-between border-2 border-purple-400">
            {/* Stars background */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />

            {/* Live Stats Header */}
            <div className="relative z-10 flex justify-between items-center text-xs text-purple-200">
              <span className="font-['Titan_One'] text-yellow-300">
                Destination: {selectedWorld.emoji} {selectedWorld.name}
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full font-mono text-cyan-200">
                Gravity: {selectedWorld.gravityFactor}G
              </span>
            </div>

            {/* Astronaut Character in Jump Animation */}
            <div className="relative z-10 flex flex-col items-center justify-end h-full">
              <div
                className="text-4xl transition-all select-none"
                style={{
                  transform: isJumping
                    ? `translateY(-${Math.min(selectedWorld.jumpHeightMultiplier * 18, 90)}px) scale(${1 + selectedWorld.jumpHeightMultiplier * 0.05})`
                    : 'translateY(0px)',
                  transitionDuration: `${selectedWorld.hangtimeSec / 2}s`,
                  transitionTimingFunction: 'ease-out',
                }}
              >
                👩🏾‍🚀
              </div>
              {/* Ground Surface */}
              <div
                className="w-full h-3 rounded-full mt-1 border-t-2"
                style={{ backgroundColor: selectedWorld.color, borderColor: '#ffffff55' }}
              />
            </div>
          </div>

          {/* Weight Comparison Card */}
          <div className="grid grid-cols-2 gap-3 bg-purple-50 p-3 rounded-xl border border-purple-200">
            <div>
              <span className="text-[11px] font-bold text-purple-700 block">Your Earth Weight:</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min="40"
                  max="120"
                  value={earthWeight}
                  onChange={(e) => setEarthWeight(Number(e.target.value))}
                  className="w-24 accent-purple-600 cursor-pointer"
                />
                <span className="font-['Titan_One'] text-sm text-purple-950">{earthWeight} lbs</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-purple-700 block">Weight on {selectedWorld.name}:</span>
              <p className="font-['Titan_One'] text-lg text-pink-600 mt-0.5">
                {calculatedWeight} lbs
              </p>
            </div>
          </div>

          {/* Jump Action Button & Fact */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-purple-800 font-medium">
              💡 {selectedWorld.funFact}
            </p>
            <button
              onClick={handleJump}
              disabled={isJumping}
              className="w-full sm:w-auto px-6 py-2 rounded-full font-['Titan_One'] text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Rocket className="w-4 h-4 animate-bounce" />
              {isJumping ? 'Floating in Orbit...' : `Jump on ${selectedWorld.name}!`}
            </button>
          </div>
        </div>
      ) : (
        /* Planet Order Challenge */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-purple-900 font-semibold">
              Tap the planets in order starting closest to the Sun! (Mnemonic: <span className="text-pink-600 font-bold">M</span>y <span className="text-pink-600 font-bold">V</span>ery <span className="text-pink-600 font-bold">E</span>ducated <span className="text-pink-600 font-bold">M</span>other <span className="text-pink-600 font-bold">J</span>ust <span className="text-pink-600 font-bold">S</span>erved <span className="text-pink-600 font-bold">U</span>s <span className="text-pink-600 font-bold">N</span>achos)
            </p>
            <button
              onClick={handleResetOrder}
              className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 cursor-pointer"
              title="Reset order"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Current Ordered Row */}
          <div className="min-h-[56px] bg-purple-950 p-2 rounded-xl flex items-center gap-1.5 overflow-x-auto border-2 border-purple-400">
            <span className="text-2xl mr-1 select-none" title="The Sun">☀️</span>
            {userOrder.map((name, idx) => {
              const info = CORRECT_PLANET_ORDER.find(p => p.name === name);
              const isCorrectAtThisIndex = CORRECT_PLANET_ORDER[idx]?.name === name;
              return (
                <div
                  key={name}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 flex-shrink-0 text-white ${
                    isCorrectAtThisIndex ? 'bg-emerald-600' : 'bg-red-500'
                  }`}
                >
                  <span>{info?.emoji}</span>
                  <span>{name}</span>
                </div>
              );
            })}
            {userOrder.length === 0 && (
              <span className="text-xs text-purple-300 italic px-2">
                Tap planets below to line them up from the Sun ➔
              </span>
            )}
          </div>

          {/* Win Banner */}
          {orderCompleted && (
            <div className="bg-emerald-100 border border-emerald-300 p-2.5 rounded-xl text-center animate-in zoom-in-95">
              <p className="font-['Titan_One'] text-sm text-emerald-900">
                🎉 Cosmic Champion! You ordered all 8 planets perfectly!
              </p>
            </div>
          )}

          {/* Available Planet Tokens */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {CORRECT_PLANET_ORDER.map((p) => {
              const isUsed = userOrder.includes(p.name);
              return (
                <button
                  key={p.name}
                  disabled={isUsed}
                  onClick={() => handleAddPlanetToOrder(p.name)}
                  className={`p-2 rounded-xl border-2 flex flex-col items-center transition-all cursor-pointer ${
                    isUsed
                      ? 'bg-gray-100 border-gray-200 opacity-40 cursor-not-allowed'
                      : 'bg-white border-purple-200 hover:border-purple-500 hover:scale-105 active:scale-95 shadow-sm'
                  }`}
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="text-[10px] font-bold text-purple-950 mt-1">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
