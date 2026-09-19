import React, { useState } from 'react';
import { X, Sparkles, Gamepad2, Award } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { PotionLabGame } from './games/PotionLabGame';
import { SpaceGravityGame } from './games/SpaceGravityGame';
import { DinoDigGame } from './games/DinoDigGame';
import { AnimalHabitatGame } from './games/AnimalHabitatGame';
import { HumanBodyGame } from './games/HumanBodyGame';
import { DensitySinkFloatGame } from './games/DensitySinkFloatGame';

interface ArcadeModalProps {
  onClose: () => void;
  initialGameId?: string;
}

const ARCADE_GAMES = [
  { id: 'potions', title: 'Potion Lab', emoji: '🧪', color: '#ff4b8b', category: 'Chemistry & Reactions', desc: 'Mix acids, bases & colors to trigger bubbling foam eruptions!' },
  { id: 'space', title: 'Gravity Hopper', emoji: '🚀', color: '#9333ea', category: 'Space & Astronomy', desc: 'Jump on Moon, Mars & Jupiter and sort all 8 planets from the Sun!' },
  { id: 'dino', title: 'Fossil Excavator', emoji: '🦖', color: '#f59e0b', category: 'Paleontology & Fossils', desc: 'Brush rock layers, unearth bones & build museum dinosaur skeletons!' },
  { id: 'animal', title: 'Animal Safari', emoji: '🦒', color: '#22c55e', category: 'Life Science & Habitats', desc: 'Spot camouflaged creatures in nature and build healthy food chains!' },
  { id: 'body', title: 'Cardio & Organs', emoji: '🩻', color: '#0ea5e9', category: 'Human Biology & Health', desc: 'Pump the human heart, test sprint speeds & solve the organ puzzle!' },
  { id: 'density', title: 'Sink or Float?', emoji: '🔍', color: '#14b8a6', category: 'Physics & Density Tank', desc: 'Guess which everyday objects float on water and crack Archimedes’ mystery!' },
];

export const ArcadeModal: React.FC<ArcadeModalProps> = ({ onClose, initialGameId }) => {
  const [selectedGame, setSelectedGame] = useState<string>(initialGameId || 'potions');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-3xl border-4 border-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="relative px-5 py-4 bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow bg-white/20 p-2 rounded-2xl">
              🎮
            </span>
            <div>
              <h2 className="font-['Titan_One'] text-2xl sm:text-3xl tracking-wide">
                Violet’s Science Arcade
              </h2>
              <p className="text-white/90 text-xs sm:text-sm font-semibold">
                Hands-on elementary science games for curious kids in Grades K–5!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playPop(0.9);
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Game Switcher Tabs Tray */}
        <div className="bg-purple-100/70 border-b border-purple-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {ARCADE_GAMES.map((g) => {
            const isSelected = selectedGame === g.id;
            return (
              <button
                key={g.id}
                onClick={() => {
                  soundFx.playPop(1.1);
                  setSelectedGame(g.id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-['Titan_One'] flex items-center gap-1.5 flex-shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? 'text-white shadow-md scale-105 border-transparent'
                    : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
                }`}
                style={{
                  backgroundColor: isSelected ? g.color : undefined,
                }}
              >
                <span>{g.emoji}</span>
                <span>{g.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content View Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-purple-950">
          {selectedGame === 'potions' && <PotionLabGame />}
          {selectedGame === 'space' && <SpaceGravityGame />}
          {selectedGame === 'dino' && <DinoDigGame />}
          {selectedGame === 'animal' && <AnimalHabitatGame />}
          {selectedGame === 'body' && <HumanBodyGame />}
          {selectedGame === 'density' && <DensitySinkFloatGame />}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-purple-50 border-t border-purple-200 flex items-center justify-between">
          <span className="text-xs text-purple-700 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            Play, interact, and discover real elementary school science!
          </span>
          <button
            onClick={() => {
              soundFx.playPop(0.9);
              onClose();
            }}
            className="px-5 py-1.5 rounded-full font-['Titan_One'] text-xs bg-purple-700 hover:bg-purple-800 text-white cursor-pointer shadow-sm transition-all"
          >
            Back to Planet
          </button>
        </div>
      </div>
    </div>
  );
};
