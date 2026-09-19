/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CosmicBackground } from './components/CosmicBackground';
import { ThreeCanvas } from './components/ThreeCanvas';
import { TopNav } from './components/TopNav';
import { HeroHeader } from './components/HeroHeader';
import { NodeModal } from './components/NodeModal';
import { AboutContactModal } from './components/AboutContactModal';
import { ArcadeModal } from './components/ArcadeModal';
import { VideosModal } from './components/VideosModal';
import { SCIENCE_NODES } from './data/scienceData';
import { ScienceNodeData, ActiveModal } from './types';
import { soundFx } from './utils/audio';
import { Sparkles, MessageCircle, RefreshCw, Gamepad2, Play, Film } from 'lucide-react';

export default function App() {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isVideoWarping, setIsVideoWarping] = useState(false);
  const [violetGreeting, setVioletGreeting] = useState<string | null>(
    'Hi, young scientist! Click the "VIDEOS" planet to watch experiments, or tap orbiting worlds & games!'
  );

  const handleSelectNode = (node: ScienceNodeData) => {
    console.log(`Clicked node: ${node.title}`);
    setActiveModal({ type: 'node', data: node });
  };

  const handleOpenVideos = () => {
    soundFx.playWhoosh();
    soundFx.playFanfare();
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#ef4444', '#f43f5e', '#ec4899', '#fde047', '#38bdf8'],
    });
    setIsVideoWarping(true);
    setTimeout(() => {
      setIsVideoWarping(false);
      setActiveModal({ type: 'videos' });
    }, 420);
  };

  const handleVioletClick = () => {
    const greetings = [
      'Welcome to my laboratory in space! Click the VIDEOS planet in the center to watch our YouTube playlist!',
      'Did you know that hot water can sometimes freeze faster than cold water? It’s called the Mpemba Effect!',
      'Science is all about asking "why?" and doing fun experiments to find out!',
      'Give that Dino Digs planet a spin—you can excavate real fossilized bones!',
      'Bubbles, rocket gravity, and dinosaur footprints—my favorite things in the universe!',
      'Check out the Games Arcade to test if bowling balls float or sink in water!',
    ];
    const picked = greetings[Math.floor(Math.random() * greetings.length)];
    setVioletGreeting(picked);
    soundFx.playFanfare();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { x: 0.55, y: 0.4 },
      colors: ['#ff4b8b', '#c084fc', '#38bdf8'],
    });
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#7645b8] font-['Fredoka']">
      {/* 1. Animated Cosmic Pastel Background */}
      <CosmicBackground />

      {/* 2. WebGL Three.js Scene (Planet, Violet, 6 Orbiting Nodes, Starfield, Parallax) */}
      <ThreeCanvas
        onSelectNode={handleSelectNode}
        onVioletClick={handleVioletClick}
        onOpenVideos={handleOpenVideos}
      />

      {/* 3. Fixed Overlay UI */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none">
        {/* Top Header & Navigation */}
        <div className="w-full flex flex-col pointer-events-auto">
          <TopNav
            onOpenAbout={() => setActiveModal({ type: 'about' })}
            onOpenContact={() => setActiveModal({ type: 'contact' })}
            onOpenGames={() => setActiveModal({ type: 'arcade' })}
            onOpenVideos={handleOpenVideos}
            onSelectNode={handleSelectNode}
            onResetCamera={() => {
              setVioletGreeting('Welcome back to orbit! Ready for the next experiment?');
            }}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />

          {/* Hero 3D Extruded Title and Subtitle */}
          <HeroHeader />
        </div>

        {/* Bottom Dock / HUD Area: Docked safely at bottom away from central planet */}
        <div className="w-full pointer-events-none pb-2 sm:pb-3 px-4 sm:px-6 flex flex-col items-center gap-2">
          {/* Violet's Interactive Speech Balloon / Hint Box */}
          {violetGreeting && (
            <div className="pointer-events-auto max-w-md w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white/95 hover:bg-white backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-[0_8px_25px_rgba(76,29,149,0.3)] border-2 border-white/90 flex items-center gap-2.5 group transition-all">
                <button 
                  onClick={handleVioletClick}
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-lg flex-shrink-0 cursor-pointer shadow-sm transform transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-120"
                  title="Tap Violet for a new secret!"
                >
                  👩🏽‍🔬
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-['Titan_One'] uppercase tracking-wider text-purple-600 flex items-center gap-1">
                    <span>Violet says</span>
                    <Sparkles className="w-2.5 h-2.5 text-pink-500 animate-spin" style={{ animationDuration: '4s' }} />
                  </p>
                  <p className="text-xs text-purple-950 font-bold leading-snug line-clamp-2">
                    "{violetGreeting}"
                  </p>
                </div>
                <button
                  onClick={() => setVioletGreeting(null)}
                  className="text-purple-400 hover:text-purple-700 text-xs p-1 rounded-md font-bold cursor-pointer transition-transform duration-300 hover:rotate-90"
                  title="Dismiss tip"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Bottom Floating Interactive Cosmic Badges (Desktop) & Mobile Pill Tray */}
          <div className="w-full flex items-center justify-between">
            <div 
              onClick={handleOpenVideos}
              className="pointer-events-auto hidden md:flex items-center gap-2 bg-gradient-to-r from-red-500/90 to-pink-600/90 hover:from-red-600 hover:to-pink-700 text-white px-4 py-1.5 rounded-full border-2 border-white/80 shadow-[0_4px_15px_rgba(239,68,68,0.3)] cursor-pointer transition-all duration-300 group hover:scale-105"
              title="Click the middle planet or here to watch Science Videos!"
            >
              <Play className="w-4 h-4 fill-current transition-transform duration-700 group-hover:scale-125 inline-block" />
              <span className="text-xs font-['Titan_One'] tracking-wide">
                VIDEOS (Middle Planet)
              </span>
            </div>

            {/* Center Dock Buttons */}
            <div className="pointer-events-auto flex items-center gap-2">
              {/* Videos Quick Launch Pill */}
              <button
                onClick={handleOpenVideos}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white px-3.5 sm:px-4 py-1.5 rounded-full shadow-lg border-2 border-white/80 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                title="Watch Science Video Playlist"
              >
                <Film className="w-4 h-4 text-yellow-300" />
                <span className="text-xs font-['Titan_One'] tracking-wide">
                  WATCH VIDEOS
                </span>
              </button>

              {/* Science Games Quick Launch Pill */}
              <button
                onClick={() => {
                  soundFx.playPop(1.2);
                  setActiveModal({ type: 'arcade' });
                }}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-3.5 sm:px-4 py-1.5 rounded-full shadow-lg border-2 border-white/80 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <Gamepad2 className="w-4 h-4 animate-bounce" />
                <span className="text-xs font-['Titan_One'] tracking-wide">
                  SCIENCE GAMES
                </span>
                <span className="bg-yellow-400 text-purple-950 text-[9px] font-black px-1.5 py-0.2 rounded-full hidden sm:inline">
                  6
                </span>
              </button>
            </div>

            {/* Mobile / Screen reader friendly quick-dock at bottom for effortless touch exploration */}
            <div className="pointer-events-auto flex sm:hidden items-center justify-center gap-1.5 overflow-x-auto w-full py-0.5">
              <button
                onClick={handleOpenVideos}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-red-600 shadow-sm flex items-center gap-1 flex-shrink-0"
              >
                <span>🎬</span>
                <span>Videos</span>
              </button>
              {SCIENCE_NODES.map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    soundFx.playPop(1.1);
                    handleSelectNode(node);
                  }}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm flex items-center gap-1 flex-shrink-0"
                  style={{ backgroundColor: node.color }}
                >
                  <span>{node.emoji}</span>
                  <span>{node.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <div 
              onClick={() => {
                soundFx.playPop(1.4);
                handleVioletClick();
              }}
              className="pointer-events-auto hidden md:flex items-center gap-2 bg-white/75 hover:bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border-2 border-white/80 shadow-[0_4px_15px_rgba(112,26,117,0.15)] text-purple-900 cursor-pointer transition-all duration-300 group hover:scale-105"
              title="Ask Violet for science secrets!"
            >
              <span className="text-xl transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-125 inline-block select-none">
                🚀
              </span>
              <span className="text-xs font-['Titan_One'] text-purple-800">
                Science Secret
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Cosmic Warp Portal Overlay on Launch */}
      {isVideoWarping && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/40 via-pink-600/50 to-purple-900/50 backdrop-blur-sm animate-in fade-in duration-150" />
          <div className="relative flex flex-col items-center gap-4 animate-in zoom-in-75 duration-300">
            <div 
              className="w-36 h-36 rounded-full border-8 border-yellow-300 bg-gradient-to-tr from-red-500 to-pink-500 flex items-center justify-center text-7xl shadow-[0_0_100px_rgba(244,63,94,1)] animate-bounce"
            >
              🎬
            </div>
            <div className="bg-black/75 px-6 py-2 rounded-full border-2 border-pink-400 backdrop-blur-md shadow-2xl">
              <span className="font-['Titan_One'] text-xl sm:text-2xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wider uppercase animate-pulse">
                🚀 WARPING TO SCIENCE VIDEOS...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Active Modals */}
      {activeModal && activeModal.type === 'videos' && (
        <VideosModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal && activeModal.type === 'node' && (
        <NodeModal
          node={activeModal.data}
          defaultTab={activeModal.defaultTab}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal && activeModal.type === 'arcade' && (
        <ArcadeModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal && (activeModal.type === 'about' || activeModal.type === 'contact') && (
        <AboutContactModal
          type={activeModal.type}
          onClose={() => setActiveModal(null)}
        />
      )}
    </main>
  );
}
