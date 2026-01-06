import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how PrepScore collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm mb-6">
            <Shield className="w-4 h-4" />
            Privacy Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Your Privacy Matters
          </h1>
          <p className="text-gray-400">
            Last updated: January 6, 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">1. Information We Collect</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                PrepScore collects information to provide you with the best interview practice experience. We collect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Account Information:</strong> Email address, name, and profile picture when you sign up</li>
                <li><strong className="text-white">Interview Recordings:</strong> Audio/video recordings you make during practice sessions</li>
                <li><strong className="text-white">Usage Data:</strong> How you interact with our platform to improve our services</li>
                <li><strong className="text-white">Device Information:</strong> Browser type, device type, and operating system</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">2. How We Use Your Information</h2>
            <div className="text-gray-300 space-y-4">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Provide AI-powered analysis of your interview responses</li>
                <li>Track your progress and improvement over time</li>
                <li>Personalize your interview practice experience</li>
                <li>Send you important updates about our service</li>
                <li>Improve our AI models and platform features</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">3. Data Storage & Security</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Your data security is our priority. We implement industry-standard security measures:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>All data is encrypted in transit using TLS 1.3</li>
                <li>Recordings are stored securely and encrypted at rest</li>
                <li>We use secure cloud infrastructure with regular security audits</li>
                <li>Access to user data is strictly limited to authorized personnel</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">4. Data Retention</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                We retain your interview recordings and analysis for as long as your account is active. 
                You can delete your recordings at any time from your dashboard. When you delete your account, 
                all associated data is permanently removed within 30 days.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">5. Third-Party Services</h2>
            <div className="text-gray-300 space-y-4">
              <p>We use trusted third-party services to provide our features:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Deepgram:</strong> For speech-to-text transcription</li>
                <li><strong className="text-white">Google/Anthropic AI:</strong> For interview analysis</li>
                <li><strong className="text-white">Vercel:</strong> For hosting and infrastructure</li>
              </ul>
              <p className="text-gray-400">
                These providers have their own privacy policies and are bound by data processing agreements.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">6. Your Rights</h2>
            <div className="text-gray-300 space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Delete your account and all associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">7. Contact Us</h2>
            <div className="text-gray-300">
              <p>
                If you have questions about this privacy policy or your data, please{' '}
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
            <Link href="/terms" className="hover:text-sunset-coral transition-colors">Terms of Service</Link>
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

