import React, { useState } from 'react';
import { Sparkles, RotateCcw, Award, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';

interface DinoTarget {
  id: string;
  name: string;
  period: string;
  diet: 'Carnivore (Meat-Eater)' | 'Herbivore (Plant-Eater)';
  emoji: string;
  fossils: {
    part: string;
    label: string;
    emoji: string;
    fact: string;
  }[];
}

const DINOS: DinoTarget[] = [
  {
    id: 't-rex',
    name: 'Tyrannosaurus Rex',
    period: 'Late Cretaceous (68 Million Years Ago)',
    diet: 'Carnivore (Meat-Eater)',
    emoji: '🦖',
    fossils: [
      { part: 'skull', label: 'T-Rex Skull & Serrated Teeth', emoji: '🦴', fact: 'Its jaw had 60 serrated teeth, some as long as 12 inches (the size of bananas)!' },
      { part: 'ribs', label: 'Massive Rib Cage & Spine', emoji: '🩻', fact: 'Deep chest cavity held enormous lungs to power its powerful sprints.' },
      { part: 'legs', label: 'Muscular Running Legs', emoji: '🦵', fact: 'Two giant hind legs with three sharp forward-facing bird-like claws.' },
      { part: 'tail', label: 'Heavy Counter-Balance Tail', emoji: '🦕', fact: 'Held straight out behind to balance the weight of its massive skull while hunting.' },
    ],
  },
  {
    id: 'triceratops',
    name: 'Triceratops Prorsus',
    period: 'Late Cretaceous (66 Million Years Ago)',
    diet: 'Herbivore (Plant-Eater)',
    emoji: '🦏',
    fossils: [
      { part: 'frill', label: 'Bony Neck Frill & 3 Horns', emoji: '🛡️', fact: 'A 6-foot wide solid bone shield to protect its neck from predator bites.' },
      { part: 'beak', label: 'Parrot-Like Horny Beak', emoji: '🦜', fact: 'A curved beak perfect for snipping off tough cycads and prehistoric ferns.' },
      { part: 'body', label: 'Stocky 4-Legged Frame', emoji: '🦣', fact: 'Weighed up to 12 tons—as heavy as two modern African elephants!' },
      { part: 'tail', label: 'Thick Protective Tail', emoji: '🦴', fact: 'Short, sturdy tail providing stable ground support.' },
    ],
  },
];

export const DinoDigGame: React.FC = () => {
  const [selectedDinoIdx, setSelectedDinoIdx] = useState<number>(0);
  const currentDino = DINOS[selectedDinoIdx];

  // Excavation progress per fossil piece (0 = buried in rock, 1 = brushed clean, 2 = assembled in museum)
  const [digStatus, setDigStatus] = useState<number[]>([0, 0, 0, 0]);
  const [activeMessage, setActiveMessage] = useState<string>('Tap the rock patches with your paleontology brush to reveal ancient bones!');

  const handleBrush = (idx: number) => {
    soundFx.playPop(1 + idx * 0.15);
    const next = [...digStatus];
    if (next[idx] === 0) {
      next[idx] = 1;
      setActiveMessage(`Uncovered ${currentDino.fossils[idx].label}! Now tap "Assemble" to mount it!`);
    } else if (next[idx] === 1) {
      next[idx] = 2;
      soundFx.playFanfare();
      setActiveMessage(`Mounted: ${currentDino.fossils[idx].fact}`);
      if (next.every(s => s === 2)) {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      }
    }
    setDigStatus(next);
  };

  const handleReset = (dinoIdx: number) => {
    soundFx.playPop(1);
    setSelectedDinoIdx(dinoIdx);
    setDigStatus([0, 0, 0, 0]);
    setActiveMessage('New dig site located! Brush the rock layers to uncover fossils!');
  };

  const isComplete = digStatus.every(s => s === 2);

  return (
    <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border-2 border-amber-200 shadow-sm space-y-4">
      {/* Header with Dinosaur Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="font-['Titan_One'] text-base text-amber-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Field Paleontology Dig & Assembly
          </span>
          <p className="text-xs text-amber-900 font-semibold">{currentDino.name} • {currentDino.period}</p>
        </div>

        {/* Dino Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-amber-100 p-1 rounded-full self-start sm:self-auto">
          {DINOS.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => handleReset(idx)}
              className={`px-3 py-1 rounded-full text-xs font-['Titan_One'] cursor-pointer transition-all ${
                selectedDinoIdx === idx
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-amber-900 hover:text-black'
              }`}
            >
              {d.emoji} {d.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Dig Site Quarry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {currentDino.fossils.map((fossil, idx) => {
          const status = digStatus[idx];
          return (
            <div
              key={idx}
              className={`rounded-xl p-3 flex flex-col items-center justify-between text-center border-2 transition-all min-h-[140px] ${
                status === 2
                  ? 'bg-amber-50 border-amber-500 shadow-md'
                  : status === 1
                  ? 'bg-yellow-100 border-yellow-400'
                  : 'bg-stone-300 border-stone-400 hover:bg-stone-200'
              }`}
            >
              <div className="w-full flex justify-between items-center text-[10px] font-bold text-stone-600">
                <span>Sector {idx + 1}</span>
                {status === 2 && <CheckCircle className="w-3.5 h-3.5 text-green-600" />}
              </div>

              {/* Center icon */}
              <div className="my-2">
                {status === 0 ? (
                  <span className="text-3xl filter drop-shadow select-none">🪨</span>
                ) : (
                  <span className="text-3xl animate-bounce select-none">{fossil.emoji}</span>
                )}
              </div>

              <div className="w-full">
                <p className="text-[11px] font-bold text-stone-900 line-clamp-1">
                  {status === 0 ? 'Sedimentary Rock' : fossil.label.split(' ')[0]}
                </p>

                <button
                  onClick={() => handleBrush(idx)}
                  disabled={status === 2}
                  className={`mt-1.5 w-full py-1 rounded-lg text-[11px] font-['Titan_One'] cursor-pointer transition-all ${
                    status === 0
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:scale-105'
                      : status === 1
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm animate-pulse'
                      : 'bg-green-100 text-green-800 cursor-default'
                  }`}
                >
                  {status === 0 ? '🖌️ Brush Rock' : status === 1 ? '✨ Mount Bone' : '✅ Mounted'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Field Note / Fact Bubble */}
      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-2.5">
        <span className="text-xl">🦕</span>
        <div className="text-xs">
          <p className="font-bold text-amber-950">{activeMessage}</p>
          <p className="text-amber-800 text-[11px] mt-0.5">
            <strong>Diet Type:</strong> {currentDino.diet}
          </p>
        </div>
      </div>

      {/* Completion Trophy Banner */}
      {isComplete && (
        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 p-3 rounded-xl flex items-center justify-between shadow-lg animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-900" />
            <div>
              <p className="font-['Titan_One'] text-sm">Museum Exhibit Unlocked!</p>
              <p className="text-xs font-semibold">You restored a full {currentDino.name} skeleton for science!</p>
            </div>
          </div>
          <button
            onClick={() => handleReset((selectedDinoIdx + 1) % DINOS.length)}
            className="px-3 py-1.5 rounded-full font-['Titan_One'] text-xs bg-white text-amber-900 hover:bg-amber-50 shadow cursor-pointer"
          >
            Next Dinosaur ➔
          </button>
        </div>
      )}
    </div>
  );
};
