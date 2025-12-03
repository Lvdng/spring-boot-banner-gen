import React, { useState, useCallback, useEffect } from 'react';
import { AsciiOptions, CharSetType, CHAR_SETS, FIGLET_FONTS } from './types';
import { convertImageToAscii, generateFigletAscii } from './services/asciiEngine';
import { generateCreativeSlogan, generateAiAscii } from './services/geminiService';
import { 
  UploadIcon, 
  DownloadIcon, 
  CopyIcon, 
  RefreshIcon, 
  WandIcon, 
  CheckIcon,
  SparklesIcon,
  TypeIcon,
  ImageIcon
} from './components/Icons';

const DEFAULT_OPTIONS: AsciiOptions = {
  width: 80,
  contrast: 1.2,
  inverted: false,
  brightness: 0,
  charSet: CharSetType.STANDARD,
};

function App() {
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  
  // Image State
  const [file, setFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  
  // Text State
  const [textInput, setTextInput] = useState<string>('Spring Boot');
  const [textStyle, setTextStyle] = useState<string>('Standard');
  const [textError, setTextError] = useState<string | null>(null);

  // Common State
  const [asciiOutput, setAsciiOutput] = useState<string>('');
  const [options, setOptions] = useState<AsciiOptions>(DEFAULT_OPTIONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [slogan, setSlogan] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Load image preview when file changes
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageBase64(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  // Re-run standard algorithm when options or file change (Only in Image Mode)
  useEffect(() => {
    const runConversion = async () => {
      if (!file || activeTab !== 'image') return;
      
      setIsProcessing(true);
      try {
        const text = await convertImageToAscii(file, options);
        setAsciiOutput(text);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };

    // Debounce slider inputs
    const timeoutId = setTimeout(() => {
      runConversion();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [file, options, activeTab]);

  // Handler for AI Slogan
  const handleGenerateSlogan = async () => {
    if (activeTab === 'image' && !imageBase64) return;
    
    setIsAiProcessing(true);
    try {
      let promptInput = imageBase64 || '';
      // If in text mode, we can't analyze image, so we generate generic slogan or skip
      if (activeTab === 'text') {
         setSlogan("Driven by Spring Boot"); // Simple fallback
      } else {
        const newSlogan = await generateCreativeSlogan(promptInput);
        setSlogan(newSlogan);
      }
    } catch (e) {
      alert("AI Generation failed. Check API Key.");
    } finally {
      setIsAiProcessing(false);
    }
  };
  
  // Handler for AI ASCII (Experimental Image)
  const handleAiAscii = async () => {
      if (!imageBase64) return;
      setIsAiProcessing(true);
      try {
          const aiText = await generateAiAscii(imageBase64);
          setAsciiOutput(aiText);
      } catch(e) {
          alert("AI ASCII Generation failed.");
      } finally {
          setIsAiProcessing(false);
      }
  }

  // Handler for Text to ASCII (Local FIGlet)
  const handleTextToAscii = useCallback(async () => {
    if (!textInput.trim()) return;
    setIsProcessing(true);
    setTextError(null);
    try {
      const art = await generateFigletAscii(textInput, textStyle);
      setAsciiOutput(art);
    } catch (e: any) {
      console.error(e);
      setTextError(e.message || "Failed to generate text art");
      setAsciiOutput(''); // Clear output on error
    } finally {
      setIsProcessing(false);
    }
  }, [textInput, textStyle]);

  // Auto-generate text when typing stops
  useEffect(() => {
    if (activeTab === 'text') {
      const timeout = setTimeout(() => {
        handleTextToAscii();
      }, 500); // 500ms debounce
      return () => clearTimeout(timeout);
    }
  }, [textInput, textStyle, activeTab, handleTextToAscii]);

  const handleCopy = () => {
    const fullText = slogan ? `${asciiOutput}\n${' '.repeat(Math.max(0, Math.floor(options.width / 2) - Math.floor(slogan.length / 2)))}${slogan}` : asciiOutput;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullText = slogan ? `${asciiOutput}\n${' '.repeat(Math.max(0, Math.floor(options.width / 2) - Math.floor(slogan.length / 2)))}${slogan}` : asciiOutput;
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'banner.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setActiveTab('image');
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-200 font-sans selection:bg-spring-green selection:text-white flex flex-col">
      
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-spring-green to-emerald-700 rounded-md flex items-center justify-center font-mono font-bold text-white text-lg">
              B
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Spring Boot <span className="text-spring-green">Banner Gen</span>
            </h1>
          </div>
          <div className="text-xs text-neutral-500 font-mono hidden sm:block">
            banner.txt generator powered by React & Gemini
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Controls & Preview */}
        <div className="lg:col-span-4 space-y-6">

          {/* Tab Switcher */}
          <div className="flex p-1 bg-neutral-800 rounded-lg">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${
                activeTab === 'image' 
                ? 'bg-neutral-700 text-white shadow-sm' 
                : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <ImageIcon /> Image to ASCII
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${
                activeTab === 'text' 
                ? 'bg-neutral-700 text-white shadow-sm' 
                : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <TypeIcon /> Text to ASCII
            </button>
          </div>
          
          {/* IMAGE MODE CONTENT */}
          {activeTab === 'image' && (
            <>
              {/* Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center cursor-pointer relative overflow-hidden group
                  ${dragOver ? 'border-spring-green bg-spring-green/5' : 'border-neutral-700 hover:border-neutral-500 bg-neutral-800/50'}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <input 
                  id="fileInput" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                
                {imageBase64 ? (
                  <div className="relative h-48 w-full flex items-center justify-center">
                    <img 
                      src={imageBase64} 
                      alt="Preview" 
                      className="max-h-full max-w-full object-contain rounded shadow-lg" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2">
                      <RefreshIcon />
                      <span className="text-sm font-medium">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-spring-green transition-colors">
                      <UploadIcon />
                    </div>
                    <div>
                      <p className="font-medium text-white">Click or Drop Image</p>
                      <p className="text-sm text-neutral-500 mt-1">Supports PNG, JPG, WebP</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 space-y-6">
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Configuration</h2>
                
                {/* Resolution */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <label className="text-neutral-300">Width (Characters)</label>
                    <span className="font-mono text-spring-green">{options.width}</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="150" 
                    value={options.width} 
                    onChange={(e) => setOptions({...options, width: Number(e.target.value)})}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-spring-green"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <label className="text-neutral-300">Contrast</label>
                    <span className="font-mono text-spring-green">{options.contrast.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="3" 
                    step="0.1" 
                    value={options.contrast} 
                    onChange={(e) => setOptions({...options, contrast: Number(e.target.value)})}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-spring-green"
                  />
                </div>

                {/* Brightness */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <label className="text-neutral-300">Brightness Offset</label>
                    <span className="font-mono text-spring-green">{options.brightness}</span>
                  </div>
                  <input 
                    type="range" 
                    min="-100" 
                    max="100" 
                    step="5" 
                    value={options.brightness} 
                    onChange={(e) => setOptions({...options, brightness: Number(e.target.value)})}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-spring-green"
                  />
                </div>

                {/* Invert Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-neutral-300">Invert Colors</label>
                  <button 
                    onClick={() => setOptions({...options, inverted: !options.inverted})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${options.inverted ? 'bg-spring-green' : 'bg-neutral-700'}`}
                  >
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${options.inverted ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Char Set */}
                <div className="space-y-2">
                  <label className="text-sm text-neutral-300 block">Character Set</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(CHAR_SETS).map((key) => (
                      <button
                        key={key}
                        onClick={() => setOptions({...options, charSet: key as CharSetType})}
                        className={`px-3 py-2 text-xs font-mono rounded border transition-all ${
                          options.charSet === key 
                            ? 'bg-spring-green/20 border-spring-green text-spring-green' 
                            : 'bg-neutral-800 border-neutral-600 text-neutral-400 hover:border-neutral-500'
                        }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Gemini Actions */}
                {file && (
                  <div className="pt-4 border-t border-neutral-700 space-y-3">
                      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                          <SparklesIcon />
                          AI Enhancements
                      </h3>
                      <button
                        onClick={handleGenerateSlogan}
                        disabled={isAiProcessing}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50"
                      >
                        {isAiProcessing ? 'Thinking...' : 'Generate Slogan'} <WandIcon />
                      </button>
                      <button
                        onClick={handleAiAscii}
                        disabled={isAiProcessing}
                        className="w-full py-2 px-4 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        Generate AI ASCII Art (Experimental)
                      </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TEXT MODE CONTENT */}
          {activeTab === 'text' && (
             <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 space-y-6">
                 <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Text Configuration</h2>
                 
                 <div className="space-y-3">
                   <label className="text-sm text-neutral-300">Banner Text</label>
                   <input 
                      type="text" 
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-spring-green transition-colors"
                      placeholder="e.g. Spring Boot"
                   />
                 </div>

                 <div className="space-y-3">
                   <label className="text-sm text-neutral-300">Font Style</label>
                   <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {FIGLET_FONTS.map(font => (
                        <button
                          key={font.id}
                          onClick={() => setTextStyle(font.id)}
                          className={`px-3 py-2 text-xs font-medium rounded border transition-all text-left truncate ${
                            textStyle === font.id 
                            ? 'bg-spring-green/20 border-spring-green text-spring-green' 
                            : 'bg-neutral-800 border-neutral-600 text-neutral-400 hover:border-neutral-500'
                          }`}
                        >
                          {font.name}
                        </button>
                      ))}
                   </div>
                   <p className="text-xs text-neutral-500">
                     Note: Fonts are fetched on demand from CDN.
                   </p>
                 </div>
             </div>
          )}

        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-8 flex flex-col h-[600px] lg:h-auto bg-black rounded-xl border border-neutral-700 overflow-hidden shadow-2xl relative">
          
          {/* Output Toolbar */}
          <div className="flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-500">banner.txt</span>
              {(isProcessing || isAiProcessing) && <span className="text-xs text-spring-green animate-pulse">Processing...</span>}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                disabled={!asciiOutput}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors border border-neutral-700 disabled:opacity-50"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button 
                onClick={handleDownload}
                disabled={!asciiOutput}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-spring-green hover:bg-emerald-500 text-black text-xs font-bold transition-colors disabled:opacity-50 disabled:bg-neutral-700 disabled:text-neutral-500"
              >
                <DownloadIcon />
                Download
              </button>
            </div>
          </div>

          {/* ASCII Viewport */}
          <div className="flex-1 overflow-auto p-6 bg-[#1e1e1e] relative">
            {!asciiOutput && activeTab === 'image' && !file && (
              <div className="absolute inset-0 flex items-center justify-center text-neutral-600">
                <p>Upload an image to generate ASCII art</p>
              </div>
            )}
            {!asciiOutput && activeTab === 'text' && !textInput && (
              <div className="absolute inset-0 flex items-center justify-center text-neutral-600">
                <p>Enter text to generate banner</p>
              </div>
            )}

            {textError && activeTab === 'text' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-4 text-center">
                    <p className="mb-2 font-bold">Error generating text</p>
                    <p className="text-sm opacity-80">{textError}</p>
                </div>
            )}
            
            {asciiOutput && !textError && (
              <pre className="font-mono text-[10px] sm:text-xs leading-[0.6rem] sm:leading-[0.7rem] text-spring-green whitespace-pre w-max mx-auto select-text">
                {asciiOutput}
              </pre>
            )}

            {/* Slogan Overlay/Bottom (Only show if image mode, or generic if we enable it for text) */}
            {slogan && activeTab === 'image' && (
                <div className="mt-6 text-center">
                    <pre className="font-mono text-sm text-white/80 whitespace-pre-wrap border-t border-neutral-700 pt-4 inline-block">
                        {`:: ${slogan} ::`}
                    </pre>
                </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;