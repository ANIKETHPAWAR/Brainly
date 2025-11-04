import img1 from '../assets/mesh-757.png'
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { currentUser } = useAuth()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)
  const ctaRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 })
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.2 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 })


  const features = [
    {
      icon: '📚',
      title: 'Organize Everything',
      description: 'Save articles, videos, photos, and notes all in one place. Your personal knowledge vault at your fingertips.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find anything instantly with powerful search across titles, tags, and notes. Never lose track of your resources.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🏷️',
      title: 'Tag & Categorize',
      description: 'Organize with custom tags and filter by type. Keep your vault structured and easy to navigate.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '⏰',
      title: 'Smart Reminders',
      description: 'Set reminders to revisit important resources. Never forget to follow up on that great tutorial.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '☁️',
      title: 'Cloud Sync',
      description: 'Access your vault anywhere, anytime. All your resources are safely stored and synced in the cloud.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. Your personal vault stays private and accessible only to you.',
      color: 'from-pink-500 to-rose-500'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Sign In',
      description: 'Get started in seconds with Google Sign-In. No complex setup, just instant access to your vault.',
      icon: '🚀'
    },
    {
      number: '02',
      title: 'Add Resources',
      description: 'Save articles, videos, photos, or notes with just a few clicks. Add tags and notes for better organization.',
      icon: '➕'
    },
    {
      number: '03',
      title: 'Organize & Search',
      description: 'Use smart filters and search to find what you need instantly. Tag and categorize to keep everything organized.',
      icon: '📊'
    },
    {
      number: '04',
      title: 'Never Forget',
      description: 'Set reminders for important resources. Brainly ensures you never lose track of valuable content.',
      icon: '✨'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="italic text-7xl md:text-8xl text-white font-bold py-4 mb-6"
          >
            Brainly
          </motion.h1>
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white text-2xl md:text-3xl font-semibold mb-4"
          >
            Never lose a great idea again.
          </motion.h4>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-200 text-lg md:text-xl mb-8"
          >
            Build your personal knowledge hub — save tutorials, articles, and resources that matter, and let Brainly remind you before you forget.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link
              to={currentUser ? "/dashboard" : "/login"}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-xl font-semibold text-lg transition-all border border-white/20 hover:border-white/40"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>

      {/* What Brainly Does Section */}
      <motion.section
        id="features"
        ref={featuresRef}
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
        className="min-h-screen py-20 px-6 relative"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={featuresInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4 italic"
            >
              What Brainly Does
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-200 max-w-2xl mx-auto"
            >
              Your all-in-one solution for organizing, discovering, and never forgetting your valuable resources
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all cursor-pointer group"
              >
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        ref={howItWorksRef}
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
        className="min-h-screen py-20 px-6 relative"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={howItWorksInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4 italic"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-200 max-w-2xl mx-auto"
            >
              Get started in minutes. Building your knowledge vault is simple and intuitive
            </motion.p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => {
                const stepColors = [
                  'from-blue-500 to-cyan-500',
                  'from-purple-500 to-pink-500',
                  'from-green-500 to-emerald-500',
                  'from-orange-500 to-red-500'
                ]
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative"
                  >
                    {/* Step Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all h-full flex flex-col group relative overflow-hidden">
                      {/* Step Number Badge */}
                      <div className="absolute top-4 right-4">
                        <motion.div
                          className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={howItWorksInView ? { scale: 1 } : {}}
                          transition={{ 
                            duration: 0.5, 
                            delay: index * 0.1 + 0.2,
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          <span className="text-lg font-bold text-white">{step.number}</span>
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col items-center text-center pt-4">
                        {/* Icon */}
                        <motion.div
                          className="mb-6"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={howItWorksInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        >
                          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-r ${stepColors[index]} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20`}>
                            <span className="text-5xl">{step.icon}</span>
                          </div>
                        </motion.div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-3">
                          {step.title}
                        </h3>

                        {/* Description */}
                        <motion.p
                          className="text-gray-300 leading-relaxed text-sm flex-1"
                          initial={{ opacity: 0 }}
                          animate={howItWorksInView ? { opacity: 1 } : {}}
                          transition={{ delay: index * 0.1 + 0.4 }}
                        >
                          {step.description}
                        </motion.p>
                      </div>

                      {/* Subtle Progress Indicator */}
                      {index < steps.length - 1 && (
                        <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                          <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        ref={ctaRef}
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
        className="min-h-[60vh] py-20 px-6 relative flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 italic"
          >
            Ready to Build Your Vault?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of users who never lose track of their valuable resources. Start building your knowledge hub today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              to={currentUser ? "/dashboard" : "/login"}
              className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              Get Started Free →
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default Home