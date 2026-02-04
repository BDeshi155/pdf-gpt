'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, Card } from '@/components/ui';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const pricingPlans = {
  monthly: {
    free: { price: 0, period: 'forever' },
    pro: { price: 19, period: '/month' },
  },
  annual: {
    free: { price: 0, period: 'forever' },
    pro: { price: 15, period: '/month', total: 180 },
  },
};

const features = [
  { name: 'Monthly uploads', free: '10', pro: 'Unlimited' },
  { name: 'Storage', free: '100 MB', pro: '10 GB' },
  { name: 'PDF viewer', free: true, pro: true },
  { name: 'Basic keyword search', free: true, pro: true },
  { name: 'Semantic search', free: false, pro: true },
  { name: 'AI Q&A', free: false, pro: true },
  { name: 'Document summaries', free: false, pro: true },
  { name: 'PDF annotations', free: false, pro: true },
  { name: 'API access', free: false, pro: true },
  { name: 'Priority support', free: false, pro: true },
];

const faqs = [
  {
    question: 'What is the Free Trial?',
    answer:
      'Our Pro plan comes with a 14-day free trial. You can cancel anytime during the trial period and you won\'t be charged. After the trial, you\'ll be billed according to your selected plan.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer:
      'Yes! You can upgrade to Pro at any time and the change will be effective immediately. If you downgrade to Free, the change will take effect at the end of your current billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer:
      'You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.',
  },
  {
    question: 'What happens to my files if I downgrade?',
    answer:
      'Your files remain safe. If you exceed the free tier limits, you won\'t be able to upload new files, but your existing files will still be accessible. You can delete files to get under the limit.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a full refund within 30 days of your first payment if you\'re not satisfied with our service. Contact support to request a refund.',
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentPricing = pricingPlans[billingPeriod];
  const savings = pricingPlans.monthly.pro.price * 12 - (pricingPlans.annual.pro.total || 0);

  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Simple, transparent <span className="gradient-text">pricing</span>
            </h1>
            <p className="text-xl text-dark-300">
              Choose the plan that works best for you. Start free and upgrade when you need more.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-4 p-1 rounded-xl bg-dark-800/50 border border-dark-700">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={cn(
                  'px-6 py-2 rounded-lg font-medium transition-all',
                  billingPeriod === 'monthly'
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-400 hover:text-white'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={cn(
                  'px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                  billingPeriod === 'annual'
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-400 hover:text-white'
                )}
              >
                Annual
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                  Save ${savings}
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            {/* Free Plan */}
            <Card className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <p className="text-dark-400">Perfect for getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">${currentPricing.free.price}</span>
                <span className="text-dark-400 ml-2">{currentPricing.free.period}</span>
              </div>
              <Link href="/auth/signup">
                <Button variant="secondary" className="w-full mb-8">
                  Get Started
                </Button>
              </Link>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="text-green-400 shrink-0" size={20} />
                  <span>10 uploads per month</span>
                </li>
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="text-green-400 shrink-0" size={20} />
                  <span>100 MB storage</span>
                </li>
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="text-green-400 shrink-0" size={20} />
                  <span>Basic keyword search</span>
                </li>
                <li className="flex items-center gap-3 text-dark-500">
                  <X className="text-dark-600 shrink-0" size={20} />
                  <span>No AI features</span>
                </li>
                <li className="flex items-center gap-3 text-dark-500">
                  <X className="text-dark-600 shrink-0" size={20} />
                  <span>No semantic search</span>
                </li>
              </ul>
            </Card>

            {/* Pro Plan */}
            <Card variant="featured" className="p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-dark-400">For power users who need more</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold gradient-text">${currentPricing.pro.price}</span>
                <span className="text-dark-400 ml-2">{currentPricing.pro.period}</span>
                {billingPeriod === 'annual' && (
                  <p className="text-sm text-dark-500 mt-1">
                    Billed annually (${pricingPlans.annual.pro.total})
                  </p>
                )}
              </div>
              <Link href="/auth/signup?plan=pro">
                <Button className="w-full mb-8">Start Free Trial</Button>
              </Link>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="text-green-400 shrink-0" size={20} />
                  <span>Unlimited uploads</span>
                </li>
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="text-green-400 shrink-0" size={20} />
                  <span>10 GB storage</span>
                </li>
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="text-green-400 shrink-0" size={20} />
                  <span>Semantic search</span>
                </li>
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="text-green-400 shrink-0" size={20} />
                  <span>AI Q&A & Summaries</span>
                </li>
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="text-green-400 shrink-0" size={20} />
                  <span>Priority support</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Feature Comparison Table */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Feature Comparison
            </h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className="text-center">Free</th>
                    <th className="text-center">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index}>
                      <td className="font-medium">{feature.name}</td>
                      <td className="text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? (
                            <Check className="inline text-green-400" size={20} />
                          ) : (
                            <X className="inline text-dark-600" size={20} />
                          )
                        ) : (
                          <span className="text-dark-300">{feature.free}</span>
                        )}
                      </td>
                      <td className="text-center">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? (
                            <Check className="inline text-green-400" size={20} />
                          ) : (
                            <X className="inline text-dark-600" size={20} />
                          )
                        ) : (
                          <span className="text-primary-400 font-medium">{feature.pro}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="p-0 overflow-hidden cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="p-6 flex items-center justify-between">
                    <h3 className="font-medium text-white">{faq.question}</h3>
                    {openFaq === index ? (
                      <ChevronUp className="text-dark-400 shrink-0" size={20} />
                    ) : (
                      <ChevronDown className="text-dark-400 shrink-0" size={20} />
                    )}
                  </div>
                  {openFaq === index && (
                    <div className="px-6 pb-6 text-dark-300 border-t border-dark-700 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-dark-400 mb-8">
              Join thousands of users who manage their PDFs smarter.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg">Start Free Trial</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost" size="lg">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
