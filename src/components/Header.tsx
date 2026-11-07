import React, { useState, useEffect } from 'react';
import { Award, Play, Music, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

export type TabType = 'home' | 'arena' | 'foodweb' | 'species' | 'knowledge';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenCertificate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenCertificate,
}) => {
  const [isBgmMuted, setIsBgmMuted] = useState<boolean>(sound.isBgmMuted);

  useEffect(() => {
    const unsubscribe = sound.subscribeBgm((muted) => {
      setIsBgmMuted(muted);
    });
    return unsubscribe;
  }, []);
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            sound.playPop();
            onSelectTab('home');
          }}
          className="text-lg sm:text-xl font-bold font-kuaile tracking-tight text-emerald-900 whitespace-nowrap shrink-0 flex items-center gap-2 text-left cursor-pointer"
        >
          <span className="text-2xl">🕊️</span>
          <span>筼筜湖开饭啦！</span>
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              sound.playPop();
              onSelectTab('home');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'home'
                ? 'text-emerald-700 font-bold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            首页
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onSelectTab('arena');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'arena'
                ? 'text-emerald-700 font-bold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            挑战游戏
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onSelectTab('foodweb');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'foodweb'
                ? 'text-emerald-700 font-bold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            食物网图谱
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onSelectTab('species');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'species'
                ? 'text-emerald-700 font-bold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            湿地生物图鉴
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onSelectTab('knowledge');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'knowledge'
                ? 'text-emerald-700 font-bold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            生态小常识
          </button>
        </nav>

        {/* Zone 3: BGM Mute/Unmute Toggle & Primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Light-hearted BGM Mute/Unmute Toggle Button */}
          <button
            onClick={() => {
              const muted = sound.toggleBgm();
              setIsBgmMuted(muted);
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isBgmMuted
                ? 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 shadow-2xs'
            }`}
            title={isBgmMuted ? '点击开启轻快背景音乐' : '点击静音背景音乐'}
            aria-label={isBgmMuted ? '开启背景音乐' : '静音背景音乐'}
          >
            {isBgmMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <Music className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            )}
            <span className="hidden sm:inline">
              {isBgmMuted ? '音乐关' : '音乐开'}
            </span>
          </button>

          {currentTab === 'home' ? (
            <button
              onClick={() => {
                sound.playPop();
                onSelectTab('arena');
              }}
              className="px-3.5 sm:px-4 py-2 text-xs md:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all shadow-sm shadow-emerald-600/20 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>开始挑战</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playPop();
                onOpenCertificate();
              }}
              className="px-3.5 sm:px-4 py-2 text-xs md:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all shadow-sm shadow-emerald-600/20 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>结业奖状</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
