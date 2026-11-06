import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnniversaryConfig, defaultAnniversaryConfig, PhotoMemory, MusicConfig } from '../config/anniversaryConfig';

interface AnniversaryContextType {
  config: AnniversaryConfig;
  updateConfig: (updater: (prev: AnniversaryConfig) => AnniversaryConfig) => void;
  resetToDefaults: () => void;
  updateCoupleNames: (names: string) => void;
  updateStartDate: (dateIso: string) => void;
  updatePhotos: (photos: PhotoMemory[]) => void;
  updateHeroPhoto: (url: string) => void;
  updateSurprisePhoto: (url: string) => void;
  updateMusic: (music: Partial<MusicConfig>) => void;
  isCustomizing: boolean;
  setIsCustomizing: (val: boolean) => void;
  showSurpriseModal: boolean;
  setShowSurpriseModal: (val: boolean) => void;
}

const STORAGE_KEY = 'anniversary_app_config_v3';

const AnniversaryContext = createContext<AnniversaryContextType | undefined>(undefined);

export const AnniversaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AnniversaryConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all 20 photos exist; merge if fewer
        let photos = defaultAnniversaryConfig.photos;
        if (parsed.photos && Array.isArray(parsed.photos) && parsed.photos.length === 20) {
          photos = parsed.photos;
        } else if (parsed.photos && Array.isArray(parsed.photos) && parsed.photos.length > 0) {
          photos = defaultAnniversaryConfig.photos.map((defaultP, idx) => {
            return parsed.photos[idx] || defaultP;
          });
        }

        const music: MusicConfig = parsed.music && parsed.music.filePath
          ? { ...defaultAnniversaryConfig.music, ...parsed.music }
          : defaultAnniversaryConfig.music;

        return {
          ...defaultAnniversaryConfig,
          ...parsed,
          anniversaryDate: defaultAnniversaryConfig.anniversaryDate,
          heroPhoto: parsed.heroPhoto || defaultAnniversaryConfig.heroPhoto,
          surprisePhoto: parsed.surprisePhoto || defaultAnniversaryConfig.surprisePhoto,
          photos,
          music,
        };
      }
    } catch {
      // Fallback to default
    }
    return defaultAnniversaryConfig;
  });

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [config]);

  const updateConfig = (updater: (prev: AnniversaryConfig) => AnniversaryConfig) => {
    setConfig(prev => updater(prev));
  };

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('anniversary_app_config_v1');
    } catch {
      // Ignore
    }
    setConfig(defaultAnniversaryConfig);
  };

  const updateCoupleNames = (names: string) => {
    setConfig(prev => ({ ...prev, coupleNames: names }));
  };

  const updateStartDate = (dateIso: string) => {
    setConfig(prev => ({ ...prev, anniversaryDate: dateIso }));
  };

  const updatePhotos = (photos: PhotoMemory[]) => {
    setConfig(prev => ({ ...prev, photos }));
  };

  const updateHeroPhoto = (url: string) => {
    setConfig(prev => ({ ...prev, heroPhoto: url }));
  };

  const updateSurprisePhoto = (url: string) => {
    setConfig(prev => ({
      ...prev,
      surprisePhoto: url,
      surprise: { ...prev.surprise, photoUrl: url },
    }));
  };

  const updateMusic = (musicUpdate: Partial<MusicConfig>) => {
    setConfig(prev => ({
      ...prev,
      music: { ...prev.music, ...musicUpdate },
    }));
  };

  return (
    <AnniversaryContext.Provider
      value={{
        config,
        updateConfig,
        resetToDefaults,
        updateCoupleNames,
        updateStartDate,
        updatePhotos,
        updateHeroPhoto,
        updateSurprisePhoto,
        updateMusic,
        isCustomizing,
        setIsCustomizing,
        showSurpriseModal,
        setShowSurpriseModal,
      }}
    >
      {children}
    </AnniversaryContext.Provider>
  );
};

export const useAnniversary = (): AnniversaryContextType => {
  const context = useContext(AnniversaryContext);
  if (!context) {
    throw new Error('useAnniversary must be used within an AnniversaryProvider');
  }
  return context;
};
