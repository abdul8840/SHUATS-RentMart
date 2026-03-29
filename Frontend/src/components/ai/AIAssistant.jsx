import { useState } from 'react';
import { generateContentAPI, chatWithAIAPI } from '../../api/axios.js';
import { FiZap, FiSend, FiCopy, FiX, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AIAssistant = ({ onInsert, context = '', mode = 'forum' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const generateContent = async (type) => {
    if (!prompt.trim()) {
      toast.error('Please enter a topic or prompt');
      return;
    }
    setLoading(true);
    try {
      const { data } = await generateContentAPI({ prompt: prompt.trim(), type });
      if (data.success) {
        setGeneratedContent(data.generatedContent);
      }
    } catch (error) {
      toast.error('AI generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!prompt.trim()) return;
    const userMsg = prompt.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setPrompt('');
    setLoading(true);

    try {
      const { data } = await chatWithAIAPI({ message: userMsg, context });
      if (data.success) {
        setChatMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I could not process your request.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (onInsert && generatedContent) {
      onInsert(generatedContent);
      toast.success('Content inserted!');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Copied to clipboard!');
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}>
        <FiZap /> AI Assistant
      </button>
    );
  }

  return (
    <div>
      <div>
        <h3><FiZap /> AI Assistant</h3>
        <div>
          <button onClick={() => setChatMode(!chatMode)}>
            <FiMessageSquare /> {chatMode ? 'Generate' : 'Chat'}
          </button>
          <button onClick={() => setIsOpen(false)}><FiX /></button>
        </div>
      </div>

      {chatMode ? (
        <div>
          <div>
            {chatMessages.map((msg, i) => (
              <div key={i} data-role={msg.role}>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
          <div>
            <input
              type="text"
              placeholder="Ask AI anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            />
            <button onClick={handleChat} disabled={loading}>
              <FiSend />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div>
            <textarea
              placeholder={mode === 'forum' ? 'Enter your topic or idea...' : 'Describe your item...'}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            {mode === 'forum' ? (
              <>
                <button onClick={() => generateContent('title')} disabled={loading}>Generate Titles</button>
                <button onClick={() => generateContent('caption')} disabled={loading}>Generate Caption</button>
                <button onClick={() => generateContent('article')} disabled={loading}>Generate Article</button>
                <button onClick={() => generateContent('improve')} disabled={loading}>Improve Text</button>
              </>
            ) : (
              <button onClick={() => generateContent('description')} disabled={loading}>Generate Description</button>
            )}
          </div>

          {loading && <p>🤖 AI is thinking...</p>}

          {generatedContent && (
            <div>
              <h4>Generated Content:</h4>
              <div>
                <p>{generatedContent}</p>
              </div>
              <div>
                <button onClick={handleInsert}><FiZap /> Use This</button>
                <button onClick={copyToClipboard}><FiCopy /> Copy</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;