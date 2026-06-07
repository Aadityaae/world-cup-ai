import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getTeams } from '../utils/api'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
  })
}

const Home = () => {
  const [teamCount, setTeamCount] = useState(0)

  useEffect(() => {
    getTeams().then(data => setTeamCount(data.count)).catch(() => {})
  }, [])

  const features = [
    {
      icon: 'analytics',
      title: 'Match Predictor',
      desc: 'Pick any two teams and get AI-powered win probabilities using our XGBoost model trained on real World Cup data.',
      path: '/predict',
      color: 'bg-primary-fixed',
      iconColor: 'text-primary',
      shadow: 'candy-shadow-pink',
      cta: 'Predict Now',
      ctaColor: 'text-primary',
    },
    {
      icon: 'grid_view',
      title: 'Group Stage',
      desc: 'All 12 real World Cup 2026 groups with AI predicted standings, match scores and who advances.',
      path: '/groups',
      color: 'bg-secondary-fixed',
      iconColor: 'text-secondary',
      shadow: 'candy-shadow-purple',
      cta: 'Explore Groups',
      ctaColor: 'text-secondary',
    },
    {
      icon: 'emoji_events',
      title: 'Tournament Simulator',
      desc: 'Simulate the full 48-team knockout bracket from Round of 32 all the way to the Final.',
      path: '/simulate',
      color: 'bg-tertiary-fixed',
      iconColor: 'text-tertiary',
      shadow: 'candy-shadow-blue',
      cta: 'Run Simulation',
      ctaColor: 'text-tertiary',
    },
  ]

  const stats = [
    { value: '964',          label: 'Matches Analysed', color: 'text-primary'   },
    { value: teamCount || '81', label: 'Teams in Database', color: 'text-secondary' },
    { value: '54.4%',        label: 'Model Accuracy',   color: 'text-tertiary'  },
    { value: '48',           label: 'WC 2026 Teams',    color: 'text-primary'   },
  ]

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative px-6 pt-32 pb-24 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-fixed opacity-30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary-fixed opacity-40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-6 py-2 rounded-full font-bold mb-6 text-sm">
              ⚽ WORLD CUP 2026 IS HERE
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-6xl md:text-8xl font-black text-on-surface tracking-tight leading-none mb-6"
          >
            The Ultimate <span className="text-primary">Goal</span> Awaits.
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-xl text-on-surface-variant mb-10 max-w-2xl mx-auto"
          >
            Machine learning powered predictions for the 2026 FIFA World Cup.
            Built with XGBoost, KMeans clustering and real historical match data.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/predict">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-on-primary px-10 py-4 rounded-full text-lg font-black candy-shadow-pink"
              >
                Predict a Match
              </motion.button>
            </Link>
            <Link to="/groups">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary text-on-secondary px-10 py-4 rounded-full text-lg font-black candy-shadow-purple"
              >
                Explore Groups
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-12 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp} initial="hidden" whileInView="show" custom={i}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-surface rounded-lg p-6 text-center candy-shadow-pink bouncy-hover"
            >
              <div className={`text-4xl font-black mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-on-surface-variant font-semibold text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-black text-on-surface">The Arena</h2>
            <p className="text-on-surface-variant mt-2 font-medium">Pick your mode and start your journey to glory.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.path}
                variants={fadeUp} initial="hidden" whileInView="show" custom={i}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`bg-surface p-8 rounded-lg ${f.shadow} relative overflow-hidden group cursor-pointer`}
              >
                <Link to={f.path} className="block">
                  {/* Background icon */}
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                    <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {f.icon}
                    </span>
                  </div>

                  <div className={`${f.color} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                    <span className={`material-symbols-outlined text-3xl ${f.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {f.icon}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black mb-3 text-on-surface">{f.title}</h3>
                  <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">{f.desc}</p>

                  <div className={`inline-flex items-center font-black ${f.ctaColor} group`}>
                    {f.cta}
                    <span className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto bg-surface-container rounded-lg p-8 text-center">
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider mb-4">Built With</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Python', 'XGBoost', 'KMeans', 'LSTM', 'Flask', 'React', 'Framer Motion', 'Pandas'].map(tech => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.1 }}
                className="bg-surface text-on-surface-variant px-4 py-2 rounded-full text-sm font-semibold candy-shadow-pink cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home