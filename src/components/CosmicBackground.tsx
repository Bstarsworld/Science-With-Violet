import React from 'react';

export const CosmicBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Cosmic Pastel Mesh Gradients */}
      <div 
        className="absolute inset-0 opacity-90 transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(circle at 15% 20%, rgba(244, 114, 182, 0.45) 0%, transparent 45%),
            radial-gradient(circle at 85% 15%, rgba(192, 132, 252, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 50% 60%, rgba(168, 85, 247, 0.3) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.35) 0%, transparent 45%),
            radial-gradient(circle at 20% 85%, rgba(244, 114, 182, 0.35) 0%, transparent 45%),
            linear-gradient(135deg, #a77cdb 0%, #8754c5 40%, #6f3aa8 70%, #582692 100%)
          `
        }}
      />

      {/* Whimsical Spiral Galaxy & Mini Planet in Upper Left (as in reference image) */}
      <div className="absolute top-[8%] left-[2%] w-48 h-32 md:w-64 md:h-44 opacity-85 animate-pulse" style={{ animationDuration: '8s' }}>
        {/* Spiral galaxy rings */}
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-[100%] border-4 border-cyan-200/40 rotate-[-25deg] filter blur-[0.5px]" />
          <div className="absolute inset-2 rounded-[100%] border-2 border-pink-200/50 rotate-[-25deg]" />
          <div className="absolute inset-6 rounded-[100%] border border-yellow-200/60 rotate-[-25deg] shadow-[0_0_20px_rgba(56,189,248,0.6)]" />
          
          {/* Mini pastel ringed planet inside galaxy */}
          <div className="absolute top-[35%] left-[30%] w-9 h-9 rounded-full bg-gradient-to-tr from-purple-300 via-pink-200 to-cyan-200 shadow-[0_0_15px_rgba(255,255,255,0.8)]">
            <div className="absolute -inset-1.5 border-2 border-cyan-100/70 rounded-full rotate-45 scale-y-50" />
          </div>

          {/* Little "SCIENCE!" Constellation badge in upper left */}
          <div className="absolute -bottom-2 right-4 text-white/70 font-bold tracking-wider text-xs md:text-sm font-['Titan_One'] rotate-[-12deg] drop-shadow-[0_2px_4px_rgba(74,4,78,0.5)]">
            SCIENCE!
          </div>
        </div>
      </div>

      {/* Constellation in Upper Right */}
      <div className="absolute top-[12%] right-[5%] w-40 h-28 hidden md:block opacity-75">
        <svg className="w-full h-full" viewBox="0 0 160 100" fill="none">
          <line x1="20" y1="30" x2="60" y2="15" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="60" y1="15" x2="100" y2="35" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="100" y1="35" x2="140" y2="20" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="60" y1="15" x2="75" y2="70" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="75" y1="70" x2="120" y2="80" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" />
          
          <circle cx="20" cy="30" r="3.5" fill="#fef08a" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="60" cy="15" r="4.5" fill="#ffffff" />
          <circle cx="100" cy="35" r="4" fill="#fbcfe8" />
          <circle cx="140" cy="20" r="3.5" fill="#a5f3fc" />
          <circle cx="75" cy="70" r="4" fill="#fef08a" />
          <circle cx="120" cy="80" r="3.5" fill="#ffffff" />
        </svg>
        <span className="absolute bottom-0 right-2 text-white/70 font-['Titan_One'] text-xs rotate-[-8deg]">
          SCIENCE!
        </span>
      </div>

      {/* Cute Saturn Planet in Top Header Center-Right */}
      <div className="absolute top-[2.5%] right-[28%] w-10 h-10 hidden sm:block">
        <div className="relative w-full h-full">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-300 via-rose-300 to-cyan-200 shadow-[0_0_12px_rgba(254,240,138,0.7)]" />
          <div className="absolute -inset-1 border-2 border-yellow-200/90 rounded-full rotate-45 scale-y-50" />
        </div>
      </div>

      {/* Whimsical 4-Point Cartoon Stars scattered across */}
      {[
        { top: '8%', left: '36%', size: 24, color: '#fde047', delay: '0s' },
        { top: '24%', left: '7%', size: 20, color: '#ffffff', delay: '1s' },
        { top: '38%', left: '88%', size: 22, color: '#fde047', delay: '2s' },
        { top: '78%', left: '10%', size: 26, color: '#fde047', delay: '1.5s' },
        { top: '70%', left: '92%', size: 20, color: '#ffffff', delay: '0.5s' },
        { top: '48%', left: '3%', size: 18, color: '#e0e7ff', delay: '2.5s' },
        { top: '85%', left: '85%', size: 24, color: '#fde047', delay: '1.8s' },
      ].map((star, idx) => (
        <div 
          key={idx}
          className="absolute select-none pointer-events-none star-twinkle"
          style={{ 
            top: star.top, 
            left: star.left, 
            animationDelay: star.delay,
          }}
        >
          <svg width={star.size} height={star.size} viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" 
              fill={star.color}
              filter="drop-shadow(0 0 6px rgba(254, 240, 138, 0.9))"
            />
          </svg>
        </div>
      ))}

      {/* Soft Drifting 2D Clouds - Bottom & Side fluff layers matching the reference artwork */}
      <div className="absolute -bottom-12 -left-16 w-96 h-48 opacity-75 drift-left">
        <div className="w-full h-full bg-gradient-to-t from-white/90 via-pink-100/70 to-transparent rounded-full filter blur-xl" />
      </div>
      <div className="absolute -bottom-16 left-1/4 w-[38rem] h-56 opacity-85 drift-right">
        <div className="w-full h-full bg-gradient-to-t from-white/95 via-purple-100/60 to-transparent rounded-full filter blur-2xl" />
      </div>
      <div className="absolute -bottom-12 -right-16 w-[30rem] h-52 opacity-80 drift-left">
        <div className="w-full h-full bg-gradient-to-t from-white/90 via-cyan-100/70 to-transparent rounded-full filter blur-xl" />
      </div>

      {/* Top right cloud */}
      <div className="absolute top-12 -right-12 w-64 h-32 opacity-50 drift-right">
        <div className="w-full h-full bg-gradient-to-b from-white/80 via-pink-100/40 to-transparent rounded-full filter blur-lg" />
      </div>
    </div>
  );
};
