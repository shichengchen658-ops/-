import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heart, Zap, Sparkles, AlertCircle, ArrowRight, RotateCcw, Volume2, VolumeX,
  BookOpen, Network, CheckCircle2, Flame, Trophy, Star, Layers, Lock, Unlock,
  ChevronRight, Award, Compass, Play, Music
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnimalProfile, FoodItem, FOOD_ITEMS, ANIMAL_PROFILES, GAME_LEVELS, GameLevel } from '../data/ecologyData';
import { AnimalIllustration } from './AnimalIllustration';
import { sound } from '../utils/audio';

interface FeedingArenaProps {
  onOpenFoodWeb: () => void;
  onOpenSpecies: () => void;
  onGameComplete: (score: number, stars: number) => void;
}

interface MovingFoodInstance {
  uid: string;
  food: FoodItem;
  x: number; // percentage from right edge: 100% (right) to -15% (left)
  lane: number; // 0 (top water), 1 (middle current), 2 (bottom mud/tide)
  speed: number; // speed per frame in percentage
  speedType: 'slow' | 'medium' | 'fast';
  speedLabel: string;
}

interface ComboFeedback {
  id: number;
  combo: number;
  pointsEarned: number;
  bonusPoints: number;
  multiplierLabel: string;
  tierTitle: string;
}

interface LevelClearModalInfo {
  levelId: number;
  levelTitle: string;
  levelSubtitle: string;
  levelConcept: string;
  chainDiagram: string;
  nextLevelId: number | null;
  scoreGained: number;
}

export const FeedingArena: React.FC<FeedingArenaProps> = ({
  onOpenFoodWeb,
  onOpenSpecies,
  onGameComplete,
}) => {
  // Level progression state (Level 1: Binary chains -> Level 2: Multi-step ladder -> Level 3: Complex food web)
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [animalInLevelIndex, setAnimalInLevelIndex] = useState<number>(0);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [levelClearModal, setLevelClearModal] = useState<LevelClearModalInfo | null>(null);

  const REQUIRED_FOODS = 5;
  const [foodsEaten, setFoodsEaten] = useState<number>(0); // 0 to 5

  const [score, setScore] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);

  // Current level & animal configuration
  const currentLevel = GAME_LEVELS[currentLevelIndex] || GAME_LEVELS[0];
  const targetAnimalIds = currentLevel.targetAnimalIds;
  const currentAnimalId = targetAnimalIds[animalInLevelIndex] || targetAnimalIds[0];
  const currentAnimal = ANIMAL_PROFILES.find((a) => a.id === currentAnimalId) || ANIMAL_PROFILES[0];
  const [animalState, setAnimalState] = useState<'idle' | 'hungry' | 'eating' | 'yuck'>('hungry');

  // Dedicated Combo & Feedback visual state
  const [comboFeedback, setComboFeedback] = useState<ComboFeedback | null>(null);
  const [comboResetMessage, setComboResetMessage] = useState<string | null>(null);

  // Moving stream of foods (from right to left)
  const [movingFoods, setMovingFoods] = useState<MovingFoodInstance[]>([]);
  const lastSpawnedIdRef = useRef<string>('');
  const lastSpawnTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  // Mute & BGM state
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);
  const [isBgmMuted, setIsBgmMuted] = useState<boolean>(sound.isBgmMuted);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Start looping, light-hearted BGM when game begins
  useEffect(() => {
    sound.startBgm();

    const unsubscribe = sound.subscribeBgm((muted) => {
      setIsBgmMuted(muted);
    });

    // In case browser suspended audio before user interaction, resume on first gesture
    const handleFirstUserGesture = () => {
      sound.startBgm();
      window.removeEventListener('pointerdown', handleFirstUserGesture);
      window.removeEventListener('keydown', handleFirstUserGesture);
    };

    window.addEventListener('pointerdown', handleFirstUserGesture);
    window.addEventListener('keydown', handleFirstUserGesture);

    return () => {
      unsubscribe();
      window.removeEventListener('pointerdown', handleFirstUserGesture);
      window.removeEventListener('keydown', handleFirstUserGesture);
    };
  }, []);

  // Educational Feedback Modal on mistake
  const [feedbackInfo, setFeedbackInfo] = useState<{
    isOpen: boolean;
    isTrash: boolean;
    title: string;
    message: string;
    scienceTip: string;
  } | null>(null);

  // Level Clear Transition Banner
  const [levelClearBanner, setLevelClearBanner] = useState<string | null>(null);

  // Helper to pick candidate foods tailored by level difficulty
  const getNextFoodItem = useCallback((): FoodItem => {
    // Current animal's favorite foods
    const goodFoodIds = currentAnimal.dietTypes;

    // Distractors tailored by level difficulty
    let distractors: string[] = [];
    if (currentLevel.difficulty === 1) {
      // Level 1 (Simple binary chain): obvious contrasts, NO heavy predators like big_egret_card
      distractors = ['large_tilapia', 'crab_fry', 'small_worm', 'shrimp', 'daphnia', 'green_algae', 'diatoms', 'mangrove_leaves'].filter(
        (id) => !goodFoodIds.includes(id) && id !== 'big_egret_card'
      );
    } else if (currentLevel.difficulty === 2) {
      // Level 2 (Ladder chain): predators appear as distractors to test trophic hierarchy!
      distractors = ['big_egret_card', 'large_tilapia', 'crab_fry', 'small_worm', 'shrimp', 'daphnia', 'green_algae', 'diatoms', 'mangrove_leaves'].filter(
        (id) => !goodFoodIds.includes(id)
      );
    } else {
      // Level 3 (Complex food web): multi-step distractors & subtle non-prey
      distractors = ['large_tilapia', 'green_algae', 'diatoms', 'mangrove_leaves', 'small_worm'].filter(
        (id) => !goodFoodIds.includes(id)
      );
    }

    // Environmental trash traps scaled by level
    const trashIds = currentLevel.difficulty === 1
      ? ['plastic_bag', 'plastic_straw']
      : ['plastic_bag', 'cigarette_butt', 'battery', 'plastic_straw'];

    // Probabilities scaled by difficulty
    const roll = Math.random();
    let candidates: string[] = [];

    const goodChance = currentLevel.difficulty === 1 ? 0.58 : currentLevel.difficulty === 2 ? 0.48 : 0.42;
    const trashChance = currentLevel.trashRatio;

    if (roll < goodChance) {
      candidates = goodFoodIds;
    } else if (roll < goodChance + (1 - goodChance - trashChance)) {
      candidates = distractors;
    } else {
      candidates = trashIds;
    }

    // Filter out the LAST spawned food so adjacent items are NEVER identical!
    let validIds = candidates.filter((id) => id !== lastSpawnedIdRef.current);
    if (validIds.length === 0) {
      validIds = Object.keys(FOOD_ITEMS).filter((id) => id !== lastSpawnedIdRef.current);
    }

    const chosenId = validIds[Math.floor(Math.random() * validIds.length)] || goodFoodIds[0];
    lastSpawnedIdRef.current = chosenId;
    return FOOD_ITEMS[chosenId] || FOOD_ITEMS.green_algae;
  }, [currentAnimal, currentLevel]);

  // Helper to construct moving food item with speeds scaled by level difficulty
  const createMovingFood = useCallback(
    (food: FoodItem, xPos: number, lane: number): MovingFoodInstance => {
      const mult = currentLevel.speedMultiplier;
      const speedRoll = Math.random();
      let speed = 0.16 * mult;
      let speedType: 'slow' | 'medium' | 'fast' = 'medium';
      let speedLabel = '中速漫游 🐟';

      if (speedRoll < 0.35) {
        speed = (0.10 + Math.random() * 0.03) * mult;
        speedType = 'slow';
        speedLabel = currentLevel.difficulty === 1 ? '慢速漂流 🐢' : '稳步漂流 🐢';
      } else if (speedRoll < 0.70) {
        speed = (0.16 + Math.random() * 0.04) * mult;
        speedType = 'medium';
        speedLabel = '中速漫游 🐟';
      } else {
        speed = (0.24 + Math.random() * 0.06) * mult;
        speedType = 'fast';
        speedLabel = currentLevel.difficulty === 3 ? '狂飙疾行 ⚡⚡' : '快速穿梭 ⚡';
      }

      return {
        uid: `${food.id}_${Date.now()}_${Math.random()}`,
        food,
        x: xPos,
        lane,
        speed,
        speedType,
        speedLabel,
      };
    },
    [currentLevel]
  );

  // Spawn initial moving items on round or level start
  useEffect(() => {
    setFoodsEaten(0);
    setAnimalState('hungry');
    lastSpawnedIdRef.current = '';

    // Create 4 initial items distributed across the stream
    const initialItems: MovingFoodInstance[] = [];
    const lanes = [0, 1, 2];

    for (let i = 0; i < 4; i++) {
      const food = getNextFoodItem();
      initialItems.push(createMovingFood(food, 55 + i * 20, lanes[i % lanes.length]));
    }

    setMovingFoods(initialItems);
    lastSpawnTimeRef.current = Date.now();
  }, [currentLevelIndex, animalInLevelIndex, getNextFoodItem, createMovingFood]);

  // Main game animation loop: move items from right to left
  useEffect(() => {
    if (isPaused || feedbackInfo?.isOpen || levelClearBanner || levelClearModal) return;

    let prevTimestamp = performance.now();

    const updateStream = (timestamp: number) => {
      const delta = Math.min((timestamp - prevTimestamp) / 16.6, 3); // normalize to ~60fps
      prevTimestamp = timestamp;

      setMovingFoods((prev) => {
        // Move all foods leftwards
        const updated = prev
          .map((item) => ({
            ...item,
            x: item.x - item.speed * delta,
          }))
          .filter((item) => item.x > -18); // remove when scrolled past left edge

        // Check if we need to spawn a new item from the right (> 100%)
        const rightmostItem = updated.reduce(
          (max, it) => (it.x > max ? it.x : max),
          0
        );

        // Keep 5 to 6 items in the river at any time
        if (updated.length < 6 && rightmostItem < 92) {
          const food = getNextFoodItem();

          // Pick lane with least crowding
          const laneCounts = [0, 0, 0];
          updated.forEach((it) => {
            if (it.x > 70) laneCounts[it.lane]++;
          });
          const bestLane = laneCounts.indexOf(Math.min(...laneCounts));

          const newItem = createMovingFood(
            food,
            Math.max(102, rightmostItem + 15 + Math.random() * 8),
            bestLane
          );

          updated.push(newItem);
        }

        return updated;
      });

      requestRef.current = requestAnimationFrame(updateStream);
    };

    requestRef.current = requestAnimationFrame(updateStream);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPaused, feedbackInfo, levelClearBanner, levelClearModal, getNextFoodItem, createMovingFood]);

  // Handle student clicking / feeding a moving food item
  const handleFoodClick = (instance: MovingFoodInstance) => {
    if (feedbackInfo?.isOpen || levelClearBanner) return;

    sound.playPop();
    const food = instance.food;
    const isCorrect = currentAnimal.dietTypes.includes(food.id);

    // Remove the clicked item from the stream
    setMovingFoods((prev) => prev.filter((it) => it.uid !== instance.uid));

    if (isCorrect) {
      // 1. Correct food!
      sound.playMunch();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // Reward escalating bonus points for consecutive correct matches:
      // Base: 100
      // 1x: 100 pts (+0 bonus)
      // 2x: 120 pts (+20 bonus pts)
      // 3x: 150 pts (+50 bonus pts)
      // 4x: 200 pts (+100 bonus pts)
      // 5x+: 250 pts (+150 bonus pts MAX)
      let bonusPoints = 0;
      let multiplierLabel = '1.0x';
      let tierTitle = '初露锋芒!';

      if (newCombo === 2) {
        bonusPoints = 20;
        multiplierLabel = '1.2x';
        tierTitle = '两连击! ⚡ 额外+20分';
      } else if (newCombo === 3) {
        bonusPoints = 50;
        multiplierLabel = '1.5x';
        tierTitle = '三连击! 🔥 额外+50分';
      } else if (newCombo === 4) {
        bonusPoints = 100;
        multiplierLabel = '2.0x';
        tierTitle = '四连击! 🌟 额外+100分';
      } else if (newCombo >= 5) {
        bonusPoints = 150;
        multiplierLabel = '2.5x';
        tierTitle = '筼筜食神! 👑 满阶爆发+150分';
      }

      const pointsEarned = 100 + bonusPoints;
      setScore((prev) => prev + pointsEarned);
      setAnimalState('eating');

      // Trigger punchy floating reward feedback
      const feedbackItem = {
        id: Date.now(),
        combo: newCombo,
        pointsEarned,
        bonusPoints,
        multiplierLabel,
        tierTitle,
      };
      setComboFeedback(feedbackItem);

      // Trigger golden particle burst effect on combo counter increase
      try {
        confetti({
          particleCount: Math.min(30 + newCombo * 8, 65),
          spread: 65 + Math.min(newCombo * 6, 30),
          origin: { x: 0.5, y: 0.5 },
          colors: ['#FFD700', '#F59E0B', '#FBBF24', '#FEF08A', '#FFA500'],
          shapes: ['circle', 'star'],
          scalar: 1.15,
          ticks: 65,
          disableForReducedMotion: true,
        });
      } catch {
        // Fallback gracefully
      }

      setTimeout(() => {
        setComboFeedback((current) => (current?.id === feedbackItem.id ? null : current));
      }, 1200);

      setTimeout(() => {
        sound.playSuccess(newCombo);
      }, 150);

      const nextEaten = foodsEaten + 1;
      setFoodsEaten(nextEaten);

      // Check if animal is completely full (5 foods eaten)
      if (nextEaten >= REQUIRED_FOODS) {
        setLevelClearBanner(`${currentAnimal.name} 已经吃饱 5 个美食啦！太满足了！🎉`);

        setTimeout(() => {
          setLevelClearBanner(null);
          // Advance to next animal in this level or clear level
          if (animalInLevelIndex < targetAnimalIds.length - 1) {
            sound.playPop();
            setAnimalInLevelIndex((prev) => prev + 1);
            setFoodsEaten(0);
            setAnimalState('hungry');
          } else {
            // Level cleared!
            sound.playCheer();
            const currentLevelId = currentLevel.id;
            const nextLvlIndex = currentLevelIndex + 1;

            setCompletedLevels((prev) => Array.from(new Set([...prev, currentLevelId])));

            // Burst celebratory gold and emerald confetti
            try {
              confetti({
                particleCount: 80,
                spread: 80,
                origin: { x: 0.5, y: 0.5 },
                colors: ['#10b981', '#f59e0b', '#38bdf8', '#fbbf24', '#ffffff'],
              });
            } catch {
              // Graceful fallback
            }

            if (nextLvlIndex < GAME_LEVELS.length) {
              setUnlockedLevels((prev) => Array.from(new Set([...prev, nextLvlIndex + 1])));
              setLevelClearModal({
                levelId: currentLevel.id,
                levelTitle: currentLevel.title,
                levelSubtitle: currentLevel.subtitle,
                levelConcept: currentLevel.chainConcept,
                chainDiagram: currentLevel.chainDiagram,
                nextLevelId: nextLvlIndex + 1,
                scoreGained: score + 200,
              });
            } else {
              // Completed all 3 levels! Grand finale!
              const stars = hearts === 3 ? 3 : hearts === 2 ? 2 : 1;
              onGameComplete(score + 350, stars);
            }
          }
        }, 1500);
      } else {
        setTimeout(() => {
          setAnimalState('hungry');
        }, 800);
      }
    } else {
      // 2. Incorrect food or dangerous trash!
      sound.playError();
      setAnimalState('yuck');

      // Notify player if a good combo streak was lost
      if (combo >= 2) {
        setComboResetMessage(`连击中断 (本轮曾达 x${combo})，别灰心，重新积攒连击能量！💪`);
        setTimeout(() => setComboResetMessage(null), 2500);
      }

      setCombo(0);
      setHearts((prev) => Math.max(0, prev - 1));

      // Construct educational explanation
      let title = '哎呀，吃错啦！';
      let message = `${currentAnimal.name} 不能吃 ${food.name} 哦！`;
      let scienceTip = currentAnimal.wrongFoodLine;

      if (food.isTrash) {
        title = '⚠️ 警惕白色塑料与毒垃圾！';
        message = `这是不可食用的【${food.name}】，丢进湖里会让水生动物胃肠堵塞甚至致命！`;
        scienceTip = `${food.description} 爱护厦门筼筜湖，一定要把垃圾扔进分类垃圾箱！`;
      } else if (currentAnimal.predatorIds.includes(food.id) || food.id.includes('egret')) {
        title = '😱 救命！那是它的天敌！';
        message = `${food.name} 是 ${currentAnimal.name} 的天敌掠食者，小动物看到它只能赶紧逃跑！`;
        scienceTip = `在湿地食物链中，大白鹭等水鸟以小鱼、弹涂鱼为食，属于食物链上位者，弱小动物是吃不下天敌的！`;
      } else {
        scienceTip = `${currentAnimal.name} 最喜欢的其实是：${currentAnimal.dietTypes
          .map((id) => FOOD_ITEMS[id]?.name)
          .filter(Boolean)
          .join('、')}。${currentAnimal.funFact}`;
      }

      setFeedbackInfo({
        isOpen: true,
        isTrash: !!food.isTrash,
        title,
        message,
        scienceTip,
      });
    }
  };

  // Continue after reviewing educational tip
  const handleContinueAfterFeedback = () => {
    sound.playPop();
    setFeedbackInfo(null);
    if (hearts <= 0) return;
    setAnimalState('hungry');
  };

  // Proceed to next level from celebration modal
  const handleProceedToNextLevel = () => {
    sound.playPop();
    setLevelClearModal(null);
    const nextLvlIndex = currentLevelIndex + 1;
    if (nextLvlIndex < GAME_LEVELS.length) {
      setCurrentLevelIndex(nextLvlIndex);
      setAnimalInLevelIndex(0);
      setFoodsEaten(0);
      setAnimalState('hungry');
    }
  };

  // Switch or select level from Level Tabs
  const handleSelectLevel = (levelId: number) => {
    sound.playPop();
    const targetIndex = GAME_LEVELS.findIndex((l) => l.id === levelId);
    if (targetIndex !== -1) {
      setCurrentLevelIndex(targetIndex);
      setAnimalInLevelIndex(0);
      setFoodsEaten(0);
      setAnimalState('hungry');
      setLevelClearModal(null);
      setLevelClearBanner(null);
      setFeedbackInfo(null);
    }
  };

  // Full restart back to Level 1
  const handleRestart = () => {
    sound.playPop();
    setCurrentLevelIndex(0);
    setAnimalInLevelIndex(0);
    setFoodsEaten(0);
    setScore(0);
    setHearts(3);
    setCombo(0);
    setMaxCombo(0);
    setComboFeedback(null);
    setComboResetMessage(null);
    setFeedbackInfo(null);
    setLevelClearBanner(null);
    setLevelClearModal(null);
    setAnimalState('hungry');
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 md:py-6">
      {/* 1. Multi-Level Interactive Navigation & Difficulty Switcher */}
      <div className="mb-3.5 p-2.5 sm:p-3 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-emerald-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Level Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {GAME_LEVELS.map((lvl, idx) => {
            const isActive = currentLevelIndex === idx;
            const isCompleted = completedLevels.includes(lvl.id);
            const isUnlocked = unlockedLevels.includes(lvl.id) || isCompleted;

            return (
              <button
                key={lvl.id}
                onClick={() => handleSelectLevel(lvl.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-300'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : isUnlocked
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    : 'bg-slate-50 text-slate-400 border border-slate-200'
                }`}
                title={`关卡难度：${lvl.difficultyLabel}`}
              >
                {/* Level Number / Check Badge */}
                <div
                  className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isCompleted
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : lvl.id}
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-kuaile text-xs md:text-sm leading-tight">
                      第 {lvl.id} 关 · {lvl.subtitle}
                    </span>
                    {isActive && (
                      <span className="text-[10px] bg-amber-400 text-emerald-950 font-black px-1.5 py-0.2 rounded-md font-sans">
                        进行中
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] opacity-90 mt-0.5">
                    <span className="text-amber-400 tracking-wider">
                      {'★'.repeat(lvl.difficulty)}{'☆'.repeat(3 - lvl.difficulty)}
                    </span>
                    <span>·</span>
                    <span>{lvl.habitat.slice(0, 4)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Current Level Scientific Chain Summary Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-sky-50 to-emerald-50 border border-emerald-200 text-xs">
          <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs">
            <span className="font-bold text-emerald-950">链条：</span>
            <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
              {currentLevel.chainType.split('(')[0].trim()}
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-600 hidden sm:inline">
              流速：
              <strong className="text-emerald-700 font-bold">
                {currentLevel.difficulty === 1
                  ? '慢速缓漂 (0.9x)'
                  : currentLevel.difficulty === 2
                  ? '阶梯加速 (1.2x)'
                  : '狂飙疾流 (1.5x)'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Top Status & Animal Progress Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 md:p-4 bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-emerald-100 shadow-sm">
        {/* Left: Current Animal & Species */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md border-2 border-white"
            style={{ backgroundColor: currentAnimal.accentColor, color: '#ffffff' }}
          >
            {animalInLevelIndex + 1}
          </div>
          <div>
            <div className="text-sm md:text-base font-bold font-kuaile text-emerald-950 flex items-center gap-2">
              <span>{currentAnimal.title}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans">
                {currentAnimal.trophicLevel}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              关卡第 {animalInLevelIndex + 1} / {targetAnimalIds.length} 位生灵 · 生境：{currentAnimal.habitat}
            </div>
          </div>
        </div>

        {/* Middle: 5 Food Slots Belly Progress */}
        <div className="flex items-center gap-2 bg-emerald-50/80 px-4 py-2 rounded-2xl border border-emerald-200">
          <span className="text-xs font-bold text-emerald-900 hidden sm:inline">饱食度：</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((slot) => {
              const isFilled = slot <= foodsEaten;
              return (
                <div
                  key={slot}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all transform ${
                    isFilled
                      ? 'bg-emerald-600 text-white scale-110 shadow-sm shadow-emerald-500/40 animate-bounce'
                      : 'bg-white border-2 border-dashed border-emerald-300 text-emerald-300'
                  }`}
                  title={isFilled ? `已喂食第 ${slot} 个美食` : `等待喂食第 ${slot} 个`}
                >
                  {isFilled ? '🥗' : slot}
                </div>
              );
            })}
          </div>
          <span className="text-xs font-bold text-emerald-700 ml-1">
            {foodsEaten} / {REQUIRED_FOODS}
          </span>
        </div>

        {/* Right: Hearts, Combo & Score */}
        <div className="flex items-center gap-3">
          {/* Life Hearts */}
          <div className="flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-2xl border border-rose-200">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${
                  heartIndex <= hearts
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-300 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Dynamic Combo Counter Badge */}
          <div
            className={`flex items-center gap-1.5 font-bold text-xs px-3 py-1.5 rounded-2xl border transition-all ${
              combo >= 4
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white border-yellow-300 shadow-lg shadow-orange-500/30 animate-bounce'
                : combo >= 2
                ? 'bg-amber-500 text-white border-amber-400 shadow-md animate-bounce'
                : combo === 1
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={combo > 0 ? `当前连击 x${combo}` : '连续喂对可获得连击加分'}
          >
            {combo >= 3 ? (
              <Flame className="w-4 h-4 fill-amber-200 text-amber-200" />
            ) : (
              <Zap
                className={`w-3.5 h-3.5 ${
                  combo > 1 ? 'fill-white text-white' : combo === 1 ? 'fill-amber-500 text-amber-500' : 'text-slate-300'
                }`}
              />
            )}
            <span className="font-extrabold tracking-tight">
              {combo > 0 ? `连击 x${combo}` : '连击准备'}
            </span>
            {combo > 1 && (
              <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded font-sans font-black">
                {combo === 2 ? '+20' : combo === 3 ? '+50' : combo === 4 ? '+100' : '+150 MAX'}
              </span>
            )}
          </div>

          {/* Score */}
          <div className="px-3 py-1.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 font-bold text-xs md:text-sm tabular-nums">
            积分：<span className="text-emerald-600 text-base">{score}</span>
          </div>

          {/* BGM Toggle */}
          <button
            onClick={() => {
              const muted = sound.toggleBgm();
              setIsBgmMuted(muted);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
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
            <span className="hidden sm:inline">{isBgmMuted ? '音乐已关' : '轻快BGM'}</span>
          </button>
        </div>
      </div>

      {/* Main Stream & River Arena */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-sky-100/80 via-teal-50/70 to-emerald-100/90 border-4 border-white shadow-xl p-4 md:p-6 mb-4">
        {/* Screen-Center Flashing Combo Popup with Golden Particle Feedback */}
        {comboFeedback && (
          <div
            key={comboFeedback.id}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center select-none"
          >
            <div className="relative flex items-center justify-center animate-combo-popup">
              {/* Golden Flash Ring Expanding & Radiating Aura */}
              <div className="absolute w-52 h-52 md:w-64 md:h-64 rounded-full border-4 border-amber-300 bg-amber-400/20 blur-xs animate-flash-ring" />
              <div className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full bg-gradient-radial from-yellow-300/35 via-amber-400/20 to-transparent blur-md animate-pulse" />

              {/* Golden Sparkling Particles Radiating Around Center Popup */}
              {[
                { top: '-28px', left: '-20px', size: 'text-2xl', delay: '0ms' },
                { top: '-36px', right: '-15px', size: 'text-3xl', delay: '60ms' },
                { bottom: '-26px', left: '-25px', size: 'text-3xl', delay: '120ms' },
                { bottom: '-32px', right: '-18px', size: 'text-2xl', delay: '90ms' },
                { top: '40%', left: '-52px', size: 'text-xl', delay: '140ms' },
                { top: '40%', right: '-52px', size: 'text-xl', delay: '40ms' },
                { top: '-42px', left: '42%', size: 'text-2xl', delay: '80ms' },
                { bottom: '-42px', left: '45%', size: 'text-2xl', delay: '110ms' },
              ].map((p, idx) => (
                <div
                  key={idx}
                  style={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom, animationDelay: p.delay }}
                  className={`absolute ${p.size} text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.95)] animate-gold-sparkle pointer-events-none select-none`}
                >
                  ✨
                </div>
              ))}

              {/* Screen-Center Flashing Combo Card */}
              <div
                className={`relative px-7 py-4 md:px-10 md:py-5 rounded-3xl shadow-2xl border-4 flex flex-col items-center gap-1.5 text-white text-center backdrop-blur-md ${
                  comboFeedback.combo >= 4
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 border-yellow-200 shadow-amber-500/60 ring-4 ring-yellow-300/60'
                    : comboFeedback.combo >= 2
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 border-yellow-100 shadow-orange-500/50 ring-4 ring-yellow-200/50'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 border-emerald-200 shadow-emerald-600/40 ring-4 ring-emerald-300/40'
                }`}
              >
                {/* Top Tag: Combo Counter */}
                <div className="flex items-center gap-2">
                  {comboFeedback.combo >= 2 ? (
                    <Flame className="w-8 h-8 md:w-9 md:h-9 fill-yellow-200 text-yellow-100 animate-bounce" />
                  ) : (
                    <Zap className="w-7 h-7 md:w-8 md:h-8 fill-amber-200 text-amber-100 animate-bounce" />
                  )}
                  <span className="text-3xl md:text-5xl font-extrabold font-kuaile tracking-wider drop-shadow-md text-yellow-100">
                    COMBO x{comboFeedback.combo}!
                  </span>
                  {comboFeedback.combo >= 2 ? (
                    <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-yellow-200 animate-pulse" />
                  ) : null}
                </div>

                {/* Score Gain */}
                <div className="text-2xl md:text-3xl font-black font-kuaile drop-shadow text-white">
                  +{comboFeedback.pointsEarned} 分!
                </div>

                {/* Multiplier / Tier Description */}
                {comboFeedback.combo > 1 ? (
                  <div className="text-xs md:text-sm font-bold bg-black/35 px-4 py-1 rounded-full tracking-wide border border-white/25 text-yellow-100">
                    ⚡ {comboFeedback.tierTitle}
                  </div>
                ) : (
                  <div className="text-xs md:text-sm font-bold bg-white/20 px-3.5 py-0.5 rounded-full text-emerald-100">
                    投喂命中！连击蓄力开启 ⚡
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Combo Energy Meter & Streak Bar */}
        <div className="mb-3 p-3 bg-white/95 rounded-2xl border-2 border-amber-200/80 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-xs md:text-sm transition-all shadow-xs ${
                  combo >= 4
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white animate-streak-glow'
                    : combo >= 2
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white scale-105'
                    : combo === 1
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {combo >= 3 ? (
                  <Flame className="w-4 h-4 fill-amber-200 text-amber-200 animate-bounce" />
                ) : (
                  <Zap className={`w-4 h-4 ${combo > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                )}
                <span className="font-kuaile tracking-wide">
                  {combo > 0 ? `连击 COMBO x${combo}` : '连击能量槽 (未激活)'}
                </span>
                {combo > 1 && (
                  <span className="text-[11px] bg-white/25 px-1.5 py-0.5 rounded-md font-sans">
                    {combo === 2 ? '+20分' : combo === 3 ? '+50分' : combo === 4 ? '+100分' : '+150分 MAX'}
                  </span>
                )}
              </div>

              {/* Educational / Motivational Hint */}
              <span className="text-xs font-medium text-slate-600 hidden md:inline">
                {combo === 0 && '💡 连续正确喂食可积攒能量，解锁高额额外加分！'}
                {combo === 1 && '⚡ 连击已启动！再对 1 次即可激活连击积分加成！'}
                {combo === 2 && '🎉 两连击达成！每次投喂额外奖励 +20 分！'}
                {combo === 3 && '🔥 三连击！手速超神！每次投喂额外奖励 +50 分！'}
                {combo === 4 && '🌟 四连击！食物链神探！每次投喂额外奖励 +100 分！'}
                {combo >= 5 && '👑 满阶食神狂暴！每次投喂极限爆发 +150 分！'}
              </span>
            </div>

            {/* Right: Max Combo Record */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>最高连击记录：<strong className="text-amber-600 font-bold">x{maxCombo}</strong></span>
            </div>
          </div>

          {/* 5-Step Segmented Energy Progress Bar */}
          <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex gap-1">
            {[1, 2, 3, 4, 5].map((step) => {
              const isReached = combo >= step;
              return (
                <div
                  key={step}
                  className={`h-full flex-1 rounded-full transition-all duration-300 relative ${
                    isReached
                      ? step >= 5
                        ? 'bg-gradient-to-r from-orange-500 to-rose-500 shadow-sm'
                        : step >= 3
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm'
                        : 'bg-amber-400'
                      : 'bg-slate-200/60'
                  }`}
                  title={`连击第 ${step} 阶`}
                >
                  {isReached && step === Math.min(combo, 5) && (
                    <div className="absolute inset-0 bg-white/40 animate-pulse rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Combo Reset Toast Alert */}
        {comboResetMessage && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between animate-pop-in">
            <span>{comboResetMessage}</span>
            <span className="text-[11px] text-amber-600 font-bold">重新开始蓄力</span>
          </div>
        )}

        {/* Top Water Instruction Banner with Level Context */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 px-3.5 py-2.5 bg-white/85 backdrop-blur-xs rounded-2xl border border-emerald-200 text-xs">
          <div className="flex items-center gap-2 font-medium text-emerald-950">
            <span className="text-base">🌊</span>
            <span className="leading-snug">
              <strong className="text-emerald-800 font-kuaile text-xs md:text-sm mr-1">
                【{currentLevel.title.split('：')[0]} · {currentLevel.subtitle}】
              </strong>
              <span>
                链条关系：<strong className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mr-1.5">{currentLevel.chainDiagram}</strong>
                快速投喂当前主角
                <strong className="text-emerald-800 underline mx-1">{currentAnimal.name}</strong>爱吃的美食（{foodsEaten}/5）！
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold shrink-0">
            <span className={`px-2 py-0.5 rounded-md ${currentLevel.difficulty === 1 ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-100'}`}>
              🐢 慢速漂流
            </span>
            <span>·</span>
            <span className={`px-2 py-0.5 rounded-md ${currentLevel.difficulty === 2 ? 'bg-sky-100 text-sky-800 font-bold' : 'bg-slate-100'}`}>
              🐟 敏捷中速
            </span>
            <span>·</span>
            <span className={`px-2 py-0.5 rounded-md ${currentLevel.difficulty === 3 ? 'bg-purple-100 text-purple-800 font-bold' : 'bg-slate-100'}`}>
              ⚡ 疾速穿梭
            </span>
          </div>
        </div>

        {/* Split Arena: Left is Animal, Right is Moving Stream Track */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left Column: Waiting Animal & Speech (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 bg-white/95 rounded-3xl border-2 border-emerald-200/80 shadow-md">
            {/* Animal Voice Bubble */}
            <div className="relative mb-3 w-full bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-200 text-center animate-pop-in">
              <p className="text-sm md:text-base font-bold text-emerald-950 font-kuaile leading-snug">
                {animalState === 'eating'
                  ? currentAnimal.eatingHappyLine
                  : animalState === 'yuck'
                  ? '咳咳！这东西吞不下！'
                  : currentAnimal.voiceLine}
              </p>
              {/* Bubble Arrow Pointer */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-emerald-200" />
            </div>

            {/* Animal Avatar */}
            <div className="relative my-2">
              <AnimalIllustration
                animalId={currentAnimal.id}
                state={animalState}
                className="w-48 h-48 md:w-56 md:h-56"
              />
            </div>

            {/* Animal Info Tag */}
            <div className="w-full mt-2 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <span>{currentAnimal.species}</span>
              <span>·</span>
              <span>{currentAnimal.habitat}</span>
            </div>
          </div>

          {/* Right Column: Moving Food River Track (8 cols) */}
          <div className="lg:col-span-8 relative h-[380px] md:h-[420px] rounded-3xl overflow-hidden bg-gradient-to-r from-teal-500/20 via-sky-400/25 to-blue-500/30 border-2 border-teal-200/80 shadow-inner p-4">
            {/* Scenic River Water Flow Indicators */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
              <div className="absolute top-[32%] left-0 right-0 h-0.5 border-b border-dashed border-teal-600" />
              <div className="absolute top-[66%] left-0 right-0 h-0.5 border-b border-dashed border-teal-600" />
              <div className="absolute top-4 left-4 text-xs font-bold text-teal-800 uppercase tracking-widest">
                ◄ 水流漂游方向 (从右往左)
              </div>
            </div>

            {/* Moving Food Items */}
            <div className="relative w-full h-full">
              {movingFoods.map((item) => {
                // Vertical lane position: 3 lanes spaced out generously
                const laneTops = ['10%', '42%', '74%'];
                const topPos = laneTops[item.lane] || '42%';

                return (
                  <div
                    key={item.uid}
                    style={{
                      left: `${item.x}%`,
                      top: topPos,
                      transform: 'translateX(-50%)',
                      position: 'absolute',
                    }}
                    onClick={() => handleFoodClick(item)}
                    className="group cursor-pointer select-none transition-transform hover:scale-120 hover:z-30 active:scale-95"
                  >
                    <div
                      className={`relative flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-white shadow-lg border-2 transition-all ${
                        item.food.isTrash
                          ? 'border-rose-300 hover:border-rose-500 hover:shadow-rose-200/80'
                          : 'border-slate-200 hover:border-emerald-500 hover:shadow-emerald-200/80'
                      }`}
                    >
                      {/* Icon */}
                      <span className="text-3xl md:text-4xl group-hover:scale-115 transition-transform drop-shadow-xs">
                        {item.food.icon}
                      </span>

                      {/* Text & Speed Badge */}
                      <div className="flex flex-col text-left">
                        <span className="text-sm md:text-base font-bold text-slate-900 group-hover:text-emerald-700 whitespace-nowrap">
                          {item.food.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              item.speedType === 'slow'
                                ? 'bg-amber-100 text-amber-800'
                                : item.speedType === 'medium'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {item.speedLabel}
                          </span>
                        </div>
                      </div>

                      {/* Prominent Click Button Tag */}
                      <span className="text-xs md:text-sm text-emerald-700 font-extrabold ml-2 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white px-2.5 py-1 rounded-xl transition-colors">
                        投喂 ➔
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Auxiliary Tools */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/90 rounded-2xl border border-slate-200 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              onOpenFoodWeb();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold rounded-xl border border-emerald-200 transition-colors cursor-pointer"
          >
            <Network className="w-4 h-4 text-emerald-600" />
            <span>食物网大图谱</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onOpenSpecies();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-800 hover:bg-teal-100 font-bold rounded-xl border border-teal-200 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>湿地生物图鉴</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const muted = sound.toggleBgm();
              setIsBgmMuted(muted);
            }}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer"
            title="背景音乐开关"
          >
            {isBgmMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Music className="w-4 h-4 text-emerald-600" />}
            <span>{isBgmMuted ? '音乐已关' : '背景音乐'}</span>
          </button>

          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setIsMuted(muted);
            }}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer"
            title="音效开关"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            <span>{isMuted ? '音效已关' : '音效开'}</span>
          </button>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新开始</span>
          </button>
        </div>
      </div>

      {/* Level / Animal Clear Full-Belly Banner Modal */}
      {levelClearBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-pop-in">
          <div className="p-6 md:p-8 bg-white rounded-3xl border-4 border-emerald-300 shadow-2xl text-center max-w-md">
            <div className="text-5xl mb-3 animate-bounce">🎉🍲</div>
            <h3 className="text-xl md:text-2xl font-bold font-kuaile text-emerald-950 mb-2">
              吃饱大获全胜！
            </h3>
            <p className="text-sm text-slate-700 font-medium mb-4">
              {levelClearBanner}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
              <span>下一只小动物马上登场...</span>
            </div>
          </div>
        </div>
      )}

      {/* Instant Science Educational Feedback Modal */}
      {feedbackInfo?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 md:p-8 text-center">
            {/* Top Warning Icon */}
            <div
              className={`w-16 h-16 mx-auto -mt-2 mb-3 rounded-2xl flex items-center justify-center text-3xl shadow-md ${
                feedbackInfo.isTrash ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {feedbackInfo.isTrash ? '🛍️' : '🧐'}
            </div>

            <h3 className="text-xl md:text-2xl font-bold font-kuaile text-slate-900 mb-2">
              {feedbackInfo.title}
            </h3>

            <p className="text-sm text-slate-600 font-medium mb-4">
              {feedbackInfo.message}
            </p>

            {/* Science explanation box */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-left text-xs md:text-sm text-amber-950 leading-relaxed mb-6">
              <strong className="block text-amber-900 mb-1 flex items-center gap-1">
                <span>💡 科学课本小秘密：</span>
              </strong>
              {feedbackInfo.scienceTip}
            </div>

            {/* Button */}
            {hearts > 0 ? (
              <button
                onClick={handleContinueAfterFeedback}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>我记住啦！继续捕捉美食</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-rose-600 font-bold mb-2">
                  💔 3 颗爱心耗尽啦，别气馁，科学探索需要仔细观察！
                </p>
                <button
                  onClick={handleRestart}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>重新挑战！</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Level Clear Celebration & Science Master Modal */}
      {levelClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-emerald-300 p-6 sm:p-8 text-center overflow-hidden">
            {/* Top Celebration Floating Badge */}
            <div className="w-20 h-20 mx-auto -mt-2 mb-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-emerald-950 flex items-center justify-center text-4xl shadow-lg border-2 border-white animate-bounce">
              🏆
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>关卡大捷 · 掌握生态食物链</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-kuaile text-emerald-950 mb-1">
              {levelClearModal.levelTitle} 通关！
            </h3>

            <p className="text-sm font-bold text-amber-700 mb-4">
              ✨ 成功掌握【{levelClearModal.levelSubtitle}】模式！
            </p>

            {/* Science Education Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-left text-xs sm:text-sm text-emerald-950 leading-relaxed mb-4">
              <strong className="block text-emerald-900 font-bold mb-1.5 flex items-center gap-1">
                <span>💡 本关科学课本小总结：</span>
              </strong>
              <p className="mb-2 text-slate-700">{levelClearModal.levelConcept}</p>
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 font-bold text-emerald-800 text-xs shadow-2xs">
                链条模型：{levelClearModal.chainDiagram}
              </div>
            </div>

            {/* Reward & Bonus Score */}
            <div className="mb-6 py-2 px-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-amber-900">通关奖励积分：</span>
              <span className="font-black font-kuaile text-amber-600 text-lg">+200 分</span>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              {levelClearModal.nextLevelId ? (
                <button
                  onClick={handleProceedToNextLevel}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer text-base"
                >
                  <span>开启第 {levelClearModal.nextLevelId} 关挑战</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : null}

              <button
                onClick={() => {
                  sound.playPop();
                  setLevelClearModal(null);
                  setFoodsEaten(0);
                  setAnimalState('hungry');
                }}
                className="w-full py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                留在本关巩固练习 ↺
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
