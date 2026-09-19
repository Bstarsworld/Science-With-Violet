import React from 'react';
import { X, Sparkles, ExternalLink, Play, Film, Tv, Share2, Info } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface VideosModalProps {
  onClose: () => void;
}

const PLAYLIST_URL = 'https://www.youtube.com/watch?v=JJm0CvRy22o&list=PLCRrqpkDfnJyzq5_RNT6uzPgd6rWoCGux';
const EMBED_URL = 'https://www.youtube-nocookie.com/embed/JJm0CvRy22o?list=PLCRrqpkDfnJyzq5_RNT6uzPgd6rWoCGux&autoplay=1&enablejsapi=1&rel=0';

export const VideosModal: React.FC<VideosModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/75 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-4xl bg-gradient-to-b from-purple-950 via-slate-900 to-purple-950 rounded-3xl border-4 border-pink-400/80 shadow-[0_0_60px_rgba(236,72,153,0.4)] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300"
      >
        {/* Neon Marquee Header */}
        <div className="relative px-5 py-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-700 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-3xl shadow-inner animate-pulse">
              🎬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Titan_One'] text-2xl sm:text-3xl tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                  Violet’s Science Theater
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white">
                  <Play className="w-3 h-3 fill-current" /> Videos & Playlist
                </span>
              </div>
              <p className="text-pink-100 text-xs sm:text-sm font-semibold flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Watch awesome science episodes & real experiment videos!</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playPop(1.2)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-['Titan_One'] transition-all hover:scale-105 border border-white/30 cursor-pointer shadow-sm"
              title="Open full playlist on YouTube"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                soundFx.playPop(0.9);
                onClose();
              }}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform hover:scale-110 hover:rotate-90 cursor-pointer shadow-sm border border-white/30"
              title="Close Theater"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Video Player Main Stage */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Responsive 16:9 Video Canvas Frame */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-pink-500/40 bg-black aspect-video group">
            <iframe
              src={EMBED_URL}
              title="Science with Violet Playlist"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Quick Playlist Controls & Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Playlist Info Box */}
            <div className="sm:col-span-2 bg-purple-900/40 rounded-2xl p-3.5 border border-purple-500/30 text-white space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-['Titan_One'] text-sm text-pink-300 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-pink-400" />
                  Featured Science Video Playlist
                </span>
                <span className="text-[11px] font-mono bg-pink-500/20 text-pink-200 px-2 py-0.5 rounded-full border border-pink-500/30">
                  Auto-playing Next Video
                </span>
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                Enjoy hands-on science experiments, space explorations, dinosaur discoveries, and real-life chemistry adventures. Use the playlist menu inside the player to jump between any episode!
              </p>
            </div>

            {/* Direct YouTube Action Box */}
            <div className="bg-gradient-to-br from-red-950/60 to-purple-950/60 rounded-2xl p-3.5 border border-red-500/30 text-white flex flex-col justify-between">
              <div>
                <span className="font-['Titan_One'] text-xs text-red-300 flex items-center gap-1">
                  <Tv className="w-3.5 h-3.5 text-red-400" />
                  Full Screen & Subtitles
                </span>
                <p className="text-[11px] text-red-200/80 mt-1">
                  Prefer to watch on the YouTube app or cast to your TV?
                </p>
              </div>

              <a
                href={PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playPop(1.2)}
                className="mt-2.5 w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-['Titan_One'] text-xs flex items-center justify-center gap-2 transition-all hover:scale-102 shadow-md cursor-pointer text-center"
              >
                <span>Open YouTube Playlist</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Science Video Episode Topics Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-['Titan_One'] text-purple-300 uppercase tracking-wider mr-1">
              Episode Topics:
            </span>
            {[
              { emoji: '🧪', text: 'Chemical Reactions' },
              { emoji: '🚀', text: 'Space & Planets' },
              { emoji: '🦖', text: 'Fossils & Dinosaurs' },
              { emoji: '🦒', text: 'Animal Adaptations' },
              { emoji: '❤️', text: 'Human Body' },
              { emoji: '🔍', text: 'Density Mysteries' },
            ].map((topic, i) => (
              <span
                key={i}
                className="bg-purple-900/60 border border-purple-400/30 text-purple-200 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-semibold"
              >
                <span>{topic.emoji}</span>
                <span>{topic.text}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-purple-950/90 border-t border-purple-800/80 flex items-center justify-between">
          <span className="text-xs text-purple-300 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Science with Violet • Elementary Video Collection
          </span>
          <button
            onClick={() => {
              soundFx.playPop(0.9);
              onClose();
            }}
            className="px-5 py-1.5 rounded-full font-['Titan_One'] text-xs bg-purple-700 hover:bg-purple-600 text-white cursor-pointer shadow-sm transition-all"
          >
            Back to Laboratory Planet
          </button>
        </div>
      </div>
    </div>
  );
};
