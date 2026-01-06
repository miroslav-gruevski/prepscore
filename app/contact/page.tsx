'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Mail, Send, CheckCircle, AlertCircle, MessageSquare, Loader2 } from 'lucide-react'

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState('loading')
    setErrorMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      // Using Web3Forms - free form submission service
      // Sign up at https://web3forms.com to get your access key
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setFormState('success')
        form.reset()
      } else {
        throw new Error(result.message || 'Failed to send message')
      }
    } catch (error) {
      setFormState('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sunset-coral/10 text-sunset-coral text-sm mb-6">
            <MessageSquare className="w-4 h-4" />
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Have a question, feedback, or feature request? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-sunset-coral/10">
                  <Mail className="w-5 h-5 text-sunset-coral" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Email Us</h3>
                  <p className="text-gray-400 text-sm">We'll respond within 24 hours</p>
                </div>
              </div>
              <a 
                href="mailto:support@prepscore.ai" 
                className="text-sunset-coral hover:underline"
              >
                support@prepscore.ai
              </a>
            </div>

            <div className="glass-card-subtle p-6">
              <h3 className="font-medium text-white mb-3">Common Topics</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Feature requests
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Bug reports
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Partnership inquiries
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  Account issues
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sunset-coral" />
                  General feedback
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            <div className="glass-card p-6 md:p-8">
              {formState === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                  <button
                    onClick={() => setFormState('idle')}
                    className="btn-ghost"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Web3Forms Access Key - Replace with your key from https://web3forms.com */}
                  <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
                  <input type="hidden" name="subject" value="New Contact Form Submission - PrepScore" />
                  <input type="hidden" name="from_name" value="PrepScore Contact Form" />
                  
                  {/* Honeypot for spam prevention */}
                  <input type="checkbox" name="botcheck" className="hidden" />

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="glass-input w-full"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="glass-input w-full"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">
                      Topic
                    </label>
                    <select
                      id="topic"
                      name="topic"
                      required
                      className="glass-input w-full"
                    >
                      <option value="">Select a topic...</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="partnership">Partnership</option>
                      <option value="account">Account Issue</option>
                      <option value="feedback">General Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="glass-input w-full resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  {formState === 'error' && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errorMessage || 'Failed to send message. Please try again.'}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formState === 'loading'}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {formState === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting, you agree to our{' '}
                    <Link href="/privacy" className="text-sunset-coral hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-sunset-coral transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-sunset-coral transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/" className="hover:text-sunset-coral transition-colors">Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

