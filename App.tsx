import React, { useState, useCallback } from 'react';
import { GachaponMachine } from './components/GachaponMachine';
import { PrizeModal } from './components/PrizeModal';
import { StatsChart } from './components/StatsChart';
import { ApiKeyModal } from './components/ApiKeyModal';
import { fetchRandomTidbit } from './services/geminiService';
import { Tidbit, TidbitCategory } from './types';
import { History, RotateCcw, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const CAPSULE_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

const CATEGORY_LIST = Object.values(TidbitCategory);

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTidbit, setCurrentTidbit] = useState<Tidbit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [history, setHistory] = useState<Tidbit[]>([]);
  const [activeTab, setActiveTab] = useState<'machine' | 'collection'>('machine');
  const [selectedCategory, setSelectedCategory] = useState<string>(TidbitCategory.ALL);

  const handleSpin = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Parallelize: Wait for minimum animation time (2s) AND API fetch
      const animationPromise = new Promise(resolve => setTimeout(resolve, 2000));
      const dataPromise = fetchRandomTidbit(selectedCategory);

      const [_, tidbitData] = await Promise.all([animationPromise, dataPromise]);

      const newTidbit: Tidbit = {
        id: uuidv4(),
        ...tidbitData,
        category: tidbitData.category,
        timestamp: Date.now(),
        color: CAPSULE_COLORS[Math.floor(Math.random() * CAPSULE_COLORS.length)]
      };

      setCurrentTidbit(newTidbit);
      setHistory(prev => [newTidbit, ...prev]);

      // Small delay to let the ball "land" before opening
      setTimeout(() => {
        setIsModalOpen(true);
        setIsProcessing(false);
      }, 500);

    } catch (error) {
      console.error("Error in Gacha process", error);
      setIsProcessing(false);
    }
  }, [isProcessing, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-800">

      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              G
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Gacha Dev
            </h1>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('machine')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${activeTab === 'machine' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <RotateCcw size={18} />
              <span className="hidden sm:inline">扭蛋機</span>
            </button>
            <button
              onClick={() => setActiveTab('collection')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${activeTab === 'collection' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <History size={18} />
              <span className="hidden sm:inline">收藏 ({history.length})</span>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-all"
              title="設定 API Key"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">

        {activeTab === 'machine' ? (
          <div className="flex flex-col items-center animate-fadeIn">
            <div className="text-center mb-6 max-w-xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">軟體工程知識扭蛋</h2>
              <p className="text-slate-500 mb-6">
                選擇一個領域，轉動旋鈕，獲得包含深度解析與程式碼實例的知識膠囊。
              </p>

              {/* Category Selector */}
              <div className="flex flex-wrap justify-center gap-2 mb-8 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                {CATEGORY_LIST.map(cat => (
                  <button
                    key={cat}
                    onClick={() => !isProcessing && setSelectedCategory(cat)}
                    disabled={isProcessing}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 active:scale-95
                      ${selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <GachaponMachine
                onSpin={handleSpin}
                isProcessing={isProcessing}
                label={selectedCategory === TidbitCategory.ALL ? "ENGINEERING" : selectedCategory}
              />
            </div>

            {/* Recent History Snippet */}
            {history.length > 0 && (
              <div className="mt-12 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">最近獲得</h3>
                  <button onClick={() => setActiveTab('collection')} className="text-indigo-500 text-sm hover:underline">查看全部</button>
                </div>
                <div className="space-y-3">
                  {history.slice(0, 3).map(item => (
                    <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 group hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => { setCurrentTidbit(item); setIsModalOpen(true); }}>
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="flex-1 truncate">
                        <p className="font-medium text-slate-700 truncate group-hover:text-indigo-600">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fadeIn space-y-8">

            {/* Collection Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">你的知識庫</h2>
                <p className="text-slate-500">目前已收集 {history.length} 個知識膠囊</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Chart Section */}
              <div className="md:col-span-1">
                <StatsChart history={history} />
              </div>

              {/* List Section */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {history.length === 0 ? (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                    <div className="mb-2">還沒有內容</div>
                    <button onClick={() => setActiveTab('machine')} className="text-indigo-500 font-medium hover:underline">
                      去轉一顆吧！
                    </button>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => { setCurrentTidbit(item); setIsModalOpen(true); }}
                      className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase">
                          {item.category}
                        </span>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      </div>
                      <h3 className="font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3 flex-grow">
                        {item.content}
                      </p>
                      <div className="text-[10px] text-slate-400 text-right border-t pt-2 border-slate-50 flex justify-between items-center">
                        <span className="text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">點擊查看詳解</span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-400 text-sm mt-12">
        <p>Built with React, Tailwind, and Gemini 2.5 Flash</p>
      </footer>

      <PrizeModal
        tidbit={currentTidbit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
}

export default App;