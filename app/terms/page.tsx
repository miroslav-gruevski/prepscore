import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using PrepScore interview practice platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <img src="/PrepScore-symbol.svg" alt="" className="w-6 h-6" />
              <span className="text-lg font-display font-bold bg-gradient-to-r from-sunset-rose to-sunset-coral bg-clip-text text-transparent">
                PrepScore
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Content */}
      <main id="main-content" className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm mb-6">
            <FileText className="w-4 h-4" />
            Terms of Service
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400">
            Last updated: January 6, 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                By accessing or using PrepScore ("the Service"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use the Service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">2. Description of Service</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                PrepScore is an AI-powered interview practice platform that helps users improve their interview skills through:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Practice interview sessions with various interviewer personas</li>
                <li>Audio/video recording of practice responses</li>
                <li>AI-powered analysis and feedback on interview performance</li>
                <li>Progress tracking across multiple practice sessions</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">3. User Responsibilities</h2>
            <div className="text-gray-300 space-y-4">
              <p>As a user of PrepScore, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Provide accurate information when creating an account</li>
                <li>Keep your account credentials secure</li>
                <li>Use the Service for personal interview practice only</li>
                <li>Not use the Service for actual job interviews (cheating)</li>
                <li>Not attempt to reverse-engineer or exploit the Service</li>
                <li>Respect the intellectual property rights of PrepScore</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">4. Prohibited Uses</h2>
            <div className="text-gray-300 space-y-4">
              <p>You may NOT use PrepScore to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-red-400">Cheat in real interviews</strong> — PrepScore is for practice only</li>
                <li>Record or transcribe actual interviews without consent</li>
                <li>Share, sell, or distribute your account access</li>
                <li>Upload harmful, illegal, or inappropriate content</li>
                <li>Attempt to bypass security measures or rate limits</li>
                <li>Use automated tools to scrape or abuse the Service</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">5. Intellectual Property</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                The PrepScore platform, including its design, features, AI models, and content, is owned by PrepScore 
                and protected by intellectual property laws. You retain ownership of your interview recordings and 
                personal content.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">6. AI-Generated Content</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                PrepScore uses AI to generate interview questions and analyze your responses. While we strive for 
                accuracy, AI-generated feedback is for educational purposes only and should not be considered 
                professional career advice. Results may vary and are not guaranteed.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">7. Limitation of Liability</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                PrepScore is provided "as is" without warranties of any kind. We are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Outcomes of real job interviews</li>
                <li>Accuracy of AI-generated feedback</li>
                <li>Service interruptions or data loss</li>
                <li>Any indirect, incidental, or consequential damages</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">8. Termination</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                We reserve the right to suspend or terminate your account if you violate these Terms. 
                You may also delete your account at any time. Upon termination, your data will be 
                deleted in accordance with our Privacy Policy.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">9. Changes to Terms</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                We may update these Terms from time to time. We will notify you of significant changes 
                via email or through the Service. Continued use after changes constitutes acceptance.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">10. Contact</h2>
            <div className="text-gray-300">
              <p>
                Questions about these Terms? Please{' '}
                <Link href="/contact" className="text-sunset-coral hover:underline">
                  contact us
                </Link>.
              </p>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-sunset-coral transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-sunset-coral transition-colors">Contact</Link>
            <span>•</span>
            <Link href="/" className="hover:text-sunset-coral transition-colors">Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

