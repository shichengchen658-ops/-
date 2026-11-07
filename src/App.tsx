/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, TabType } from './components/Header';
import { HomeView } from './components/HomeView';
import { FeedingArena } from './components/FeedingArena';
import { FoodWebModal } from './components/FoodWebModal';
import { SpeciesModal } from './components/SpeciesModal';
import { CertificateModal } from './components/CertificateModal';
import { EcoKnowledgeView } from './components/EcoKnowledgeView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isFoodWebOpen, setIsFoodWebOpen] = useState<boolean>(false);
  const [isSpeciesOpen, setIsSpeciesOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  // Highest score and stars
  const [finalScore, setFinalScore] = useState<number>(500);
  const [finalStars, setFinalStars] = useState<number>(3);

  const handleGameComplete = (score: number, stars: number) => {
    setFinalScore(score);
    setFinalStars(stars);
    setIsCertificateOpen(true);
  };

  const handleRestartGame = () => {
    setIsCertificateOpen(false);
    setCurrentTab('arena');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbf7] text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top 3-Zone Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'foodweb') {
            setIsFoodWebOpen(true);
          } else if (tab === 'species') {
            setIsSpeciesOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            onStartGame={() => setCurrentTab('arena')}
            onOpenFoodWeb={() => setIsFoodWebOpen(true)}
            onOpenSpecies={() => setIsSpeciesOpen(true)}
            onOpenKnowledge={() => setCurrentTab('knowledge')}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        )}

        {currentTab === 'arena' && (
          <FeedingArena
            onOpenFoodWeb={() => setIsFoodWebOpen(true)}
            onOpenSpecies={() => setIsSpeciesOpen(true)}
            onGameComplete={handleGameComplete}
          />
        )}

        {currentTab === 'knowledge' && (
          <EcoKnowledgeView
            onStartPlay={() => setCurrentTab('arena')}
            onOpenFoodWeb={() => setIsFoodWebOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <FoodWebModal
        isOpen={isFoodWebOpen}
        onClose={() => setIsFoodWebOpen(false)}
      />

      <SpeciesModal
        isOpen={isSpeciesOpen}
        onClose={() => setIsSpeciesOpen(false)}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        score={finalScore}
        stars={finalStars}
        onClose={() => setIsCertificateOpen(false)}
        onRestart={handleRestartGame}
        onBackHome={() => {
          setIsCertificateOpen(false);
          setCurrentTab('home');
        }}
      />

      {/* Clean, unboxed footer following the design guidelines */}
      <footer className="mt-auto border-t border-emerald-100/80 bg-white/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>厦门筼筜湖湿地生态科普</span>
            <span aria-hidden="true">·</span>
            <span>小学三年级科学课程实践教学</span>
            <span aria-hidden="true">·</span>
            <span>食物链与生物多样性</span>
          </div>
          <div className="text-slate-400">
            爱护城市湿地 · 垃圾分类不入湖 · 守护小白鹭的家园
          </div>
        </div>
      </footer>
    </div>
  );
}
