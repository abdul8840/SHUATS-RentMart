// AIAssistant.jsx
import { useState, useRef, useEffect } from 'react';
import { generateContentAPI, chatWithAIAPI } from '../../api/axios.js';
import {
  FiZap,
  FiSend,
  FiCopy,
  FiX,
  FiMessageSquare,
  FiEdit3,
  FiType,
  FiFileText,
  FiRefreshCw,
  FiCheck,
  FiChevronUp,
  FiUser,
  FiCpu,
  FiArrowRight,
  FiMaximize2,
  FiMinimize2,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AIAssistant = ({ onInsert, context = '', mode = 'forum' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [copied, setCopied] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen, chatMode]);

  const generateContent = async (type) => {
    if (!prompt.trim()) {
      toast.error('Please enter a topic or prompt');
      return;
    }
    setLoading(true);
    setGeneratedContent('');
    try {
      const { data } = await generateContentAPI({ prompt: prompt.trim(), type });
      if (data.success) setGeneratedContent(data.generatedContent);
    } catch (error) {
      toast.error('AI generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!prompt.trim() || loading) return;
    const userMsg = prompt.trim();
    setChatMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setPrompt('');
    setLoading(true);
    try {
      const { data } = await chatWithAIAPI({ message: userMsg, context });
      if (data.success) {
        setChatMessages((prev) => [...prev, { role: 'ai', content: data.reply }]);
      }
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', content: 'Sorry, I could not process your request. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (onInsert && generatedContent) {
      onInsert(generatedContent);
      toast.success('Content inserted!');
      setIsOpen(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const generateButtons =
    mode === 'forum'
      ? [
          { type: 'title', label: 'Titles', icon: <FiType className="w-3.5 h-3.5" /> },
          { type: 'caption', label: 'Caption', icon: <FiEdit3 className="w-3.5 h-3.5" /> },
          { type: 'article', label: 'Article', icon: <FiFileText className="w-3.5 h-3.5" /> },
          { type: 'improve', label: 'Improve', icon: <FiRefreshCw className="w-3.5 h-3.5" /> },
        ]
      : [
          {
            type: 'description',
            label: 'Description',
            icon: <FiFileText className="w-3.5 h-3.5" />,
          },
        ];

  // Floating trigger button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl
          font-semibold text-sm shadow-lg shadow-purple-500/25
          hover:shadow-xl hover:shadow-purple-500/35 hover:scale-[1.02]
          active:scale-[0.98] transition-all duration-300 cursor-pointer btn-ripple"
      >
        <FiZap className="w-4 h-4 group-hover:animate-bounce-soft" />
        AI Assistant
        <span className="px-1.5 py-0.5 bg-white/20 rounded-md text-[10px] font-bold">
          Beta
        </span>
      </button>
    );
  }

  return (
    <div
      className={`glass rounded-2xl overflow-hidden shadow-xl border border-purple-100 animate-scale-in transition-all duration-300 ${
        expanded ? 'fixed inset-4 sm:inset-8 z-50' : 'relative'
      }`}
    >
      {/* Expanded backdrop */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[-1]"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <FiZap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Assistant</h3>
            <p className="text-[10px] text-white/60">Powered by AI</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mode Toggle */}
          <button
            onClick={() => {
              setChatMode(!chatMode);
              setGeneratedContent('');
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer
              ${
                chatMode
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
          >
            {chatMode ? (
              <>
                <FiEdit3 className="w-3 h-3" />
                Generate
              </>
            ) : (
              <>
                <FiMessageSquare className="w-3 h-3" />
                Chat
              </>
            )}
          </button>

          {/* Expand/Collapse */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            {expanded ? <FiMinimize2 className="w-3.5 h-3.5" /> : <FiMaximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close */}
          <button
            onClick={() => {
              setIsOpen(false);
              setExpanded(false);
            }}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`flex flex-col ${expanded ? 'h-[calc(100%-52px)]' : 'max-h-[500px]'}`}>
        {chatMode ? (
          /* ===== CHAT MODE ===== */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FiMessageSquare className="w-7 h-7 text-purple-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Start a conversation</p>
                  <p className="text-xs text-gray-400">
                    Ask me anything about your{' '}
                    {mode === 'forum' ? 'forum post' : 'item listing'}
                  </p>
                </div>
              )}

              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[85%] ${
                      msg.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        msg.role === 'user'
                          ? 'bg-forest/10 text-forest'
                          : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <FiUser className="w-3.5 h-3.5" />
                      ) : (
                        <FiCpu className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-forest text-white rounded-br-md'
                          : 'bg-cream-dark/70 text-gray-800 rounded-bl-md'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <FiCpu className="w-3.5 h-3.5" />
                    </div>
                    <div className="px-4 py-3 bg-cream-dark/70 rounded-2xl rounded-bl-md">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce-soft" />
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce-soft"
                          style={{ animationDelay: '0.15s' }}
                        />
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce-soft"
                          style={{ animationDelay: '0.3s' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-cream-dark/50 bg-white/50">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask AI anything..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleChat()}
                  className="flex-1 bg-white border-2 border-cream-dark rounded-xl px-3.5 py-2.5 text-sm
                    focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all
                    placeholder-gray-400"
                  disabled={loading}
                />
                <button
                  onClick={handleChat}
                  disabled={loading || !prompt.trim()}
                  className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl
                    shadow-md shadow-purple-500/20
                    hover:shadow-lg hover:shadow-purple-500/30
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300 cursor-pointer shrink-0"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ===== GENERATE MODE ===== */
          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Prompt Input */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Your Prompt
                </label>
                <textarea
                  ref={inputRef}
                  placeholder={
                    mode === 'forum'
                      ? 'Enter your topic, idea, or text to improve...'
                      : 'Describe your item for an AI-generated description...'
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-white border-2 border-cream-dark rounded-xl px-3.5 py-3 text-sm
                    focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none
                    transition-all duration-300 resize-none placeholder-gray-400 leading-relaxed"
                />
              </div>

              {/* Generate Buttons */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Generate
                </label>
                <div className="flex flex-wrap gap-2">
                  {generateButtons.map((btn) => (
                    <button
                      key={btn.type}
                      onClick={() => generateContent(btn.type)}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border-2 border-cream-dark rounded-xl
                        text-xs sm:text-sm font-medium text-gray-700
                        hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300 cursor-pointer"
                    >
                      {btn.icon}
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100 animate-fade-in">
                  <div className="relative">
                    <div className="w-8 h-8 border-2 border-purple-200 rounded-full" />
                    <div className="absolute inset-0 w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-800">AI is thinking...</p>
                    <p className="text-xs text-purple-500">Generating your content</p>
                  </div>
                </div>
              )}

              {/* Generated Content */}
              {generatedContent && !loading && (
                <div className="animate-slide-up">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block flex items-center gap-1.5">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Generated Content
                  </label>
                  <div className="bg-white border-2 border-emerald-200 rounded-xl p-4 relative group">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {generatedContent}
                    </p>

                    {/* Gradient fade at bottom for long content */}
                    {generatedContent.length > 300 && (
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent rounded-b-xl pointer-events-none" />
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    {onInsert && (
                      <button
                        onClick={handleInsert}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl
                          text-sm font-semibold shadow-md shadow-purple-500/20
                          hover:shadow-lg hover:shadow-purple-500/30
                          transition-all duration-300 cursor-pointer btn-ripple"
                      >
                        <FiZap className="w-4 h-4" />
                        Use This
                      </button>
                    )}
                    <button
                      onClick={copyToClipboard}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-300 cursor-pointer
                        ${
                          copied
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-white border-cream-dark text-gray-600 hover:border-purple-200 hover:text-purple-700'
                        }`}
                    >
                      {copied ? (
                        <>
                          <FiCheck className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FiCopy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => generateContent(generateButtons[0].type)}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                        bg-white border-2 border-cream-dark text-gray-500
                        hover:border-purple-200 hover:text-purple-700
                        disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <FiRefreshCw className="w-3.5 h-3.5" />
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;