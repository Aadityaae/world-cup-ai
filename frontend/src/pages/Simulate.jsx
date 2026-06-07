import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { simulateTournament } from '../utils/api'
import { FlagIcon } from '../utils/flags.jsx'
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
  })
}

const roundConfig = {
  'Round of 32': { color: 'border-outline-variant', bg: 'bg-surface-container-low', accent: 'text-on-surface-variant', icon: 'sports_soccer' },
  'Round of 16': { color: 'border-tertiary/40', bg: 'bg-tertiary-fixed/10', accent: 'text-tertiary', icon: 'exercise' },
  'Quarter Finals': { color: 'border-secondary/40', bg: 'bg-secondary-fixed/10', accent: 'text-secondary', icon: 'local_fire_department' },
  'Semi Finals': { color: 'border-primary/40', bg: 'bg-primary-fixed/10', accent: 'text-primary', icon: 'bolt' },
  'Final': { color: 'border-primary', bg: 'bg-primary-fixed/20', accent: 'text-primary', icon: 'emoji_events' },
}

const MatchCard = ({ match, roundName, index }) => {
  const config = roundConfig[roundName] || roundConfig['Round of 32']
  const homeWon = match.winner === match.home

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="bg-surface rounded-lg p-4 candy-shadow-pink border border-outline-variant/30"
    >
      {/* Home team */}
      <div className={`flex justify-between items-center mb-2 ${homeWon ? 'text-primary' : 'text-on-surface-variant'}`}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FlagIcon team={match.home} size="xs" />
          <span className="font-bold text-sm truncate">{match.home}</span>
        </div>
        <span className="text-xs font-semibold ml-2">{match.home_prob}%</span>
      </div>

      <div className="text-center text-on-surface-variant text-xs font-bold my-1">vs</div>

      {/* Away team */}
      <div className={`flex justify-between items-center mb-3 ${!homeWon ? 'text-secondary' : 'text-on-surface-variant'}`}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FlagIcon team={match.away} size="xs" />
          <span className="font-bold text-sm truncate">{match.away}</span>
        </div>
        <span className="text-xs font-semibold ml-2">{match.away_prob}%</span>
      </div>

      {/* Probability bar */}
      <div className="w-full flex h-1.5 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${match.home_prob}%` }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="bg-primary h-full"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${match.away_prob}%` }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="bg-secondary h-full"
        />
      </div>

      {/* Winner */}
      <div className="bg-primary-fixed/30 rounded-full px-3 py-1 flex items-center justify-center gap-2">
        <FlagIcon team={match.winner} size="xs" />
        <span className="text-on-primary-fixed-variant text-xs font-black">
          🏅 {match.winner}
        </span>
      </div>
    </motion.div>
  )
}

const Simulate = () => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSimulate = async () => {
    setLoading(true)
    setResult(null)
    try {
      const data = await simulateTournament()
      setResult(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="page-enter min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-32">

        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-on-surface tracking-tight mb-3">
            Simulate the <span className="text-primary">Glory</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            Watch the full 2026 World Cup bracket unfold using AI predictions — from Round of 32 to the Final.
          </p>
        </motion.div>

        {/* Simulate button */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="flex justify-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSimulate}
            disabled={loading}
            className="bg-primary text-on-primary px-16 py-5 rounded-full font-black text-xl candy-shadow-pink disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {loading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="material-symbols-outlined text-2xl"
                >
                  autorenew
                </motion.span>
                Simulating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_circle
                </span>
                Simulate World Cup 2026
              </>
            )}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Winner banner */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative bg-primary rounded-xl p-10 text-center mb-12 overflow-hidden candy-shadow-pink-lg"
              >
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="material-symbols-outlined text-[300px] text-on-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    emoji_events
                  </span>
                </div>

                <div className="relative z-10">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🏆
                  </motion.div>
                  <p className="text-on-primary/80 font-bold uppercase tracking-widest text-sm mb-2">
                    2026 World Cup Winner
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <FlagIcon team={result.winner} size="lg" />
                    <h2 className="text-5xl font-black text-on-primary">{result.winner}</h2>
                    <FlagIcon team={result.winner} size="lg" />
                  </div>
                  <p className="text-on-primary/70 text-sm">As predicted by AI · MetLife Stadium · July 19, 2026</p>
                </div>
              </motion.div>

              {/* Rounds */}
              {result.rounds.map((round, roundIdx) => {
                const config = roundConfig[round.round] || roundConfig['Round of 32']
                return (
                  <motion.div
                    key={roundIdx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: roundIdx * 0.1, duration: 0.5 }}
                    className={`border-2 ${config.color} ${config.bg} rounded-xl p-6 mb-8`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-full bg-surface flex items-center justify-center candy-shadow-pink`}>
                        <span className={`material-symbols-outlined text-xl ${config.accent}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}>
                          {config.icon}
                        </span>
                      </div>
                      <h2 className={`text-xl font-black ${config.accent}`}>{round.round}</h2>
                      <span className="text-on-surface-variant text-sm font-semibold">
                        {round.matches.length} matches
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                      {round.matches.map((match, matchIdx) => (
                        <MatchCard
                          key={matchIdx}
                          match={match}
                          roundName={round.round}
                          index={matchIdx}
                        />
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Simulate