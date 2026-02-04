'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, Button, Input, Badge } from '@/components/ui';
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Sparkles,
  Crown,
  RefreshCw
} from 'lucide-react';
import { UserRole } from '@/types';
import { isPro } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: { filename: string; page: number }[];
}

const mockPDFs = [
  { id: '1', name: 'Project Proposal.pdf' },
  { id: '2', name: 'Annual Report 2025.pdf' },
  { id: '3', name: 'Research Paper.pdf' },
];

export default function ChatPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || UserRole.FREE_USER;
  const isProUser = isPro(userRole);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPDFs, setSelectedPDFs] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isProUser) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Based on the documents you've selected, here's what I found:\n\nThis is a simulated response. In a real implementation, this would be powered by an LLM that has access to the content of your PDFs. The AI would analyze your question "${input}" and provide relevant information extracted from your documents.\n\nKey points:\n• The AI can understand context and meaning\n• It can cite specific pages and documents\n• It provides accurate, source-backed answers`,
      timestamp: new Date(),
      sources: [
        { filename: 'Project Proposal.pdf', page: 3 },
        { filename: 'Research Paper.pdf', page: 12 },
      ],
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const togglePDF = (id: string) => {
    setSelectedPDFs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (!isProUser) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-primary-400" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">AI Chat is a Pro Feature</h1>
          <p className="text-dark-400 mb-8 max-w-md mx-auto">
            Upgrade to Pro to ask questions about your PDFs and get instant, 
            AI-powered answers with source citations.
          </p>
          
          <Card className="max-w-lg mx-auto p-6 mb-8">
            <h3 className="font-semibold text-white mb-4">What you can do with AI Chat:</h3>
            <ul className="text-left text-dark-300 space-y-3">
              <li className="flex items-start gap-2">
                <Sparkles className="text-primary-400 mt-1 shrink-0" size={16} />
                <span>Ask questions about your documents in natural language</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="text-primary-400 mt-1 shrink-0" size={16} />
                <span>Get answers with citations to specific pages</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="text-primary-400 mt-1 shrink-0" size={16} />
                <span>Summarize entire documents or specific sections</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="text-primary-400 mt-1 shrink-0" size={16} />
                <span>Compare information across multiple PDFs</span>
              </li>
            </ul>
          </Card>

          <Link href="/pricing">
            <Button size="lg" leftIcon={<Crown size={20} />}>
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex gap-6">
      {/* PDF Selection Sidebar */}
      <div className="w-64 shrink-0">
        <Card className="h-full flex flex-col">
          <div className="p-4 border-b border-dark-700">
            <h3 className="font-medium text-white">Select PDFs</h3>
            <p className="text-xs text-dark-400 mt-1">
              Choose which documents to search
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <button
              onClick={() => setSelectedPDFs(mockPDFs.map((p) => p.id))}
              className="w-full text-left px-3 py-2 text-sm text-primary-400 hover:bg-white/5 rounded-lg mb-2"
            >
              Select all
            </button>
            {mockPDFs.map((pdf) => (
              <button
                key={pdf.id}
                onClick={() => togglePDF(pdf.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  selectedPDFs.includes(pdf.id)
                    ? 'bg-primary-500/20 text-white'
                    : 'text-dark-300 hover:bg-white/5'
                )}
              >
                <FileText size={16} />
                <span className="truncate text-sm">{pdf.name}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <Bot className="mx-auto text-dark-500 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-dark-400 max-w-sm">
                    Ask me anything about your PDFs. I can help you find information, 
                    summarize content, and answer questions.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-4',
                      message.role === 'user' && 'flex-row-reverse'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                        message.role === 'user' 
                          ? 'bg-primary-600' 
                          : 'bg-accent-600'
                      )}
                    >
                      {message.role === 'user' ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>
                    <div
                      className={cn(
                        'flex-1 max-w-2xl',
                        message.role === 'user' && 'text-right'
                      )}
                    >
                      <div
                        className={cn(
                          'inline-block rounded-2xl px-4 py-3 text-left',
                          message.role === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'glass'
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.sources.map((source, index) => (
                            <Badge key={index} variant="default" className="text-xs">
                              📄 {source.filename}, page {source.page}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-dark-500 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="glass rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 text-dark-400">
                        <RefreshCw className="animate-spin" size={16} />
                        Thinking...
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-dark-700">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your PDFs..."
                className="flex-1"
                disabled={isLoading || selectedPDFs.length === 0}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading || selectedPDFs.length === 0}
              >
                <Send size={18} />
              </Button>
            </form>
            {selectedPDFs.length === 0 && (
              <p className="text-xs text-yellow-400 mt-2">
                Select at least one PDF to start chatting
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
