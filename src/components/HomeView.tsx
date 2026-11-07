import React from 'react';
import { ArrowRight, Play, BookOpen, Network, Award, ShieldCheck, Sparkles, Heart, Zap } from 'lucide-react';
import { ANIMAL_PROFILES } from '../data/ecologyData';
import { AnimalIllustration } from './AnimalIllustration';
import { sound } from '../utils/audio';

interface HomeViewProps {
  onStartGame: () => void;
  onOpenFoodWeb: () => void;
  onOpenSpecies: () => void;
  onOpenKnowledge: () => void;
  onOpenCertificate: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartGame,
  onOpenFoodWeb,
  onOpenSpecies,
  onOpenKnowledge,
  onOpenCertificate,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-10 animate-pop-in">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-sky-800 text-white p-6 sm:p-10 md:p-14 shadow-2xl border-4 border-white/60">
        {/* Background decorative floaters */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-100 border border-white/20">
              <span>🌿 厦门生态科普 · 小学三年级科学探究应用</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-kuaile tracking-wide leading-tight text-white drop-shadow-sm">
              筼筜湖开饭啦！
              <span className="block text-2xl sm:text-3xl md:text-4xl text-amber-300 mt-1">
                —— 谁吃谁 · 食物链大挑战
              </span>
            </h1>

            <p className="text-sm md:text-base text-emerald-50 leading-relaxed max-w-xl">
              穿梭在厦门筼筜湖的碧波水浪与红树林泥滩之间，跟随厦门市鸟小白鹭、大弹涂鱼与招潮蟹，眼疾手快抓住流水中的正宗美食，识破有害垃圾与天敌陷阱，守护生态平衡！
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playPop();
                  onStartGame();
                }}
                className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black rounded-2xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all text-base md:text-lg flex items-center gap-2.5 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-emerald-950" />
                <span>立即开始挑战！</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  onOpenFoodWeb();
                }}
                className="px-5 py-3.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold rounded-2xl backdrop-blur-md border border-white/25 transition-all text-sm flex items-center gap-2 cursor-pointer"
              >
                <Network className="w-4 h-4 text-emerald-200" />
                <span>查看食物网大图谱</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  onOpenSpecies();
                }}
                className="px-5 py-3.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold rounded-2xl backdrop-blur-md border border-white/25 transition-all text-sm flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-teal-200" />
                <span>湿地生物图鉴</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon /> 5 大明星湿地生灵
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon /> 流水从右往左多速漂游
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon /> 通关导出小卫士结业奖状
              </span>
            </div>
          </div>

          {/* Right Mascot Showcase (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl flex flex-col items-center text-center">
              <AnimalIllustration animalId="little_egret" state="eating" className="w-48 h-48 sm:w-56 sm:h-56" />
              <div className="mt-2 text-xs font-bold text-amber-200 bg-white/20 px-3 py-1 rounded-full border border-white/20">
                厦门市鸟 · 小白鹭欢迎你！
              </div>
              <p className="text-xs text-emerald-100 mt-2 max-w-xs">
                “我们肚子好饿呀！水流里游过来好多美味，快来帮我们吃饱吧！”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Rules (三年级玩法速递) */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold font-kuaile text-emerald-950">
            三步玩转「筼筜食物链」
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            动眼又动手，在欢快水流中学习大自然“谁吃谁”的生态法则
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border-2 border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold font-kuaile mb-3">
              1
            </div>
            <h3 className="text-base md:text-lg font-bold font-kuaile text-slate-900 mb-1.5">
              流水漂游 · 眼疾手快
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-3">
              食物会<strong>从右往左</strong>以慢速（如落叶藻类）、中速（小虾小蟹）、快速（敏捷游鱼）不同速度游动，快速点击目标小动物爱吃的食物！
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 inline-block">
              🐢 慢速 · 🐟 中速 · ⚡ 快速
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border-2 border-teal-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-2xl font-bold font-kuaile mb-3">
              2
            </div>
            <h3 className="text-base md:text-lg font-bold font-kuaile text-slate-900 mb-1.5">
              吃满 5 个 · 相邻不同
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-3">
              水流中相邻出现的食物种类<strong>绝不相同</strong>！每个小生灵都有专属的 5 格饱食度进度，必须准确喂满 5 个对口食物才能大获全胜！
            </p>
            <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100 inline-block">
              🥗 饱食度进度 0/5 ➔ 5/5
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border-2 border-amber-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-bold font-kuaile mb-3">
              3
            </div>
            <h3 className="text-base md:text-lg font-bold font-kuaile text-slate-900 mb-1.5">
              避开天敌 · 拒绝塑料
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-3">
              小心水里的塑料袋、烟头与天敌！喂错扣除爱心并弹出即时科学纠错科普。保持连胜还能触发 <strong>Combo 翻倍暴击高分</strong>！
            </p>
            <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 inline-block">
              ❤️ 3颗爱心 · 🛍️ 垃圾警示
            </div>
          </div>
        </div>
      </div>

      {/* 3 Difficulty Levels Progression Showcase (关卡进阶体系) */}
      <div className="space-y-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <span>🎯 梯度关卡设计</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-kuaile text-emerald-950">
            三大关卡 · 逐级破解食物网
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            从最简单的二元初级食物链，逐步进阶到错综复杂的湿地全域食物网
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Level 1 Card */}
          <div className="p-6 rounded-3xl bg-white border-2 border-emerald-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800">
                  第一关 · 滩涂篇
                </span>
                <span className="text-xs font-bold text-amber-500">
                  ★☆☆ 简单二元链
                </span>
              </div>
              <h3 className="text-lg font-bold font-kuaile text-slate-900 mb-1.5">
                简单二元链（初级入门）
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                掌握“植物/藻类 ➔ 初级消费者”的二元单向关系。水流温和，帮助招潮蟹和水蚤滤食硅藻与绿藻。
              </p>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-[11px] font-medium text-emerald-900 border border-emerald-100">
                🌱 浮游藻类 ➔ 🦀 招潮蟹 / 🫧 水蚤
              </div>
            </div>
            <button
              onClick={() => {
                sound.playPop();
                onStartGame();
              }}
              className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>挑战第 1 关</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Level 2 Card */}
          <div className="p-6 rounded-3xl bg-white border-2 border-sky-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-sky-100 text-sky-800">
                  第二关 · 碧波篇
                </span>
                <span className="text-xs font-bold text-amber-500">
                  ★★☆ 进阶阶梯链
                </span>
              </div>
              <h3 className="text-lg font-bold font-kuaile text-slate-900 mb-1.5">
                多步阶梯链（中级进阶）
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                食物链延伸至肉食次级消费者！水流加速，弹涂鱼与罗非鱼穿梭水底捕食水蚤小虾，必须避开空中天敌大鸟。
              </p>
              <div className="p-2.5 rounded-2xl bg-sky-50 text-[11px] font-medium text-sky-900 border border-sky-100">
                🌱 绿藻 ➔ 🫧 水蚤 ➔ 🐟 罗非鱼 / 弹涂鱼
              </div>
            </div>
            <button
              onClick={() => {
                sound.playPop();
                onStartGame();
              }}
              className="mt-4 w-full py-2.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>挑战第 2 关</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Level 3 Card */}
          <div className="p-6 rounded-3xl bg-white border-2 border-purple-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-purple-100 text-purple-800">
                  第三关 · 空中篇
                </span>
                <span className="text-xs font-bold text-amber-500">
                  ★★★ 终极食物网
                </span>
              </div>
              <h3 className="text-lg font-bold font-kuaile text-slate-900 mb-1.5">
                复合湿地食物网（终极掌控）
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                多条链条交错成网！厦门市鸟小白鹭展翅巡视，水流湍急狂飙，跨层级捕食鱼虾蟹，识破各种隐蔽白色塑料垃圾！
              </p>
              <div className="p-2.5 rounded-2xl bg-purple-50 text-[11px] font-medium text-purple-900 border border-purple-100">
                🕸️ 多路支网交叉互联 ➔ 🕊️ 厦门市鸟小白鹭
              </div>
            </div>
            <button
              onClick={() => {
                sound.playPop();
                onStartGame();
              }}
              className="mt-4 w-full py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>挑战第 3 关</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured 5 Animals Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold font-kuaile text-emerald-950">
              认识筼筜湖 5 位明星生灵
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              了解它们在红树林生态系统中的位置与绝活
            </p>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onOpenSpecies();
            }}
            className="text-xs md:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>全部图鉴</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {ANIMAL_PROFILES.map((animal) => (
            <button
              key={animal.id}
              onClick={() => {
                sound.playPop();
                onOpenSpecies();
              }}
              className="group p-4 bg-white rounded-3xl border-2 border-slate-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-between cursor-pointer"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2 transition-transform group-hover:scale-110"
                style={{ backgroundColor: animal.avatarBg }}
              >
                {animal.id === 'little_egret'
                  ? '🕊️'
                  : animal.id === 'fiddler_crab'
                  ? '🦀'
                  : animal.id === 'mudskipper'
                  ? '🦎'
                  : animal.id === 'tilapia_fish'
                  ? '🐟'
                  : '🫧'}
              </div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                {animal.name}
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mt-1 mb-2">
                {animal.trophicLevel}
              </span>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                {animal.habitat}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Certificate Incentive Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
            🏆
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-kuaile">
              通关领取「筼筜湖生态小卫士」荣誉奖状！
            </h3>
            <p className="text-xs md:text-sm text-amber-100 mt-1 max-w-xl">
              挑战成功后支持输入学生姓名与班级（如“三年二班 林晓鹭”），一键生成专属高清奖状，可保存为 PNG 图片发送班级群或打印留念！
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            onOpenCertificate();
          }}
          className="px-6 py-3.5 bg-white hover:bg-amber-50 text-orange-800 font-bold rounded-2xl shadow-lg active:scale-95 transition-all whitespace-nowrap text-sm cursor-pointer flex items-center gap-2"
        >
          <Award className="w-4 h-4 text-orange-600" />
          <span>查看奖状样式</span>
        </button>
      </div>
    </div>
  );
};

function CheckCircleIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
