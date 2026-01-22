'use client';

import { useState, useRef, useEffect } from 'react';
import { Hotspot } from '@/data/hotspots';
import { CountryInfo } from '@/data/countries';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    type: 'hotspot' | 'country';
    name: string;
  };
}

interface InquiryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHotspot?: Hotspot | null;
  selectedCountry?: CountryInfo | null;
}

export function InquiryPanel({
  isOpen,
  onClose,
  selectedHotspot,
  selectedCountry
}: InquiryPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Generate context-aware placeholder
  const getPlaceholder = () => {
    if (selectedHotspot) {
      return `Ask about ${selectedHotspot.name}...`;
    }
    if (selectedCountry) {
      return `Ask about ${selectedCountry.name}...`;
    }
    return 'Ask about any global situation, country, or topic...';
  };

  // Generate suggested questions based on context
  const getSuggestedQuestions = () => {
    if (selectedHotspot) {
      return [
        `What caused the ${selectedHotspot.name}?`,
        `Who are the key players in ${selectedHotspot.name}?`,
        `What are the humanitarian impacts?`,
        `What are possible resolutions?`
      ];
    }
    if (selectedCountry) {
      return [
        `What is the political situation in ${selectedCountry.name}?`,
        `What are the main challenges facing ${selectedCountry.name}?`,
        `What is ${selectedCountry.name}'s relationship with neighboring countries?`,
        `What is the economic outlook for ${selectedCountry.name}?`
      ];
    }
    return [
      'What are the most significant global tensions right now?',
      'How does climate change affect geopolitics?',
      'What is the state of US-China relations?',
      'What regions are at highest risk of conflict?'
    ];
  };

  const handleSubmit = async (questionText?: string) => {
    const question = questionText || input.trim();
    if (!question || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
      timestamp: new Date(),
      context: selectedHotspot
        ? { type: 'hotspot', name: selectedHotspot.name }
        : selectedCountry
        ? { type: 'country', name: selectedCountry.name }
        : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: {
            hotspot: selectedHotspot,
            country: selectedCountry
          },
          history: messages.slice(-6) // Include last 6 messages for context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your question. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[480px] bg-surface/98 backdrop-blur-md border-l border-border shadow-2xl z-30 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border bg-surface-light/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-tactical-blue/20 border border-tactical-blue/50 flex items-center justify-center">
              <span className="text-xl">🧠</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Intel Analyst</h2>
              <p className="text-xs text-text-muted">Powered by Claude</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-foreground transition-colors text-xl p-2"
          >
            ×
          </button>
        </div>

        {/* Context indicator */}
        {(selectedHotspot || selectedCountry) && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-text-muted">Context:</span>
            <span className="text-xs px-2 py-1 rounded bg-tactical-green/20 text-tactical-green border border-tactical-green/50">
              {selectedHotspot?.name || selectedCountry?.name}
            </span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-full bg-surface-light border border-border flex items-center justify-center mb-4">
              <span className="text-3xl opacity-50">💬</span>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Ask Anything
            </h3>
            <p className="text-sm text-text-secondary mb-6 max-w-sm">
              Get deep analysis and context about global situations, conflicts, countries, and geopolitical dynamics.
            </p>

            {/* Suggested Questions */}
            <div className="w-full space-y-2">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                Suggested Questions
              </p>
              {getSuggestedQuestions().map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSubmit(question)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:border-tactical-green hover:bg-surface-light transition-colors text-sm text-text-secondary hover:text-foreground"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-tactical-blue/20 border border-tactical-blue/30'
                      : 'bg-surface-light border border-border'
                  }`}
                >
                  {message.context && (
                    <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                      <span>📍</span>
                      <span>{message.context.name}</span>
                    </div>
                  )}
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                  <div className="text-xs text-text-muted mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface-light border border-border rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-tactical-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-tactical-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-tactical-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-text-muted">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-surface-light/30">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            rows={1}
            className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-tactical-green resize-none"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-tactical-green/20 border border-tactical-green/50 text-tactical-green rounded-lg hover:bg-tactical-green/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="text-lg">→</span>
          </button>
        </div>
        <p className="text-xs text-text-muted mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
