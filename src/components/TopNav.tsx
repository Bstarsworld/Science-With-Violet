import React, { useState } from 'react';
import { Search, Volume2, VolumeX, Sparkles, Orbit, Compass, Mail, Gamepad2, Play, Music } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { SCIENCE_NODES } from '../data/scienceData';
import { ScienceNodeData } from '../types';

interface TopNavProps {
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenGames: () => void;
  onOpenVideos: () => void;
  onSelectNode: (node: ScienceNodeData) => void;
  onResetCamera: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenAbout,
  onOpenContact,
  onOpenGames,
  onOpenVideos,
  onSelectNode,
  onResetCamera,
  soundEnabled,
  onToggleSound,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredNodes = searchQuery.trim()
    ? SCIENCE_NODES.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.activities.some((a) =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : [];

  return (
    <header className="relative z-30 w-full px-4 sm:px-8 pt-2 sm:pt-3 pb-1 flex items-center justify-between pointer-events-auto">
      {/* Navigation Pills on Left */}
      <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main Navigation">
        <button
          id="nav-home-btn"
          onClick={() => {
            soundFx.playPop(1.1);
            onResetCamera();
          }}
          className="nav-pill group px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm tracking-wide font-extrabold cursor-pointer flex items-center gap-1.5"
        >
          <Orbit className="w-4 h-4 text-purple-700 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-125" />
          <span>HOME</span>
          <Sparkles className="w-3 h-3 text-pink-500 animate-spin" style={{ animationDuration: '4s' }} />
        </button>
        <button
          id="nav-games-btn"
          onClick={() => {
            soundFx.playPop(1.15);
            onOpenGames();
          }}
          className="nav-pill group px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm tracking-wide font-extrabold cursor-pointer flex items-center gap-1.5 bg-gradient-to-r from-pink-500/15 to-purple-500/15 border-pink-300/60"
          title="Open Science Games Arcade!"
        >
          <Gamepad2 className="w-3.5 h-3.5 text-pink-600 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-125" />
          <span>GAMES</span>
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
        </button>
        <button
          id="nav-videos-btn"
          onClick={() => {
            soundFx.playPop(1.15);
            onOpenVideos();
          }}
          className="nav-pill group px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm tracking-wide font-extrabold cursor-pointer flex items-center gap-1.5 bg-gradient-to-r from-red-500/15 to-pink-500/15 border-red-300/60"
          title="Watch Science Video Playlist"
        >
          <Play className="w-3.5 h-3.5 text-red-500 fill-current transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-125" />
          <span>VIDEOS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        </button>
        <button
          id="nav-about-btn"
          onClick={() => {
            soundFx.playPop(1.2);
            onOpenAbout();
          }}
          className="nav-pill group px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm tracking-wide font-extrabold cursor-pointer flex items-center gap-1.5"
        >
          <Compass className="w-3.5 h-3.5 text-purple-700 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-125" />
          <span>ABOUT</span>
        </button>
        <button
          id="nav-contact-btn"
          onClick={() => {
            soundFx.playPop(1.3);
            onOpenContact();
          }}
          className="nav-pill group px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm tracking-wide font-extrabold cursor-pointer flex items-center gap-1.5"
        >
          <Mail className="w-3.5 h-3.5 text-purple-700 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-125" />
          <span>CONTACT</span>
        </button>
      </nav>

      {/* Right Controls: Search Bar & Sound Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sound & Music Toggle Button with Equalizer */}
        <button
          id="nav-sound-btn"
          onClick={() => {
            onToggleSound();
            soundFx.playPop(0.9);
          }}
          title={soundEnabled ? 'Mute Background Music & Sound FX' : 'Enable Background Music & Sound FX'}
          className="nav-pill group h-9 sm:h-10 px-2 sm:px-2.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 shadow-sm"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-purple-800 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110" />
              <div className="flex items-end gap-0.5 h-3.5 pr-0.5">
                <span className="w-1 bg-pink-500 rounded-full animate-pulse h-2.5"></span>
                <span className="w-1 bg-purple-600 rounded-full animate-pulse h-3.5 delay-75"></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-2 delay-150"></span>
              </div>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-purple-400 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110" />
              <span className="text-[10px] font-bold text-purple-400 uppercase hidden sm:inline">Muted</span>
            </>
          )}
        </button>

        {/* Rounded Glassmorphic Search Bar */}
        <div className="relative">
          <div className="group relative flex items-center bg-white/60 hover:bg-white/75 focus-within:bg-white/90 transition-all backdrop-blur-md rounded-full border-2 border-white/90 shadow-[0_4px_15px_rgba(112,26,117,0.2)] px-3 py-1.5 w-36 sm:w-56 focus-within:w-48 sm:focus-within:w-64">
            <input
              type="text"
              id="science-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search..."
              className="w-full bg-transparent text-purple-900 placeholder-purple-500/70 text-xs sm:text-sm font-semibold outline-none pr-7 pl-1"
            />
            <div className="absolute right-1.5 w-7 h-7 rounded-full bg-gradient-to-tr from-pink-400 to-purple-400 flex items-center justify-center text-white shadow-[0_2px_6px_rgba(219,39,119,0.4)] transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
              <Search className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div 
              className="absolute right-0 top-12 w-72 sm:w-80 bg-white/90 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border-2 border-purple-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              onMouseLeave={() => setIsSearchOpen(false)}
            >
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-400 border-b border-purple-100 flex items-center justify-between">
                <span>Found Topics</span>
                <Sparkles className="w-3 h-3 text-pink-400 animate-spin" />
              </div>
              {filteredNodes.length > 0 ? (
                <div className="max-h-60 overflow-y-auto mt-1 space-y-1">
                  {filteredNodes.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => {
                        soundFx.playPop(1.2);
                        onSelectNode(node);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-purple-100/70 transition-colors flex items-center gap-3 group cursor-pointer"
                    >
                      <span className="text-xl p-1.5 rounded-lg bg-white shadow-sm transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-125 inline-block">
                        {node.emoji}
                      </span>
                      <div>
                        <p className="font-['Titan_One'] text-sm text-purple-900 group-hover:text-pink-600 transition-colors">
                          {node.title}
                        </p>
                        <p className="text-xs text-purple-600 font-medium line-clamp-1">
                          {node.subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-purple-500 font-medium">
                  No science adventures found matching "{searchQuery}". Try "rocket", "volcano", or "slime"!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
