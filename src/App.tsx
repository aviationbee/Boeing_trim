/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { AviationHeader } from './components/AviationHeader';
import { FlightDetailsStep } from './components/FlightDetailsStep';
import { PassengerLoadStep } from './components/PassengerLoadStep';
import { CargoFuelStep } from './components/CargoFuelStep';
import { ResultsView } from './components/ResultsView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { FlightInputs, CalcResults, LoadsheetHistoryItem } from './types/trim';
import { INITIAL_INPUTS } from './data/aircraftData';
import { calculateFlightLoad, playAudioChime } from './utils/trimCalculator';

const STORAGE_KEY = 'boeing_trim_history_v1';
const DRAFT_KEY = 'boeing_trim_draft_v1';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Form Inputs State
  const [inputs, setInputs] = useState<FlightInputs>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : INITIAL_INPUTS;
    } catch {
      return INITIAL_INPUTS;
    }
  });

  // Saved History Items
  const [historyItems, setHistoryItems] = useState<LoadsheetHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Calculate live results
  const results: CalcResults = calculateFlightLoad(inputs);

  // Save draft inputs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(inputs));
    } catch {
      // ignore
    }
  }, [inputs]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(historyItems));
    } catch {
      // ignore
    }
  }, [historyItems]);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdateInputs = (updated: Partial<FlightInputs>) => {
    setInputs((prev) => ({ ...prev, ...updated }));
  };

  const triggerChime = (type: 'click' | 'calc' | 'error' = 'click') => {
    if (soundEnabled) {
      playAudioChime(type);
    }
  };

  const handleLogin = () => {
    triggerChime('calc');
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    setInputs(INITIAL_INPUTS);
    setCurrentStep(1);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    triggerChime('click');
    setIsLoggedIn(false);
  };

  const handleReset = () => {
    triggerChime('click');
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    setInputs(INITIAL_INPUTS);
    setCurrentStep(1);
  };

  const handleCalculate = () => {
    triggerChime('calc');
    setCurrentStep(4);
  };

  const handleSaveHistory = () => {
    const newItem: LoadsheetHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      inputs,
      results,
    };
    setHistoryItems((prev) => [newItem, ...prev.slice(0, 24)]);
  };

  const handleRestoreHistoryItem = (item: LoadsheetHistoryItem) => {
    triggerChime('click');
    setInputs(item.inputs);
    setCurrentStep(4);
    setIsHistoryOpen(false);
  };

  const handleClearHistory = () => {
    triggerChime('click');
    setHistoryItems([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    triggerChime('click');
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={handleLogin}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Aviation Header Navigation */}
      <AviationHeader
        currentStep={currentStep}
        onSelectStep={(s) => {
          triggerChime('click');
          setCurrentStep(s);
        }}
        aircraftReg={inputs.aircraftReg}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenHistory={() => {
          triggerChime('click');
          setIsHistoryOpen(true);
        }}
        onReset={handleReset}
        onLogout={handleLogout}
        isOnline={isOnline}
      />

      {/* Main Step Body */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 pb-12">
        {currentStep === 1 && (
          <FlightDetailsStep
            inputs={inputs}
            onChangeInputs={handleUpdateInputs}
            onNext={() => setCurrentStep(2)}
            playChime={() => triggerChime('click')}
          />
        )}

        {currentStep === 2 && (
          <PassengerLoadStep
            inputs={inputs}
            onChangeInputs={handleUpdateInputs}
            onNext={() => setCurrentStep(3)}
            onPrev={() => setCurrentStep(1)}
            playChime={() => triggerChime('click')}
          />
        )}

        {currentStep === 3 && (
          <CargoFuelStep
            inputs={inputs}
            onChangeInputs={handleUpdateInputs}
            onCalculate={handleCalculate}
            onPrev={() => setCurrentStep(2)}
            playChime={() => triggerChime('calc')}
          />
        )}

        {currentStep === 4 && (
          <ResultsView
            inputs={inputs}
            results={results}
            onEdit={() => {
              triggerChime('click');
              setCurrentStep(1);
            }}
            onRestart={handleReset}
            onSaveHistory={handleSaveHistory}
            playChime={() => triggerChime('calc')}
          />
        )}
      </main>

      {/* Offline Log History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyItems={historyItems}
        onRestore={handleRestoreHistoryItem}
        onClear={handleClearHistory}
        onDeleteOne={handleDeleteHistoryItem}
      />

      {/* Footer Title Credit */}
      <footer className="py-3 text-center border-t border-slate-900 bg-slate-950 text-[11px] font-mono text-slate-500">
        <div>BOEING TRIM • US-BANGLA AIRLINES FLEET</div>
        <div className="text-cyan-500/80 font-bold mt-0.5">built by radoan rasel</div>
      </footer>
    </div>
  );
}
