import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui';
import { CloudUpload, FolderOpen, FileText, Search, Bot, ScrollText, Brain, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
              Your personal PDF library{' '}
              <span className="gradient-text">with AI superpowers</span>
            </h1>
            <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
              Upload, organize, and interact with your documents like never before. 
              Get instant answers, summaries, and semantic search powered by AI.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link href="/auth/signup">
                <Button size="lg" leftIcon={<Sparkles size={20} />}>
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="glass" leftIcon={<CloudUpload size={18} />}>
                Upload
              </Button>
              <Button variant="glass" leftIcon={<FolderOpen size={18} />}>
                Ask Questions
              </Button>
              <Button variant="glass" leftIcon={<FileText size={18} />}>
                Summarize
              </Button>
            </div>
          </div>

          {/* Pricing tiers preview */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="card grid md:grid-cols-2 gap-8 p-8">
              <div>
                <span className="badge badge-free mb-4">Free Tier</span>
                <ul className="space-y-3 text-dark-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> 10 uploads/month
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Basic search
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Read only
                  </li>
                </ul>
              </div>
              <div>
                <span className="badge badge-pro mb-4">Pro Tier</span>
                <ul className="space-y-3 text-dark-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Unlimited uploads
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> AI summaries
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Semantic search
                  </li>
                </ul>
                <Link href="/pricing" className="block mt-4">
                  <Button size="sm">Start Free Trial</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold font-display text-center mb-12">
            Powerful Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="feature-card">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                <CloudUpload className="text-primary-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy Upload</h3>
              <p className="text-dark-400 text-sm">
                Drag and drop your PDFs or use our simple upload interface
              </p>
            </div>

            <div className="feature-card">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                <Search className="text-primary-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Search</h3>
              <p className="text-dark-400 text-sm">
                Find exactly what you need with keyword or semantic search
              </p>
            </div>

            <div className="feature-card">
              <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center mb-4">
                <Bot className="text-accent-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Q&A</h3>
              <p className="text-dark-400 text-sm">
                Ask questions and get instant answers from your documents
              </p>
            </div>

            <div className="feature-card">
              <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center mb-4">
                <ScrollText className="text-accent-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Summaries</h3>
              <p className="text-dark-400 text-sm">
                Get concise summaries of lengthy documents in seconds
              </p>
            </div>

            <div className="feature-card">
              <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center mb-4">
                <Brain className="text-accent-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Semantic Understanding</h3>
              <p className="text-dark-400 text-sm">
                AI understands the context and meaning of your documents
              </p>
            </div>

            <div className="feature-card bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-primary-500/30">
              <h3 className="text-lg font-semibold text-white mb-4">Ready to get started?</h3>
              <Link href="/pricing">
                <Button variant="outline" size="sm" className="w-full">
                  View All Pricing & Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Powered By Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-dark-500 uppercase tracking-wider text-sm mb-6">
              Powered By
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="px-6 py-3 glass rounded-lg text-dark-300">OpenAI</div>
              <div className="px-6 py-3 glass rounded-lg text-dark-300">Google AI</div>
              <div className="px-6 py-3 glass rounded-lg text-dark-300">IBM Watson</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
