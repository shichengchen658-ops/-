import React, { useState } from 'react';
import { X, BookOpen, Heart, Sparkles, AlertTriangle } from 'lucide-react';
import { ANIMAL_PROFILES, FOOD_ITEMS } from '../data/ecologyData';
import { AnimalIllustration } from './AnimalIllustration';
import { sound } from '../utils/audio';

interface SpeciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeciesModal: React.FC<SpeciesModalProps> = ({ isOpen, onClose }) => {
  const [activeAnimalId, setActiveAnimalId] = useState<string>('little_egret');

  if (!isOpen) return null;

  const current = ANIMAL_PROFILES.find((a) => a.id === activeAnimalId) || ANIMAL_PROFILES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border-4 border-teal-100 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-teal-100 text-teal-800 text-xl">📖</span>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-kuaile text-teal-950">
                筼筜湿地生物图鉴
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                了解白鹭、弹涂鱼、招潮蟹等筼筜萌宠的生活习性与生态秘密
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          {ANIMAL_PROFILES.map((animal) => (
            <button
              key={animal.id}
              onClick={() => {
                sound.playPop();
                setActiveAnimalId(animal.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                activeAnimalId === animal.id
                  ? 'bg-teal-600 text-white shadow-md scale-102 ring-2 ring-teal-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{animal.id === 'little_egret' ? '🕊️' : animal.id === 'fiddler_crab' ? '🦀' : animal.id === 'mudskipper' ? '🦎' : animal.id === 'tilapia_fish' ? '🐟' : '🫧'}</span>
              <span>{animal.name}</span>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-200">
          {/* Left Avatar & Voice */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <AnimalIllustration animalId={current.id} state="idle" className="w-48 h-48" />
            <div className="mt-4 px-4 py-2.5 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-2xl border border-emerald-200 text-center w-full">
              💬 “{current.voiceLine}”
            </div>
          </div>

          {/* Right Information */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold font-kuaile text-slate-900">{current.title}</h3>
                <span className="text-xs px-2.5 py-1 bg-teal-100 text-teal-800 font-bold rounded-lg">
                  {current.trophicLevel}
                </span>
              </div>
              <div className="text-xs text-slate-500 mb-4">
                <span>分类：{current.species}</span>
                <span className="mx-2">·</span>
                <span>生活生境：{current.habitat}</span>
              </div>

              {/* Diet & Predators */}
              <div className="space-y-3 mb-4">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <span>🍽️ 最喜欢的食物：</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {current.dietTypes.map((foodId) => {
                      const food = FOOD_ITEMS[foodId];
                      return (
                        <span key={foodId} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs rounded-lg font-medium border border-emerald-100 flex items-center gap-1">
                          <span>{food?.icon}</span>
                          <span>{food?.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <span>⚠️ 天敌与威胁：</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {current.predatorIds.length > 0 ? '面临小白鹭、苍鹭等大型涉禽的捕食压力，必须时刻保持警惕！' : '在筼筜湖属于顶级鸟类霸主，几乎没有天敌，但极易受到塑料袋缠绕或误食毒垃圾威胁。'}
                  </p>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 mb-3">
                <strong className="text-amber-800">💡 科学趣闻：</strong>
                {current.funFact}
              </div>

              {/* Ecological Tip */}
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                <strong className="text-emerald-800">🌱 湿地价值：</strong>
                {current.ecoTip}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
