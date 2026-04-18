'use client'

import { useState, useEffect } from 'react'

const steps = [
  'hero',
  'hook',
  'problem',
  'shift',
  'hackathons',
  'bounties',
  'system',
  'proof',
  'howto',
  'mistakes',
  'cta'
]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Initialize theme based on system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else if (systemPrefersDark) {
      setTheme('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const showStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
    window.location.hash = steps[stepIndex]
    window.scrollTo(0, 0)
  }

  const nextSlide = () => {
    if (currentStep < steps.length - 1) {
      showStep(currentStep + 1)
    }
  }

  const previousSlide = () => {
    if (currentStep > 0) {
      showStep(currentStep - 1)
    }
  }

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (hash && steps.includes(hash)) {
      const stepIndex = steps.indexOf(hash)
      setCurrentStep(stepIndex)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault()
          nextSlide()
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          previousSlide()
          break
        case 'Home':
          e.preventDefault()
          showStep(0)
          break
        case 'End':
          e.preventDefault()
          showStep(steps.length - 1)
          break
        case 'd':
        case 'D':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            toggleTheme()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep])

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen" style={{ color: 'rgb(var(--foreground-rgb))', background: `linear-gradient(to bottom, transparent, rgb(var(--background-end-rgb))) rgb(var(--background-start-rgb))` }}>
      {/* Skip to main content for screen readers */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode (Ctrl+D)`}
      >
        {theme === 'light' ? (
          <svg aria-hidden="true" focusable="false" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg aria-hidden="true" focusable="false" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
        <span className="sr-only">Toggle theme</span>
      </button>

      
      {/* Top Navigation Bar */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 glass-effect"
        style={{ 
          background: 'rgba(var(--nav-bg-rgb), 0.95)', 
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgb(var(--nav-border-rgb))'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              
            </div>

            {/* Slide Indicators */}
            <div className="hidden md:flex items-center gap-2">
              {steps.map((step, index) => (
                <button
                  key={step}
                  onClick={() => showStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentStep === index 
                      ? 'w-8' 
                      : 'hover:w-4'
                  }`}
                  style={{ 
                    background: currentStep === index 
                      ? 'rgb(var(--accent-rgb))' 
                      : 'rgb(var(--border-rgb))'
                  }}
                  aria-label={`Go to slide ${index + 1}: ${step}`}
                  title={`Slide ${index + 1}: ${step}`}
                />
              ))}
            </div>

            {/* Slide Counter */}
            <div className="flex items-center gap-4">
              <div 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  background: 'rgba(var(--accent-rgb), 0.1)', 
                  color: 'rgb(var(--accent-rgb))' 
                }}
              >
                {currentStep + 1} / {steps.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Navigation Dots */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col gap-3">
          {steps.map((step, index) => (
            <button
              key={step}
              onClick={() => showStep(index)}
              className={`group relative transition-all ${
                currentStep === index ? 'scale-125' : 'hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}: ${step}`}
            >
              <div 
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStep === index 
                    ? 'ring-4 ring-opacity-30' 
                    : ''
                }`}
                style={{ 
                  background: currentStep === index 
                    ? 'rgb(var(--accent-rgb))' 
                    : 'rgb(var(--border-rgb))',
                  outlineColor: currentStep === index 
                    ? 'rgb(var(--accent-rgb))' 
                    : 'transparent'
                }}
              />
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="px-2 py-1 rounded text-xs whitespace-nowrap glass-effect">
                  {String(index + 1).padStart(2, '0')} {step}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-1 z-50"
        style={{ background: 'rgb(var(--border-rgb))' }}
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-label={`Progress: ${Math.round(progress)}%`}
      >
        <div 
          className="progress-fill h-full transition-all duration-600 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-50">
        <button
          onClick={previousSlide}
          disabled={currentStep === 0}
          className="nav-btn w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          style={{ 
            background: 'rgb(var(--accent-rgb))', 
            color: 'white' 
          }}
          aria-label="Previous slide (Arrow Left)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          disabled={currentStep === steps.length - 1}
          className="nav-btn w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          style={{ 
            background: 'rgb(var(--accent-rgb))', 
            color: 'white' 
          }}
          aria-label="Next slide (Arrow Right)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <main id="main-content" className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 h-screen flex items-center justify-center">
        <div className="w-full max-h-[calc(100vh-200px)] overflow-hidden">
          {/* Slide 1: Hero */}
          {currentStep === 0 && (
            <article className="slide-content h-full flex flex-col justify-center">
              <div className="text-center mb-6">
                <h1 className="premium-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                  Hackathons & Bounties
                </h1>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-6" style={{ color: 'rgb(var(--text-secondary-rgb))' }}>
                  How to Turn Skills into Income in Web3
                </h2>
              </div>
              
              {/* <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="premium-card p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl gradient-bg-accent flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Expert Led</h3>
                  <p className="text-sm" style={{ color: 'rgb(var(--text-secondary-rgb))' }}>
                    Industry professionals sharing real-world insights
                  </p>
                </div>
                
                <div className="premium-card p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl gradient-bg-secondary flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Premium Content</h3>
                  <p className="text-sm" style={{ color: 'rgb(var(--text-secondary-rgb))' }}>
                    High-quality materials and exclusive resources
                  </p>
                </div>
              </div> */}

              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect">
                  <div className="w-8 h-8 rounded-full gradient-bg-primary flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Agbetsiassi Kodjo Labore</p>
                    <p className="text-xs" style={{ color: 'rgb(var(--text-secondary-rgb))' }}>
                      DevRel & Ecosystem Builder · Founder, Africa Blockchain Community
                    </p>
                  </div>
                </div>
                
                {/* <div className="premium-card max-w-xl mx-auto p-4">
                  <p className="text-base font-medium mb-3" style={{ color: 'rgb(var(--accent-rgb))' }}>
                    No permission. No gatekeeping. Just skills, internet, and strategy.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" style={{ color: 'rgb(var(--accent-rgb))' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>Blockchain Summit Benin</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" style={{ color: 'rgb(var(--accent-rgb))' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>Saturday, April 18, 2026</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" style={{ color: 'rgb(var(--accent-rgb))' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>Cotonou Fidjrossè · SOGEM palace</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" style={{ color: 'rgb(var(--accent-rgb))' }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                      </svg>
                      <span>Limited seats - book your spot</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </article>
          )}

          {/* Slide 2: Hook */}
          {currentStep === 1 && (
            <article className="slide-content h-full flex flex-col justify-center">
              <header>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">1. Intro</h2>
              </header>
              <div className="space-y-3">
                <blockquote className="text-base sm:text-lg font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  Most people think you need a job to earn in tech. In Web3, that&apos;s no longer true.
                </blockquote>
                <p className="text-sm sm:text-base leading-relaxed">
                  Today, you don&apos;t need permission, a degree, or connections to start earning. You need skills, internet... and the right strategy.
                </p>
                <p className="text-sm sm:text-base font-medium" style={{ color: 'rgb(var(--accent-rgb))' }}>Pause.</p>
                <blockquote className="text-base sm:text-lg font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  And today, I&apos;ll show you exactly how.
                </blockquote>
              </div>
            </article>
          )}

          {/* Slide 3: Problem */}
          {currentStep === 2 && (
            <article className="slide-content h-full flex flex-col justify-center">
              <header>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">2. The Problem</h2>
              </header>
              <div className="space-y-3">
                <blockquote className="text-base sm:text-lg font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  Let&apos;s be honest - in Africa, talent is not the problem.
                </blockquote>
                <div>
                  <p className="text-sm sm:text-base mb-2">We have:</p>
                  <ul className="space-y-1" role="list">
                    <li className="flex items-start gap-2" role="listitem">
                      <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                      <span className="text-sm sm:text-base">Developers</span>
                    </li>
                    <li className="flex items-start gap-2" role="listitem">
                      <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                      <span className="text-sm sm:text-base">Designers</span>
                    </li>
                    <li className="flex items-start gap-2" role="listitem">
                      <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                      <span className="text-sm sm:text-base">Creators</span>
                    </li>
                  </ul>
                </div>
                <blockquote className="text-base sm:text-lg font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  But what&apos;s missing is access to opportunity.
                </blockquote>
                <div>
                  <ul className="space-y-1" role="list">
                    <li className="flex items-start gap-2" role="listitem">
                      <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                      <span className="text-sm sm:text-base">Limited local jobs</span>
                    </li>
                    <li className="flex items-start gap-2" role="listitem">
                      <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                      <span className="text-sm sm:text-base">Gatekeeping in Web2</span>
                    </li>
                    <li className="flex items-start gap-2" role="listitem">
                      <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                      <span className="text-sm sm:text-base">Lack of exposure</span>
                    </li>
                  </ul>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg text-center text-base font-semibold text-white" style={{ background: '#ef4444' }}>
                    Web2 is closed.
                  </div>
                  <div className="p-4 rounded-lg text-center text-base font-semibold text-white" style={{ background: '#22c55e' }}>
                    Web3 is open.
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Slide 4: Shift */}
          {currentStep === 3 && (
            <article className="slide-content">
              <header>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">3. The Shift (Why Web3 changes everything)</h2>
              </header>
              <div className="space-y-6 sm:space-y-8">
                <blockquote className="text-xl sm:text-2xl md:text-3xl font-semibold leading-relaxed pl-4 sm:pl-6 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  In Web3, you don't apply. You participate.
                </blockquote>
                <ul className="space-y-3 sm:space-y-4" role="list">
                  <li className="flex items-start gap-3" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-xl">{'>'}</span>
                    <span className="text-lg sm:text-xl">Open platforms</span>
                  </li>
                  <li className="flex items-start gap-3" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-xl">{'>'}</span>
                    <span className="text-lg sm:text-xl">Global collaboration</span>
                  </li>
                  <li className="flex items-start gap-3" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-xl">{'>'}</span>
                    <span className="text-lg sm:text-xl">Permissionless earning</span>
                  </li>
                </ul>
                <p className="text-lg sm:text-xl font-medium" style={{ color: 'rgb(var(--accent-rgb))' }}>
                  Your location doesn't matter. Your output does.
                </p>
              </div>
            </article>
          )}

          {/* Slide 5: Hackathons */}
          {currentStep === 4 && (
            <article className="slide-content">
              <header>
                <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3">4. Hackathons - The Entry Point</h2>
              </header>
              <div className="space-y-3">
                <blockquote className="text-base sm:text-lg font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  Let&apos;s start with hackathons.
                </blockquote>
                <ul className="space-y-1" role="list">
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Global competitions</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Sponsored by protocols (Ethereum, Solana, Starknet...)</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Teams build real products in days</span>
                  </li>
                </ul>
                <div className="p-3 rounded-lg text-center text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  Rewards: $500 - $50,000+
                </div>
                <ul className="space-y-1" role="list">
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Grants</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Job offers</span>
                  </li>
                </ul>
                <blockquote className="text-base sm:text-lg font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  But here&apos;s the truth: hackathons are not just about winning.
                </blockquote>
                <p className="text-xs sm:text-sm mb-1">They are about:</p>
                <ul className="space-y-1" role="list">
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Learning fast</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Building real projects</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Getting visibility</span>
                  </li>
                </ul>
                <blockquote className="text-sm sm:text-base font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  Your location doesn't matter. Your output does.
                </blockquote>
              </div>
            </article>
          )}

          {/* Slide 6: Bounties */}
          {currentStep === 5 && (
            <article className="slide-content h-full flex flex-col justify-center">
              <header>
                <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3">6. Bounties - The Cashflow Engine</h2>
              </header>
              <div className="space-y-3">
                <blockquote className="text-sm sm:text-base font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  Now let&apos;s talk about bounties.
                </blockquote>
                <p className="text-xs sm:text-sm mb-2">Paid tasks:</p>
                <ul className="space-y-1" role="list">
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Development</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Design</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Content</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Community</span>
                  </li>
                </ul>
                <p className="text-xs sm:text-sm mb-2">You get paid for:</p>
                <ul className="space-y-1" role="list">
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Fixing bugs</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Writing threads</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Creating content</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-xs sm:text-sm">Testing protocols</span>
                  </li>
                </ul>
                <div className="p-3 rounded-lg text-center text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  Range: $50 - $5,000 per task
                </div>
                <blockquote className="text-sm sm:text-base font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  Bounties are your daily income stream.
                </blockquote>
              </div>
            </article>
          )}

          {/* Slide 7: System */}
          {currentStep === 6 && (
            <article className="slide-content h-full flex flex-col justify-center">
              <header>
                <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3">6. The Web3 Earning Loop</h2>
              </header>
              <div className="space-y-3">
                <div className="p-3 rounded-lg text-center text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                  Learn &rarr; Build &rarr; Earn &rarr; Scale
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                    <span className="text-xs sm:text-sm">Learn Web3 skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-xs sm:text-sm">Build real projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                    <span className="text-xs sm:text-sm">Earn from bounties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">4</div>
                    <span className="text-xs sm:text-sm">Scale with teams</span>
                  </div>
                </div>
                <blockquote className="text-sm sm:text-base font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  This is how you turn skills into sustainable income.
                </blockquote>
              </div>
            </article>
          )}

          {/* Slide 8: Proof */}
          {currentStep === 7 && (
            <article className="slide-content h-full flex flex-col justify-center">
              <header>
                <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3">7. Real Opportunities</h2>
              </header>
              <div className="space-y-3">
                <p className="text-lg sm:text-xl mb-2">Current opportunities:</p>
                <ul className="space-y-1" role="list">
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-lg sm:text-xl">Ethereum Foundation: $2M+ in grants</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-lg sm:text-xl">Solana Foundation: $1M+ in grants</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-lg sm:text-xl">Starknet: Active bounty programs</span>
                  </li>
                </ul>
                <blockquote className="text-lg sm:text-xl font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  The money is real. The opportunities are global.
                </blockquote>
              </div>
            </article>
          )}

          {/* Slide 9: How to Start */}
          {currentStep === 8 && (
            <article className="slide-content h-full flex flex-col justify-center">
              <header>
                <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3">8. How to Start Today</h2>
              </header>
              <div className="space-y-3">
                <ul className="space-y-1" role="list">
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">1</span>
                    <span className="text-lg sm:text-xl">Join Web3 communities</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">2</span>
                    <span className="text-lg sm:text-xl">Learn basics (Solidity, Rust, or frontend)</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">3</span>
                    <span className="text-lg sm:text-xl">Start with small bounties ($50-100)</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">4</span>
                    <span className="text-lg sm:text-xl">Build your reputation</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">5</span>
                    <span className="text-lg sm:text-xl">Scale to bigger projects</span>
                  </li>
                </ul>
                <blockquote className="text-lg sm:text-xl font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  Start small. Think big. Earn now.
                </blockquote>
              </div>
            </article>
          )}

          {/* Slide 10: Mistakes */}
          {currentStep === 9 && (
            <article className="slide-content h-full flex flex-col justify-center">
              <header>
                <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3">9. Common Mistakes</h2>
              </header>
              <div className="space-y-3">
                <ul className="space-y-1" role="list">
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-lg sm:text-xl">Waiting for the &quot;perfect&quot; time</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-lg sm:text-xl">Trying to learn everything first</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-lg sm:text-xl">Working alone</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-lg sm:text-xl">Not building in public</span>
                  </li>
                </ul>
                <blockquote className="text-lg sm:text-xl font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  In Web3, visibility = opportunity.
                </blockquote>
              </div>
            </article>
          )}

          {/* Slide 11: Conclusion */}
          {currentStep === 10 && (
            <article className="slide-content h-full flex flex-col justify-center">
              <header>
                <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3">11. Conclusion</h2>
              </header>
              <div className="space-y-3">
                <blockquote className="text-sm sm:text-base font-semibold leading-relaxed pl-3 border-l-4" style={{ borderColor: 'rgb(var(--accent-rgb))', color: 'rgb(var(--foreground-rgb))' }}>
                  If you&apos;re serious about earning in Web3...
                </blockquote>
                <p className="text-lg sm:text-xl">Don&apos;t leave this room without taking action.</p>
                <ul className="space-y-1" role="list">
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-lg sm:text-xl">Join a community</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-lg sm:text-xl">Start learning</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-lg sm:text-xl">Build your first project</span>
                  </li>
                </ul>
                <p className="text-lg sm:text-xl font-medium" style={{ color: 'rgb(var(--accent-rgb))' }}>
                  Final line: Or better... come talk to me after this session.
                </p>
                
                <h3 className="text-sm sm:text-base font-bold mt-4 mb-2">Stay connected</h3>
                <ul className="space-y-1" role="list">
                  <li className="flex items-start gap-2" role="listitem">
                    <span aria-hidden="true" style={{ color: 'rgb(var(--accent-rgb))' }} className="font-bold text-sm">{'>'}</span>
                    <span className="text-lg sm:text-xl">WhatsApp / Phone: +229 01 50 74 91 19 · +228 98 90 10 32</span>
                  </li>
                </ul>
              </div>
            </article>
          )}
        </div>
        {/* Footer */}
        <footer className="mt-16 sm:mt-20 pt-8 sm:pt-10 border-t text-center text-sm" style={{ borderColor: 'rgb(var(--border-rgb))', color: 'rgb(var(--text-secondary-rgb))' }}>
          <p>Africa Blockchain Community</p>
        </footer>
      </main>
    </div>
  )
}
