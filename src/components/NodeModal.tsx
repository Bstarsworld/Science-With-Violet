import React, { useState } from 'react';
import { X, Sparkles, Award, Lightbulb, Clock, CheckCircle, BookOpen, Gamepad2, FlaskConical } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScienceNodeData } from '../types';
import { soundFx } from '../utils/audio';

// Interactive mini-games
import { PotionLabGame } from './games/PotionLabGame';
import { SpaceGravityGame } from './games/SpaceGravityGame';
import { DinoDigGame } from './games/DinoDigGame';
import { AnimalHabitatGame } from './games/AnimalHabitatGame';
import { HumanBodyGame } from './games/HumanBodyGame';
import { DensitySinkFloatGame } from './games/DensitySinkFloatGame';

interface NodeModalProps {
  node: ScienceNodeData;
  onClose: () => void;
  defaultTab?: 'explore' | 'game' | 'experiment';
}

export const NodeModal: React.FC<NodeModalProps> = ({ node, onClose, defaultTab = 'explore' }) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'game' | 'experiment'>(defaultTab);
  const [checkedMaterials, setCheckedMaterials] = useState<Record<number, boolean>>({});

  const triggerCelebration = () => {
    soundFx.playFanfare();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: [node.color, '#ff4b8b', '#9333ea', '#38bdf8', '#22c55e', '#fbbf24'],
    });
  };

  const toggleMaterial = (idx: number) => {
    soundFx.playPop(1.2);
    setCheckedMaterials((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/65 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-3xl border-4 border-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{
          boxShadow: `0 20px 50px ${node.glowColor}, 0 0 0 1px rgba(255,255,255,0.8)`,
        }}
      >
        {/* Header Ribbon */}
        <div 
          className="relative px-5 py-4 text-white flex items-center justify-between shadow-md"
          style={{
            background: `linear-gradient(135deg, ${node.color} 0%, ${node.accentColor} 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <span 
              className="text-4xl filter drop-shadow-md bg-white/20 p-2 rounded-2xl cursor-pointer transition-transform duration-700 hover:rotate-[360deg] hover:scale-120 inline-block select-none"
              title="Spin me!"
              onClick={() => soundFx.playPop(1.5)}
            >
              {node.emoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Titan_One'] text-2xl sm:text-3xl tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {node.title}
                </h2>
                <span className="hidden sm:inline-block bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
                  K–5 Science
                </span>
              </div>
              <p className="text-white/95 text-xs sm:text-sm font-bold tracking-wide mt-0.5">
                {node.subtitle}
              </p>
            </div>
          </div>

          <button
            id="modal-close-btn"
            onClick={() => {
              soundFx.playPop(0.9);
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform duration-500 cursor-pointer shadow-sm hover:rotate-180 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3 Main Navigation Tabs */}
        <div className="bg-purple-50/90 border-b border-purple-200 px-4 py-2 flex items-center justify-between sm:justify-start gap-2">
          <button
            onClick={() => { soundFx.playPop(1); setActiveTab('explore'); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-['Titan_One'] flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-purple-700 text-white shadow-md scale-105'
                : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Explore & Facts</span>
          </button>

          <button
            onClick={() => { soundFx.playPop(1.1); setActiveTab('game'); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-['Titan_One'] flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'bg-pink-600 text-white shadow-md scale-105'
                : 'bg-white text-purple-900 border border-purple-200 hover:bg-pink-50'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Play Game</span>
            <span className="bg-yellow-400 text-purple-950 text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
              NEW
            </span>
          </button>

          <button
            onClick={() => { soundFx.playPop(1.2); setActiveTab('experiment'); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-['Titan_One'] flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'experiment'
                ? 'bg-emerald-600 text-white shadow-md scale-105'
                : 'bg-white text-purple-900 border border-purple-200 hover:bg-emerald-50'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Try At Home</span>
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-purple-950 flex-1">
          {/* TAB 1: EXPLORE & SCIENCE FACTS */}
          {activeTab === 'explore' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Big Science Question Card */}
              <div 
                className="rounded-2xl p-4 text-white shadow-sm flex items-start gap-3"
                style={{ background: `linear-gradient(135deg, ${node.color} 0%, ${node.accentColor} 100%)` }}
              >
                <span className="text-3xl filter drop-shadow">💡</span>
                <div>
                  <span className="text-[10px] font-['Titan_One'] uppercase tracking-widest text-white/90">
                    The Big Science Question
                  </span>
                  <p className="text-sm sm:text-base font-extrabold leading-snug mt-0.5">
                    "{node.bigQuestion}"
                  </p>
                  <p className="text-xs text-white/90 mt-1">
                    {node.description}
                  </p>
                </div>
              </div>

              {/* Core Concepts Pill Row */}
              <div>
                <span className="text-xs font-['Titan_One'] text-purple-800 uppercase tracking-wider block mb-2">
                  What Elementary Scientists Learn:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {node.coreConcepts.map((concept, idx) => (
                    <span 
                      key={idx}
                      className="bg-purple-100/90 text-purple-900 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Violet's Science Secret Banner */}
              <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 flex items-start gap-3 shadow-inner">
                <div className="w-10 h-10 rounded-full bg-amber-200 flex-shrink-0 flex items-center justify-center text-amber-800">
                  <Lightbulb className="w-5 h-5 text-amber-700 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-['Titan_One'] uppercase tracking-wider text-amber-800">
                    Violet's Cosmic Secret
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-amber-950 mt-0.5">
                    {node.funFact}
                  </p>
                </div>
              </div>

              {/* 4 Awesome Accurate Science Facts Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-['Titan_One'] text-sm sm:text-base text-purple-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    Awesome Elementary Science Facts:
                  </h3>
                  <button
                    onClick={triggerCelebration}
                    className="text-xs font-bold px-3 py-1 bg-white hover:bg-purple-100 rounded-full border border-purple-300 text-purple-700 flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Cheer!
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {node.awesomeFacts.map((fact, idx) => (
                    <div 
                      key={idx}
                      className="bg-white p-3.5 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-2xl">{fact.emoji}</span>
                          {fact.gradeBadge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                              {fact.gradeBadge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-['Titan_One'] text-xs text-purple-950 leading-snug">
                          {fact.headline}
                        </h4>
                        <p className="text-xs text-purple-800/90 font-medium mt-1 leading-relaxed">
                          {fact.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Jump to Game Banner */}
              <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 p-4 rounded-2xl border-2 border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-center sm:text-left">
                  <span className="text-3xl">🎮</span>
                  <div>
                    <h4 className="font-['Titan_One'] text-sm text-purple-950">Ready to play hands-on?</h4>
                    <p className="text-xs text-purple-800 font-semibold">Test your scientific skills in the interactive mini-game!</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundFx.playPop(1.2);
                    setActiveTab('game');
                  }}
                  className="px-5 py-2 rounded-full font-['Titan_One'] text-xs bg-pink-600 hover:bg-pink-700 text-white shadow-md cursor-pointer transition-transform hover:scale-105 flex-shrink-0"
                >
                  Launch Mini-Game ➔
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PLAY SCIENCE GAME */}
          {activeTab === 'game' && (
            <div className="animate-in fade-in duration-200">
              {node.id === 'fun-experiments' && <PotionLabGame />}
              {node.id === 'space-explorer' && <SpaceGravityGame />}
              {node.id === 'dino-digs' && <DinoDigGame />}
              {node.id === 'animal-world' && <AnimalHabitatGame />}
              {node.id === 'human-body' && <HumanBodyGame />}
              {node.id === 'mystery-quests' && <DensitySinkFloatGame />}
            </div>
          )}

          {/* TAB 3: TRY IT AT HOME (Safe Kitchen Experiment) */}
          {activeTab === 'experiment' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Experiment Header Banner */}
              <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-200">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="bg-emerald-600 text-white font-['Titan_One'] text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Safe Kitchen Science
                  </span>
                  <div className="flex items-center gap-3 text-xs text-emerald-800 font-bold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {node.homeExperiment.timeEstimate}
                    </span>
                    <span className="bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      {node.homeExperiment.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="font-['Titan_One'] text-lg sm:text-xl text-emerald-950">
                  {node.homeExperiment.title}
                </h3>
                <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                  {node.homeExperiment.subtitle}
                </p>
              </div>

              {/* Materials Checklist */}
              <div className="bg-white p-4 rounded-2xl border-2 border-purple-100 shadow-sm">
                <h4 className="font-['Titan_One'] text-xs uppercase tracking-wider text-purple-800 mb-2.5 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Gather Your Laboratory Materials:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {node.homeExperiment.materials.map((mat, idx) => (
                    <div 
                      key={idx}
                      onClick={() => toggleMaterial(idx)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer border transition-all ${
                        checkedMaterials[idx]
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 line-through opacity-80'
                          : 'bg-purple-50/70 border-purple-200 text-purple-950 hover:bg-purple-100'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={!!checkedMaterials[idx]}
                        onChange={() => {}}
                        className="accent-emerald-600 cursor-pointer"
                      />
                      <span>{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="bg-white p-4 rounded-2xl border-2 border-purple-100 shadow-sm space-y-3">
                <h4 className="font-['Titan_One'] text-xs uppercase tracking-wider text-purple-800">
                  Step-by-Step Experiment Instructions:
                </h4>
                <div className="space-y-2.5">
                  {node.homeExperiment.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-700 text-white font-['Titan_One'] text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-purple-950 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why This Works (The Science Behind It) */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border-2 border-indigo-200">
                <h4 className="font-['Titan_One'] text-xs uppercase tracking-wider text-indigo-900 mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  Why This Works (The Science Behind It):
                </h4>
                <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                  {node.homeExperiment.scienceWhy}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-purple-50 border-t border-purple-200 flex items-center justify-between">
          <span className="text-xs text-purple-700 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            Science with Violet • Elementary Science Lab
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
