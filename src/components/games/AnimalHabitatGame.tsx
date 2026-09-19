import React, { useState } from 'react';
import { Sparkles, Eye, RotateCcw, Award, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';

interface CamoCritter {
  id: string;
  name: string;
  emoji: string;
  habitat: string;
  bgGradient: string;
  clue: string;
  adaptation: string;
}

const CAMO_ANIMALS: CamoCritter[] = [
  {
    id: 'chameleon',
    name: 'Veiled Chameleon',
    emoji: '🦎',
    habitat: 'Tropical Rainforest Leaves',
    bgGradient: 'from-emerald-700 via-green-600 to-lime-700',
    clue: 'Look for the curled tail blending with the tree vine!',
    adaptation: 'Special skin cells called chromatophores expand and contract to change color for camouflage and temperature regulation!',
  },
  {
    id: 'snow-owl',
    name: 'Arctic Snowy Owl',
    emoji: '🦉',
    habitat: 'Tundra Snowdrift',
    bgGradient: 'from-slate-100 via-blue-50 to-indigo-100',
    clue: 'Look for bright golden eyes hiding in the soft white snowbanks!',
    adaptation: 'Pure white plumage acts as winter camouflage to sneak up on lemmings, while thick foot feathers act as snowshoes!',
  },
  {
    id: 'octopus',
    name: 'Mimic Octopus',
    emoji: '🐙',
    habitat: 'Coral Reef Seabed',
    bgGradient: 'from-cyan-800 via-teal-700 to-emerald-900',
    clue: 'Look along the sandy ocean floor near the waving seaweed!',
    adaptation: 'Can change both its color AND its skin texture in less than one second to look like toxic lionfish or sea snakes!',
  },
];

const FOOD_CHAIN_STEPS = [
  { id: 'sun', label: '1. The Sun', emoji: '☀️', role: 'Energy Source' },
  { id: 'plant', label: '2. Oak Leaf', emoji: '🌿', role: 'Producer (Makes Food)' },
  { id: 'insect', label: '3. Caterpillar', emoji: '🐛', role: 'Herbivore (Primary Consumer)' },
  { id: 'bird', label: '4. Bluebird', emoji: '🐦', role: 'Carnivore (Secondary Consumer)' },
  { id: 'hawk', label: '5. Red Hawk', emoji: '🦅', role: 'Apex Predator (Top of Chain)' },
];

export const AnimalHabitatGame: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camo' | 'chain'>('camo');

  // Camouflage State
  const [currentCamoIdx, setCurrentCamoIdx] = useState<number>(0);
  const [isFound, setIsFound] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Food Chain State
  const [chainOrder, setChainOrder] = useState<string[]>([]);
  const [chainCompleted, setChainCompleted] = useState<boolean>(false);

  const critter = CAMO_ANIMALS[currentCamoIdx];

  const handleSpotAnimal = () => {
    if (isFound) return;
    soundFx.playFanfare();
    setIsFound(true);
    setScore(s => s + 25);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleNextAnimal = () => {
    soundFx.playPop(1.1);
    setIsFound(false);
    setCurrentCamoIdx((prev) => (prev + 1) % CAMO_ANIMALS.length);
  };

  const handleAddChainStep = (stepId: string) => {
    if (chainOrder.includes(stepId)) return;
    soundFx.playPop(1 + chainOrder.length * 0.15);
    const next = [...chainOrder, stepId];
    setChainOrder(next);

    if (next.length === FOOD_CHAIN_STEPS.length) {
      const isPerfect = next.every((id, idx) => id === FOOD_CHAIN_STEPS[idx].id);
      if (isPerfect) {
        setChainCompleted(true);
        soundFx.playFanfare();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  const handleResetChain = () => {
    soundFx.playPop(1);
    setChainOrder([]);
    setChainCompleted(false);
  };

  return (
    <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border-2 border-green-200 shadow-sm space-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-green-100 p-1 rounded-full">
          <button
            onClick={() => { soundFx.playPop(1); setActiveTab('camo'); }}
            className={`px-3 py-1 rounded-full text-xs font-['Titan_One'] transition-all cursor-pointer ${
              activeTab === 'camo'
                ? 'bg-green-700 text-white shadow-sm'
                : 'text-green-900 hover:text-black'
            }`}
          >
            🦎 Camouflage Safari
          </button>
          <button
            onClick={() => { soundFx.playPop(1.1); setActiveTab('chain'); }}
            className={`px-3 py-1 rounded-full text-xs font-['Titan_One'] transition-all cursor-pointer ${
              activeTab === 'chain'
                ? 'bg-green-700 text-white shadow-sm'
                : 'text-green-900 hover:text-black'
            }`}
          >
            🌿 Food Chain Builder
          </button>
        </div>

        <span className="text-xs font-['Titan_One'] text-green-800 bg-green-100 px-2.5 py-1 rounded-full">
          ⭐ {score} Points
        </span>
      </div>

      {activeTab === 'camo' ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-green-900">
            <span className="font-['Titan_One']">Habitat: {critter.habitat}</span>
            <span className="text-green-700 font-bold">Safari #{currentCamoIdx + 1} of {CAMO_ANIMALS.length}</span>
          </div>

          {/* Interactive Safari Search Canvas */}
          <div className={`relative h-48 rounded-2xl bg-gradient-to-br ${critter.bgGradient} overflow-hidden p-4 border-2 border-green-500 shadow-inner flex items-center justify-center cursor-crosshair group`}>
            {/* Environmental Decoys (Leaves, Snowflakes, Seaweed) */}
            <div className="absolute inset-0 flex flex-wrap justify-between items-center p-6 opacity-60 text-2xl select-none pointer-events-none">
              <span>🌿</span>
              <span>🍃</span>
              <span>🌿</span>
              <span>🪨</span>
              <span>🌱</span>
              <span>🍃</span>
            </div>

            {/* Hidden Camouflaged Critter Button */}
            <button
              onClick={handleSpotAnimal}
              className={`relative z-10 transition-all cursor-pointer p-3 rounded-full ${
                isFound
                  ? 'bg-white/90 scale-150 animate-bounce shadow-2xl border-4 border-yellow-400'
                  : 'opacity-40 hover:opacity-75 hover:scale-110'
              }`}
              style={{
                filter: isFound ? 'none' : 'grayscale(30%) blur(0.5px)',
              }}
              title="Tap to spot the hidden animal!"
            >
              <span className="text-4xl select-none">{critter.emoji}</span>
            </button>
          </div>

          {/* Clue and Secret Revelation */}
          <div className="bg-green-50 p-3 rounded-xl border border-green-200">
            {isFound ? (
              <div className="animate-in fade-in">
                <p className="font-['Titan_One'] text-xs text-green-800 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  You spotted the {critter.name}!
                </p>
                <p className="text-xs text-green-950 font-medium mt-1">
                  <strong>Wild Superpower:</strong> {critter.adaptation}
                </p>
              </div>
            ) : (
              <p className="text-xs text-green-800 font-medium">
                🔍 <strong>Field Clue:</strong> {critter.clue}
              </p>
            )}
          </div>

          {/* Next Button */}
          {isFound && (
            <button
              onClick={handleNextAnimal}
              className="w-full py-2 rounded-full font-['Titan_One'] text-xs bg-green-700 hover:bg-green-800 text-white shadow cursor-pointer transition-transform hover:scale-102"
            >
              Search Next Wild Habitat ➔
            </button>
          )}
        </div>
      ) : (
        /* Food Chain Builder */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-green-900 font-semibold">
              Energy starts at the Sun! Tap living organisms in order from producer to top predator:
            </p>
            <button
              onClick={handleResetChain}
              className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-700 cursor-pointer"
              title="Reset chain"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Current Chain Tray */}
          <div className="min-h-[56px] bg-green-950 p-2 rounded-xl flex items-center gap-1.5 overflow-x-auto border-2 border-green-500">
            {chainOrder.map((stepId, idx) => {
              const step = FOOD_CHAIN_STEPS.find(s => s.id === stepId);
              const isCorrect = FOOD_CHAIN_STEPS[idx]?.id === stepId;
              return (
                <div
                  key={stepId}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0 text-white ${
                    isCorrect ? 'bg-emerald-600' : 'bg-red-500'
                  }`}
                >
                  <span className="text-xl">{step?.emoji}</span>
                  <div className="leading-tight">
                    <div className="font-['Titan_One'] text-[11px]">{step?.label.split('. ')[1]}</div>
                    <div className="text-[9px] text-emerald-200">{step?.role.split(' ')[0]}</div>
                  </div>
                  {idx < chainOrder.length - 1 && <span className="text-white/60 ml-1">➔</span>}
                </div>
              );
            })}
            {chainOrder.length === 0 && (
              <span className="text-xs text-green-300 italic px-2">
                Tap the components below to build your forest food chain ➔
              </span>
            )}
          </div>

          {chainCompleted && (
            <div className="bg-emerald-100 border border-emerald-300 p-2.5 rounded-xl text-center">
              <p className="font-['Titan_One'] text-sm text-emerald-900">
                🎉 Ecosystem Thriving! Energy flows from Sun to Plants to Consumers!
              </p>
            </div>
          )}

          {/* Food Chain Step Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {FOOD_CHAIN_STEPS.map((step) => {
              const isPicked = chainOrder.includes(step.id);
              return (
                <button
                  key={step.id}
                  disabled={isPicked}
                  onClick={() => handleAddChainStep(step.id)}
                  className={`p-2.5 rounded-xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
                    isPicked
                      ? 'bg-gray-100 border-gray-200 opacity-40 cursor-not-allowed'
                      : 'bg-white border-green-300 hover:border-green-600 hover:scale-105 active:scale-95 shadow-sm'
                  }`}
                >
                  <span className="text-3xl">{step.emoji}</span>
                  <span className="text-[11px] font-bold text-green-950 mt-1">{step.label.split('. ')[1]}</span>
                  <span className="text-[9px] text-green-700 mt-0.5">{step.role}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
