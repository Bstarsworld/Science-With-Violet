import React, { useState } from 'react';
import { X, Heart, Mail, Sparkles, Send, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface AboutContactModalProps {
  type: 'about' | 'contact';
  onClose: () => void;
}

export const AboutContactModal: React.FC<AboutContactModalProps> = ({ type, onClose }) => {
  const [sentMessage, setSentMessage] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');

  const TARGET_EMAIL = 'info@intrepidmediagiant.com';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playFanfare();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    const subject = encodeURIComponent(`Science with Violet: Note from ${formData.name}`);
    const body = encodeURIComponent(
      `Hello Violet & The Lab Team!\n\nExplorer Name: ${formData.name}\nParent/Contact Email: ${formData.email}\n\nDiscovery / Message:\n${formData.message}\n\n-- Sent from Science With Violet --`
    );
    const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
    setLastMailtoUrl(mailtoUrl);
    setSentMessage(true);

    // Launch mail client
    try {
      window.location.href = mailtoUrl;
    } catch {
      // Fallback if blocked
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl border-4 border-white shadow-2xl overflow-hidden flex flex-col text-purple-950">
        {/* Header */}
        <div className="bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span 
              onClick={() => soundFx.playPop(1.4)}
              className="text-3xl bg-white/20 p-2 rounded-2xl cursor-pointer transition-transform duration-700 hover:rotate-[360deg] hover:scale-125 inline-block select-none"
              title="Spin me!"
            >
              {type === 'about' ? '🔬' : '💌'}
            </span>
            <div>
              <h2 className="font-['Titan_One'] text-2xl tracking-wide">
                {type === 'about' ? 'ABOUT VIOLET' : 'CONTACT THE LAB'}
              </h2>
              <p className="text-white/80 text-xs font-semibold">
                {type === 'about' ? 'Meet the young scientist on a cosmic mission!' : 'Have a question or discovery to share?'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playPop(0.9);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-transform duration-500 hover:rotate-180 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {type === 'about' ? (
            <>
              <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-2xl border border-purple-200">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-3xl shadow-md flex-shrink-0">
                  👩🏽‍🔬
                </div>
                <div>
                  <h3 className="font-['Titan_One'] text-lg text-purple-900">Hello, Explorer!</h3>
                  <p className="text-xs text-purple-700 font-semibold leading-relaxed mt-0.5">
                    "I believe science is the ultimate playground. From mixing vibrant fizzing potions to gazing at distant ringed nebulas, every curiosity is a doorway to wonder!"
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-medium text-purple-900 leading-relaxed">
                <p>
                  <strong>Science with Violet</strong> is a whimsical, interactive 3D universe built to spark curiosity, joyful discovery, and fearless experimentation for young minds and families everywhere.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-purple-100">
                  <div className="bg-purple-100/50 p-2.5 rounded-xl text-center">
                    <span className="text-xl">🌟</span>
                    <p className="font-bold mt-1 text-purple-900">Hands-on STEM</p>
                    <p className="text-[10px] text-purple-600">Real physics & chemistry</p>
                  </div>
                  <div className="bg-pink-100/50 p-2.5 rounded-xl text-center">
                    <span className="text-xl">🚀</span>
                    <p className="font-bold mt-1 text-purple-900">Cosmic Wonder</p>
                    <p className="text-[10px] text-pink-600">Astronomy & dinosaurs</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {sentMessage ? (
                <div className="py-6 text-center space-y-3">
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto animate-bounce" />
                  <h3 className="font-['Titan_One'] text-xl text-purple-900">Email Beamed to the Lab!</h3>
                  <p className="text-xs text-purple-700 font-medium max-w-sm mx-auto leading-relaxed">
                    Your message has been pre-addressed to <strong className="text-purple-900 font-bold">info@intrepidmediagiant.com</strong>.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                    {lastMailtoUrl && (
                      <a
                        href={lastMailtoUrl}
                        className="px-4 py-2 rounded-full font-['Titan_One'] text-xs uppercase bg-purple-600 hover:bg-purple-700 text-white shadow transition-transform hover:scale-105 inline-flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Re-open Email App
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setSentMessage(false);
                        setFormData({ name: '', email: '', message: '' });
                      }}
                      className="px-4 py-2 rounded-full font-['Titan_One'] text-xs uppercase bg-purple-100 hover:bg-purple-200 text-purple-900 transition-colors"
                    >
                      Send Another Note
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSend} className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-purple-600 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200/80">
                    <span className="font-bold flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-purple-500" />
                      Direct to Lab Inbox:
                    </span>
                    <a
                      href={`mailto:${TARGET_EMAIL}`}
                      className="font-extrabold text-purple-800 hover:underline"
                    >
                      {TARGET_EMAIL}
                    </a>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-purple-800 mb-1">Junior Scientist Name:</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Leo the Astronaut"
                      className="w-full px-3 py-2 bg-purple-50 rounded-xl border border-purple-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-purple-800 mb-1">Email / Parent's Contact:</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="explorer@sciencewithviolet.com"
                      className="w-full px-3 py-2 bg-purple-50 rounded-xl border border-purple-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-purple-800 mb-1">What did you discover?</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell Violet about your experiment or favorite dinosaur..."
                      className="w-full px-3 py-2 bg-purple-50 rounded-xl border border-purple-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full font-['Titan_One'] text-xs uppercase tracking-wider bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Beam Message to info@intrepidmediagiant.com
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-purple-50 border-t border-purple-200 flex justify-end">
          <button
            onClick={() => {
              soundFx.playPop(0.9);
              onClose();
            }}
            className="px-5 py-1.5 rounded-full font-['Titan_One'] text-xs bg-purple-200 hover:bg-purple-300 text-purple-900 cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
