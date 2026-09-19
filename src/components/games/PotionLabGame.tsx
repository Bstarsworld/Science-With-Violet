import React, { useState } from 'react';
import { Sparkles, RotateCcw, Award, Flame, Droplets } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';

interface Ingredient {
  id: string;
  name: string;
  type: 'acid' | 'base' | 'color' | 'soap';
  color: string;
  emoji: string;
  desc: string;
}

const INGREDIENTS: Ingredient[] = [
  { id: 'vinegar', name: 'Vinegar', type: 'acid', color: '#fef08a', emoji: '🫗', desc: 'Mild Acetic Acid' },
  { id: 'baking-soda', name: 'Baking Soda', type: 'base', color: '#ffffff', emoji: '🍚', desc: 'Sodium Bicarbonate Base' },
  { id: 'dish-soap', name: 'Dish Soap', type: 'soap', color: '#06b6d4', emoji: '🧴', desc: 'Surface Tension Breaker' },
  { id: 'ruby-red', name: 'Red Dye', type: 'color', color: '#ef4444', emoji: '🔴', desc: 'Food Coloring' },
  { id: 'ocean-blue', name: 'Blue Dye', type: 'color', color: '#3b82f6', emoji: '🔵', desc: 'Food Coloring' },
  { id: 'sunny-yellow', name: 'Yellow Dye', type: 'color', color: '#eab308', emoji: '🟡', desc: 'Food Coloring' },
];

export const PotionLabGame: React.FC = () => {
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [flaskColor, setFlaskColor] = useState<string>('#93c5fd');
  const [isFizzing, setIsFizzing] = useState<boolean>(false);
  const [reactionMsg, setReactionMsg] = useState<string>('Select ingredients below to pour into Violet’s science beaker!');
  const [score, setScore] = useState<number>(0);
  const [discoveredReactions, setDiscoveredReactions] = useState<string[]>([]);

  const handleAddIngredient = (ing: Ingredient) => {
    soundFx.playBubble();
    const next = [...addedItems, ing.id];
    setAddedItems(next);

    // Color mixing logic
    if (ing.type === 'color') {
      if (ing.id === 'ruby-red') {
        setFlaskColor(prev => prev === '#3b82f6' ? '#a855f7' : prev === '#eab308' ? '#f97316' : '#ef4444');
      } else if (ing.id === 'ocean-blue') {
        setFlaskColor(prev => prev === '#ef4444' ? '#a855f7' : prev === '#eab308' ? '#22c55e' : '#3b82f6');
      } else if (ing.id === 'sunny-yellow') {
        setFlaskColor(prev => prev === '#ef4444' ? '#f97316' : prev === '#3b82f6' ? '#22c55e' : '#eab308');
      }
    }

    // Reaction checks
    const hasAcid = next.includes('vinegar');
    const hasBase = next.includes('baking-soda');
    const hasSoap = next.includes('dish-soap');

    if (hasAcid && hasBase && hasSoap && !discoveredReactions.includes('elephant-foam')) {
      setIsFizzing(true);
      soundFx.playFanfare();
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      setReactionMsg('🎉 SUPER FOAM ERUPTION! Acid + Base + Soap = Giant Carbon Dioxide Foam Cloud!');
      setDiscoveredReactions([...discoveredReactions, 'elephant-foam']);
      setScore(s => s + 50);
      setTimeout(() => setIsFizzing(false), 3000);
    } else if (hasAcid && hasBase && !discoveredReactions.includes('acid-base')) {
      setIsFizzing(true);
      soundFx.playFanfare();
      setReactionMsg('✨ FIZZING REACTION! Vinegar (Acid) + Baking Soda (Base) created Carbon Dioxide (CO₂) Gas!');
      setDiscoveredReactions([...discoveredReactions, 'acid-base']);
      setScore(s => s + 30);
      setTimeout(() => setIsFizzing(false), 2500);
    } else {
      setReactionMsg(`Added ${ing.name} (${ing.desc}) into the beaker!`);
    }
  };

  const handleReset = () => {
    soundFx.playPop(1);
    setAddedItems([]);
    setFlaskColor('#93c5fd');
    setIsFizzing(false);
    setReactionMsg('Beaker washed clean! Ready for a new chemistry reaction!');
  };

  return (
    <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border-2 border-pink-200 shadow-sm space-y-4">
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-['Titan_One'] text-base text-pink-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pink-500" />
            Violet’s Potion & Reaction Lab
          </span>
          <p className="text-xs text-purple-900 font-medium">Mix acids, bases, and colors to trigger safe bubbling reactions!</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-pink-100 text-pink-800 text-xs font-['Titan_One'] px-2.5 py-1 rounded-full border border-pink-300">
            ⭐ {score} Pts
          </span>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 cursor-pointer transition-transform hover:rotate-180"
            title="Clean beaker"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Animated Beaker Stage */}
      <div className="relative mx-auto w-40 h-48 border-4 border-purple-300 rounded-b-3xl rounded-t-lg bg-white/60 backdrop-blur-md overflow-hidden flex flex-col justify-end p-2 shadow-inner">
        {/* Beaker Measurement Lines */}
        <div className="absolute left-2 top-6 text-[9px] font-mono text-purple-400 select-none space-y-3">
          <div>— 200ml</div>
          <div>— 150ml</div>
          <div>— 100ml</div>
          <div>— 50ml</div>
        </div>

        {/* Liquid Layer */}
        <div
          className={`w-full rounded-b-2xl transition-all duration-700 relative ${
            isFizzing ? 'animate-pulse' : ''
          }`}
          style={{
            height: `${Math.min(25 + addedItems.length * 15, 85)}%`,
            backgroundColor: flaskColor,
            boxShadow: `0 0 25px ${flaskColor}88`,
          }}
        >
          {/* Surface Bubbles */}
          <div className="absolute inset-x-0 -top-2 flex justify-around text-xs animate-bounce">
            <span>🫧</span>
            <span>✨</span>
            <span>🫧</span>
          </div>
        </div>

        {/* Overflowing Foam Cloud on Big Reaction */}
        {isFizzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-bounce z-10">
            <span className="text-4xl filter drop-shadow-md">🫧🌋✨</span>
            <span className="text-xs font-['Titan_One'] text-pink-700 bg-white/90 px-2 py-0.5 rounded-full mt-1 shadow-md">
              FIZZZZZZ!
            </span>
          </div>
        )}
      </div>

      {/* Real-time Reaction Feedback Message */}
      <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-center">
        <p className="text-xs font-bold text-purple-950">{reactionMsg}</p>
      </div>

      {/* Ingredients Shelf */}
      <div>
        <p className="text-xs font-['Titan_One'] text-purple-700 mb-2 uppercase tracking-wide">
          Pick Reagents to Add:
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {INGREDIENTS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleAddIngredient(item)}
              className="p-2 rounded-xl border-2 border-purple-200 bg-white hover:bg-pink-50 hover:border-pink-400 hover:scale-105 active:scale-95 transition-all cursor-pointer flex flex-col items-center shadow-sm"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-[11px] font-bold text-purple-900 mt-1">{item.name}</span>
              <span className="text-[9px] text-purple-500 font-semibold">{item.type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Discoveries Badge List */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-purple-100">
        <span className="text-[11px] font-bold text-purple-600">Reactions Found:</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
          discoveredReactions.includes('acid-base')
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-gray-100 text-gray-400'
        }`}>
          {discoveredReactions.includes('acid-base') ? '✅ CO₂ Acid-Base Fizz' : '🔒 Acid + Base'}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
          discoveredReactions.includes('elephant-foam')
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-gray-100 text-gray-400'
        }`}>
          {discoveredReactions.includes('elephant-foam') ? '✅ Mega Foam Eruption' : '🔒 Acid + Base + Soap'}
        </span>
      </div>
    </div>
  );
};
