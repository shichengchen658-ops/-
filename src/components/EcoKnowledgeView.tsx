import React from 'react';
import { ShieldCheck, Heart, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface EcoKnowledgeViewProps {
  onStartPlay: () => void;
  onOpenFoodWeb: () => void;
}

export const EcoKnowledgeView: React.FC<EcoKnowledgeViewProps> = ({
  onStartPlay,
  onOpenFoodWeb,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-pop-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white p-8 md:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-4 text-emerald-100">
            <span>🌿 厦门生态科普小课堂</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-kuaile mb-3 tracking-wide">
            筼筜湖的生态秘密与食物链
          </h1>
          <p className="text-sm md:text-base text-emerald-50 leading-relaxed mb-6">
            筼筜湖曾是厦门重要的天然海湾，历经数十年的生态治理，如今红树成林、白鹭翩跹，成为了万千水生小动物安居乐业的湿地乐园。
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playPop();
                onStartPlay();
              }}
              className="px-6 py-3 bg-white text-emerald-800 font-bold rounded-2xl shadow-lg hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer flex items-center gap-2 text-sm"
            >
              <span>立即去挑战答题</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playPop();
                onOpenFoodWeb();
              }}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl backdrop-blur-sm transition-all cursor-pointer text-sm"
            >
              查看食物网结构
            </button>
          </div>
        </div>

        {/* Decorative Floating Birds / Clouds */}
        <div className="absolute right-6 top-8 text-7xl opacity-20 select-none hidden md:block">
          🕊️
        </div>
      </div>

      {/* 3 Core Science Modules for Grade 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Food Chain */}
        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mb-4">
            🔗
          </div>
          <h3 className="text-lg font-bold font-kuaile text-slate-900 mb-2">
            1. 食物链环环相扣
          </h3>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
            植物通过光合作用制造能量（生产者）；水蚤、招潮蟹吃水草和藻类（初级消费者）；小鱼吃水蚤（次级消费者）；白鹭吃鱼虾（顶级捕食者）。任何一环断裂，整个生态系统都会受到影响！
          </p>
          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
            🌱 绿藻 ➔ 🫧 水蚤 ➔ 🐟 罗非鱼 ➔ 🕊️ 白鹭
          </div>
        </div>

        {/* Module 2: Mangrove Forest */}
        <div className="p-6 rounded-3xl bg-white border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-2xl mb-4">
            🌳
          </div>
          <h3 className="text-lg font-bold font-kuaile text-slate-900 mb-2">
            2. 红树林：湿地幼儿园
          </h3>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
            筼筜湖岛屿上种植了大量的红树植物（如秋茄、木榄）。红树盘根错节的呼吸根不仅能净化水质、固结泥沙，还为小鱼小虾、弹涂鱼和招潮蟹提供了天然的“避难所与育儿室”。
          </p>
          <div className="text-xs font-semibold text-teal-700 bg-teal-50 p-2.5 rounded-xl border border-teal-100">
            🛡️ 挡风消浪 · 净化水质 · 萌宠庇护所
          </div>
        </div>

        {/* Module 3: Plastic Pollution Warning */}
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-2xl mb-4">
            🚫
          </div>
          <h3 className="text-lg font-bold font-kuaile text-slate-900 mb-2">
            3. 拒绝塑料垃圾入湖
          </h3>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
            塑料袋、一次性吸管、烟头一旦掉入水中，经数百年也无法完全降解，还会碎裂成微塑料。水鸟和鱼类误食后无法排出，会痛苦生病。保护筼筜湖，从不随手扔垃圾做起！
          </p>
          <div className="text-xs font-semibold text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
            🚯 垃圾分类投放 · 湖畔文明观鸟
          </div>
        </div>
      </div>

      {/* Action Commitment Card for Kids */}
      <div className="p-6 md:p-8 rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-3xl shrink-0 shadow-md">
            🎖️
          </div>
          <div>
            <h4 className="text-lg font-bold text-emerald-950 font-kuaile">
              争做「筼筜湖生态小卫士」行动倡议
            </h4>
            <p className="text-xs md:text-sm text-emerald-800 mt-1">
              不投喂野生鸟类人造零食 · 看到湖畔垃圾随手捡拾 · 向身边同学科普食物链知识
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            sound.playPop();
            onStartPlay();
          }}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-md whitespace-nowrap active:scale-95 transition-all cursor-pointer text-sm"
        >
          开始答题挑战
        </button>
      </div>
    </div>
  );
};
