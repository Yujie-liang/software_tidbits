import React from 'react';
import { X, Share2, Copy, BookOpen, Terminal, Lightbulb } from 'lucide-react';
import { Tidbit } from '../types';

interface PrizeModalProps {
  tidbit: Tidbit | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrizeModal: React.FC<PrizeModalProps> = ({ tidbit, isOpen, onClose }) => {
  if (!isOpen || !tidbit) return null;

  // Strip markdown code blocks if the AI included them despite instructions
  const cleanCode = tidbit.code 
    ? tidbit.code.replace(/^```\w*\n?/i, '').replace(/```$/, '').trim()
    : null;

  const handleCopy = () => {
    let text = `【${tidbit.title}】\n${tidbit.content}\n\n進階詳解：${tidbit.explanation}`;
    if (cleanCode) {
      text += `\n\nCode:\n${cleanCode}`;
    }
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all scale-100 animate-bounceIn my-auto">
        
        {/* Header with Color Strip */}
        <div 
          className="h-24 rounded-t-2xl flex items-center justify-between px-6 relative overflow-hidden"
          style={{ backgroundColor: tidbit.color }}
        >
          <div className="flex items-center gap-4 z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/50 flex items-center justify-center shadow-sm text-2xl">
               💊
            </div>
            <div>
              <div className="text-white/80 text-xs font-bold tracking-widest uppercase mb-1">Category</div>
              <div className="text-white font-bold tracking-wider text-lg bg-black/20 px-3 py-0.5 rounded-full inline-block backdrop-blur-sm">
                {tidbit.category}
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="z-10 p-2 bg-black/10 hover:bg-black/30 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Background decorative circles */}
          <div className="absolute -right-8 -top-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-10 -bottom-10 w-32 h-32 bg-black/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Title & Core Concept */}
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {tidbit.title}
            </h2>
            <div className="flex gap-3 items-start">
              <div className="mt-1 text-indigo-500 shrink-0">
                <Lightbulb size={24} />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed font-medium">
                {tidbit.content}
              </p>
            </div>
          </div>

          <hr className="border-gray-100 my-6" />

          {/* Advanced Explanation */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-indigo-700 font-bold mb-3 text-lg">
              <BookOpen size={22} />
              <h3>進階詳解</h3>
            </div>
            <div className="bg-indigo-50/60 p-5 rounded-xl border border-indigo-100/50 text-gray-700 leading-7 text-base shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
              {tidbit.explanation}
            </div>
          </div>

          {/* Code Snippet - Only render if available */}
          {cleanCode && (
             <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
                  <Terminal size={22} />
                  <h3>程式範例</h3>
                </div>
                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">CODE</span>
              </div>
              
              <div className="relative bg-[#1e1e1e] rounded-xl p-5 overflow-hidden shadow-lg border border-gray-800 group">
                {/* Window controls decoration */}
                <div className="flex gap-1.5 absolute top-3 left-4 opacity-50">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                
                <div className="mt-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                    <code>{cleanCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-4">
            <button 
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-colors"
            >
              <Copy size={18} />
              複製筆記
            </button>
            <button 
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              收入囊中
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};