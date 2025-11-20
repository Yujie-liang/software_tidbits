import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Key } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('gemini_api_key');
      if (storedKey) {
        setApiKey(storedKey);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      onClose();
      // Optional: Reload to ensure service picks it up if not dynamic enough, 
      // but our service reads on each request so it should be fine.
      // We might want to trigger a re-render or just let the next spin pick it up.
    }
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/10 rounded-lg">
              <Key size={20} />
            </div>
            <h3 className="text-xl font-bold">API 設定</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type={isVisible ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800 font-mono text-sm"
              />
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium px-2 py-1 rounded"
              >
                {isVisible ? "HIDE" : "SHOW"}
              </button>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              您的 API Key 僅會儲存在瀏覽器的 LocalStorage 中，直接用於與 Google Gemini API 通訊，不會傳送到任何中間伺服器。
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClear}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium text-sm"
            >
              <Trash2 size={16} />
              清除設定
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition-all font-medium text-sm shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              儲存設定
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
