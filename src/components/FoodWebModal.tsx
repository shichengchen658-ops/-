import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { ANIMAL_PROFILES, FOOD_ITEMS } from '../data/ecologyData';
import { sound } from '../utils/audio';

interface FoodWebModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FoodWebModal: React.FC<FoodWebModalProps> = ({ isOpen, onClose }) => {
  const [selectedNode, setSelectedNode] = useState<string>('little_egret');

  if (!isOpen) return null;

  const currentProfile = ANIMAL_PROFILES.find((a) => a.id === selectedNode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border-4 border-emerald-100 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 text-xl">🌿</span>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-kuaile text-emerald-950">
                筼筜湖生态网大图谱
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                小学三年级科学 · 看看水里泥里的生灵是如何“谁吃谁”环环相扣的
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="关闭"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Interactive Food Web Visual Canvas */}
        <div className="my-6 p-4 md:p-6 bg-gradient-to-b from-sky-50 via-emerald-50/50 to-amber-50/60 rounded-3xl border border-emerald-100">
          <div className="text-center mb-4">
            <span className="text-xs font-semibold px-3 py-1 bg-white/80 rounded-full text-emerald-800 shadow-sm border border-emerald-200">
              💡 点击任意小生物，查看它吃什么、谁又在找它当点心！
            </span>
          </div>

          {/* Level 3: Top Predator */}
          <div className="flex flex-col items-center mb-6">
            <span className="text-xs font-bold text-teal-800 mb-1">【顶级掠食者 · 空中水鸟】</span>
            <button
              onClick={() => {
                sound.playPop();
                setSelectedNode('little_egret');
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all transform ${
                selectedNode === 'little_egret'
                  ? 'bg-teal-600 text-white shadow-lg scale-105 ring-4 ring-teal-200 font-bold'
                  : 'bg-white text-teal-900 border-2 border-teal-200 hover:bg-teal-50'
              }`}
            >
              <span className="text-2xl">🕊️</span>
              <div className="text-left">
                <div className="text-sm font-bold">小白鹭（厦门市鸟）</div>
                <div className="text-[11px] opacity-80">捕食鱼虾与弹涂鱼</div>
              </div>
            </button>
          </div>

          {/* Arrows pointing up */}
          <div className="flex justify-center items-center gap-16 text-slate-400 my-1">
            <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium rotate-[-45deg]">
              <span>▲ 被吃</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
              <span>▲ 被吃</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium rotate-[45deg]">
              <span>▲ 被吃</span>
            </div>
          </div>

          {/* Level 2: Secondary Consumers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Tilapia */}
            <button
              onClick={() => {
                sound.playPop();
                setSelectedNode('tilapia_fish');
              }}
              className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                selectedNode === 'tilapia_fish'
                  ? 'bg-sky-600 text-white shadow-lg scale-102 ring-4 ring-sky-200'
                  : 'bg-white text-slate-800 border-2 border-sky-200 hover:bg-sky-50'
              }`}
            >
              <span className="text-2xl">🐟</span>
              <div className="text-left">
                <div className="text-sm font-bold">筼筜罗非鱼</div>
                <div className="text-xs opacity-80">次级消费者 · 滤食水蚤小虾</div>
              </div>
            </button>

            {/* Mudskipper */}
            <button
              onClick={() => {
                sound.playPop();
                setSelectedNode('mudskipper');
              }}
              className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                selectedNode === 'mudskipper'
                  ? 'bg-emerald-600 text-white shadow-lg scale-102 ring-4 ring-emerald-200'
                  : 'bg-white text-slate-800 border-2 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <span className="text-2xl">🦎</span>
              <div className="text-left">
                <div className="text-sm font-bold">大弹涂鱼（跳跳鱼）</div>
                <div className="text-xs opacity-80">次级消费者 · 滩涂捕食红虫</div>
              </div>
            </button>

            {/* Fiddler Crab */}
            <button
              onClick={() => {
                sound.playPop();
                setSelectedNode('fiddler_crab');
              }}
              className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                selectedNode === 'fiddler_crab'
                  ? 'bg-orange-500 text-white shadow-lg scale-102 ring-4 ring-orange-200'
                  : 'bg-white text-slate-800 border-2 border-orange-200 hover:bg-orange-50'
              }`}
            >
              <span className="text-2xl">🦀</span>
              <div className="text-left">
                <div className="text-sm font-bold">弧边招潮蟹</div>
                <div className="text-xs opacity-80">初级/分解者 · 过滤泥沙硅藻</div>
              </div>
            </button>
          </div>

          {/* Level 1: Primary Consumers & Microscopic */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => {
                sound.playPop();
                setSelectedNode('daphnia_group');
              }}
              className={`flex items-center gap-2 p-3 rounded-2xl transition-all ${
                selectedNode === 'daphnia_group'
                  ? 'bg-purple-600 text-white shadow-md ring-4 ring-purple-200'
                  : 'bg-white text-slate-700 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              <span className="text-xl">🫧</span>
              <div className="text-left">
                <div className="text-xs font-bold">微型水蚤</div>
                <div className="text-[10px] opacity-80">吃绿藻 · 鱼虾主食</div>
              </div>
            </button>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-emerald-200 text-slate-700">
              <span className="text-xl">🦐</span>
              <div className="text-left">
                <div className="text-xs font-bold">湿地小虾</div>
                <div className="text-[10px] text-slate-500">穿梭红树林根系</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-emerald-200 text-slate-700">
              <span className="text-xl">🌱</span>
              <div className="text-left">
                <div className="text-xs font-bold">浮游植物/绿藻</div>
                <div className="text-[10px] text-emerald-600 font-semibold">【生产者】光合作用</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-amber-200 text-slate-700">
              <span className="text-xl">🍂</span>
              <div className="text-left">
                <div className="text-xs font-bold">红树林落叶腐殖质</div>
                <div className="text-[10px] text-amber-700 font-semibold">【底栖营养黄金】</div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Animal Deep Dive */}
        {currentProfile && (
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 flex items-center justify-center text-2xl rounded-2xl" style={{ backgroundColor: currentProfile.avatarBg }}>
                  {currentProfile.id === 'little_egret' ? '🕊️' : currentProfile.id === 'fiddler_crab' ? '🦀' : currentProfile.id === 'mudskipper' ? '🦎' : currentProfile.id === 'tilapia_fish' ? '🐟' : '🫧'}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{currentProfile.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>生态层级：{currentProfile.trophicLevel}</span>
                    <span>·</span>
                    <span>生活区：{currentProfile.habitat}</span>
                  </div>
                </div>
              </div>

              {/* Diet Tag */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-500">它的食物：</span>
                {currentProfile.dietTypes.map((foodId) => {
                  const food = FOOD_ITEMS[foodId];
                  return (
                    <span key={foodId} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span>{food?.icon}</span>
                      <span>{food?.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              <span className="font-bold text-emerald-800">【三年级科学小秘趣】</span> {currentProfile.funFact}
            </p>

            <div className="flex items-start gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-slate-800">筼筜湖生态意义：</strong>{currentProfile.ecoTip}</span>
            </div>
          </div>
        )}

        {/* Environmental Warning footer */}
        <div className="mt-4 flex items-center gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
          <span className="text-lg">🛍️🚫</span>
          <span>
            <strong>环保小常识：</strong>塑料袋、烟头和电池等白色垃圾被扔进湖里后，会被误当作水草或小鱼吞食，造成水生动物胃部穿孔或中毒！请爱护厦门碧水蓝天，垃圾分类不入湖！
          </span>
        </div>
      </div>
    </div>
  );
};
