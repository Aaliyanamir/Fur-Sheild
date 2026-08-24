import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, UploadCloud, Download, CheckCircle2, RefreshCw, Wand2, Image as ImageIcon, ArrowRight, Shield } from 'lucide-react';

const samplePets = [
  {
    id: 'sample-1',
    name: 'Buddy (Golden Retriever)',
    originalUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-2',
    name: 'Luna (Siamese Cat)',
    originalUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
  }
];

const aiStyles = [
  {
    id: 'royal',
    name: 'Royal Renaissance Portrait',
    description: 'Classic 18th-century oil painting with ornate velvet attire and regal lighting.',
    mockResultUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Companion',
    description: 'Futuristic neon aesthetic with subtle cybernetic visor overlays.',
    mockResultUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vector',
    name: 'Minimalist Vector Art',
    description: 'Clean modern flat vector illustration with crisp geometric shapes.',
    mockResultUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'watercolor',
    name: 'Watercolor Expression',
    description: 'Soft pastel liquid watercolor splashes on grain paper canvas.',
    mockResultUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80'
  }
];

const AvatarStudio = () => {
  const [selectedPet, setSelectedPet] = useState(samplePets[0]);
  const [selectedStyle, setSelectedStyle] = useState(aiStyles[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedAvatar, setGeneratedAvatar] = useState(null);
  const [currentStepText, setCurrentStepText] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(10);
    setCurrentStepText('Analyzing pet facial landmarks...');

    setTimeout(() => {
      setGenerationProgress(45);
      setCurrentStepText('Applying Stable Diffusion style weights...');
    }, 1000);

    setTimeout(() => {
      setGenerationProgress(80);
      setCurrentStepText('Rendering high-resolution 4K avatar...');
    }, 2200);

    setTimeout(() => {
      setGenerationProgress(100);
      setGeneratedAvatar(selectedStyle.mockResultUrl);
      setIsGenerating(false);
    }, 3200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-16 font-sans">
      {/* HEADER BANNER */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="inline-flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-700">
          <Wand2 className="w-4 h-4 text-slate-900" />
          <span>AI Pet Avatar Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Transform Your Pet Photo with AI</h1>
        <p className="text-xs text-slate-500 max-w-xl font-medium">
          Select a pet photo and an artistic style. Our image-to-image neural network will generate a custom high-resolution digital portrait.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: CONTROLS & SELECTION */}
        <div className="space-y-6 lg:col-span-2">
          {/* Step 1: Select Pet Photo */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
              Select or Upload Pet Photo
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {samplePets.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => {
                    setSelectedPet(pet);
                    setGeneratedAvatar(null);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                    selectedPet.id === pet.id
                      ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <img src={pet.originalUrl} alt={pet.name} className="w-12 h-12 rounded-xl object-cover" />
                  <span className="text-xs font-bold text-slate-900 truncate">{pet.name}</span>
                </button>
              ))}
            </div>

            {/* Upload Zone */}
            <div className="border-2 border-dashed border-slate-200 p-6 rounded-2xl text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-700">Upload custom pet photo</p>
              <p className="text-[10px] text-slate-400">Supports JPG, PNG (Max 10MB)</p>
            </div>
          </div>

          {/* Step 2: Choose AI Style */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
              Choose Artistic AI Style
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setSelectedStyle(style);
                    setGeneratedAvatar(null);
                  }}
                  className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${
                    selectedStyle.id === style.id
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <h4 className="text-xs font-bold">{style.name}</h4>
                  <p className={`text-[11px] font-normal leading-relaxed ${
                    selectedStyle.id === style.id ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {style.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold py-4 rounded-2xl shadow-md text-sm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
            <span>Generate AI Avatar ({selectedStyle.name})</span>
          </button>
        </div>

        {/* RIGHT COLUMN: PREVIEW & GENERATION OUTPUT */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Studio Preview Canvas
            </h3>

            {/* Generated Output Box */}
            <div className="aspect-square rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden relative flex items-center justify-center">
              {isGenerating ? (
                <div className="p-6 text-center space-y-4 w-full">
                  <RefreshCw className="w-8 h-8 text-slate-900 animate-spin mx-auto" />
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-900">{currentStepText}</p>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-900 h-full transition-all duration-500"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{generationProgress}% Completed</span>
                  </div>
                </div>
              ) : generatedAvatar ? (
                <img src={generatedAvatar} alt="Generated AI Avatar" className="w-full h-full object-cover animate-fade-in" />
              ) : (
                <div className="text-center p-6 space-y-2 text-slate-400">
                  <ImageIcon className="w-10 h-10 mx-auto" />
                  <p className="text-xs font-semibold text-slate-500">Your AI generated portrait will appear here.</p>
                  <p className="text-[10px]">Click "Generate AI Avatar" to start.</p>
                </div>
              )}
            </div>
          </div>

          {/* Download / Save Actions */}
          {generatedAvatar && !isGenerating && (
            <div className="space-y-3">
              <button
                onClick={() => alert('Mock Download: High-resolution AI Portrait downloaded!')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download High-Res 4K Portrait
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarStudio;
