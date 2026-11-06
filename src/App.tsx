/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnniversaryProvider } from './context/AnniversaryContext';
import { HeartParticles } from './components/HeartParticles';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CounterSection } from './components/CounterSection';
import { GallerySection } from './components/GallerySection';
import { LoveLetterSection } from './components/LoveLetterSection';
import { MusicPlayer } from './components/MusicPlayer';
import { CustomizerModal } from './components/CustomizerModal';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <AnniversaryProvider>
      <div className="min-h-screen bg-[#fbf9f5] text-[#2d1e20] relative flex flex-col font-sans selection:bg-[#ffdada] selection:text-[#4a0e17]">
        {/* Ambient Floating Hearts in Background */}
        <HeartParticles />

        {/* 3-Zone Top Bar Navigation */}
        <Navbar />

        {/* Main Content Layout */}
        <main className="flex-1 w-full">
          <Hero />
          <CounterSection />
          <GallerySection />
          <LoveLetterSection />
        </main>

        {/* Floating Heirloom Audio Player */}
        <MusicPlayer />

        {/* In-Browser Personalization Modal */}
        <CustomizerModal />

        {/* Footer */}
        <Footer />
      </div>
    </AnniversaryProvider>
  );
}
