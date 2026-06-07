import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { predictMatch, getTeamStats, getHeadToHead } from '../utils/api'
import { FlagIcon, QUALIFIED_TEAMS_2026 } from '../utils/flags.jsx'
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
  })
}

const StatBar = ({ label, value, color, max = 100 }) => (
  <div>
    <div className="flex justify-between text-sm mb-1 font-semibold">
      <span className="text-on-surface-variant">{label}</span>
      <span className={color}>{value}%</span>
    </div>
    <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
      />
    </div>
  </div>
)

const TeamCard = ({ team, side, selected }) => {
  const isHome = side === 'home'
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative h-48 rounded-lg overflow-hidden flex flex-col items-center justify-center text-center p-8 border-4 transition-all duration-300 ${selected
          ? isHome
            ? 'border-primary candy-shadow-pink bg-surface'
            : 'border-secondary candy-shadow-purple bg-surface'
          : 'border-outline-variant bg-surface-container-low'
        }`}
    >
      <div className={`absolute top-0 w-full h-1 ${isHome ? 'bg-primary' : 'bg-secondary'}`} />
      {selected ? (
        <>
          <FlagIcon team={selected} size="lg" />
          <h3 className="text-2xl font-black text-on-surface tracking-tight mt-3">{selected}</h3>
          <span className={`text-sm font-bold mt-1 ${isHome ? 'text-primary' : 'text-secondary'}`}>
            {isHome ? 'Home Team' : 'Away Team'}
          </span>
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">add_circle</span>
          <p className="text-on-surface-variant font-semibold">Select {isHome ? 'Home' : 'Away'} Team</p>
        </>
      )}
    </motion.div>
  )
}

const Predict = () => {
  const [teams, setTeams] = useState([])
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [homeStats, setHomeStats] = useState(null)
  const [awayStats, setAwayStats] = useState(null)
  const [h2h, setH2h] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
  setTeams(QUALIFIED_TEAMS_2026)
}, [])
  const handlePredict = async () => {
    if (!homeTeam || !awayTeam || homeTeam === awayTeam) return
    setLoading(true)
    setPrediction(null)
    try {
      const [pred, hStats, aStats, h2hData] = await Promise.all([
        predictMatch(homeTeam, awayTeam),
        getTeamStats(homeTeam),
        getTeamStats(awayTeam),
        getHeadToHead(homeTeam, awayTeam)
      ])
      setPrediction(pred)
      setHomeStats(hStats)
      setAwayStats(aStats)
      setH2h(h2hData)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const styleColors = {
    '🏆 Elite': { text: 'text-yellow-600', bg: 'bg-yellow-50' },
    '⚔️ Attacking': { text: 'text-red-500', bg: 'bg-red-50' },
    '🛡️ Defensive': { text: 'text-blue-500', bg: 'bg-blue-50' },
    '📈 Developing': { text: 'text-gray-500', bg: 'bg-gray-50' },
  }

  return (
    <div className="page-enter min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-32">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="text-center mb-12">
          <span className="bg-secondary-fixed text-on-secondary-fixed px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
            AI Powered
          </span>
          <h1 className="text-5xl md:text-6xl font-black mt-4 text-on-surface tracking-tight">
            Who's going to <span className="text-primary">win?</span>
          </h1>
          <p className="text-on-surface-variant mt-3 text-lg max-w-xl mx-auto">
            Select two teams and let our XGBoost model predict the outcome.
          </p>
        </motion.div>

        {/* Team selector */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="bg-surface rounded-lg p-8 candy-shadow-pink mb-8"
        >
          <div className="grid md:grid-cols-3 gap-6 items-center mb-6">
            {/* Home selector */}
            <div>
              <TeamCard team={homeTeam} side="home" selected={homeTeam} />
              <select
                value={homeTeam}
                onChange={e => setHomeTeam(e.target.value)}
                className="mt-3 w-full bg-surface-container border-2 border-outline-variant text-on-surface rounded-full px-4 py-3 font-semibold focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">-- Home Team --</option>
                {teams.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center text-xl font-black candy-shadow-blue"
              >
                VS
              </motion.div>
            </div>

            {/* Away selector */}
            <div>
              <TeamCard team={awayTeam} side="away" selected={awayTeam} />
              <select
                value={awayTeam}
                onChange={e => setAwayTeam(e.target.value)}
                className="mt-3 w-full bg-surface-container border-2 border-outline-variant text-on-surface rounded-full px-4 py-3 font-semibold focus:outline-none focus:border-secondary transition-colors"
              >
                <option value="">-- Away Team --</option>
                {teams.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePredict}
            disabled={!homeTeam || !awayTeam || loading || homeTeam === awayTeam}
            className="w-full bg-primary text-on-primary py-4 rounded-full font-black text-lg candy-shadow-pink disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="material-symbols-outlined"
                >
                  autorenew
                </motion.span>
                Analysing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">query_stats</span>
                Analyse Matchup
                <span className="bg-on-primary/20 text-on-primary text-xs px-2 py-0.5 rounded-full ml-1">AI</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="space-y-6"
            >

              {/* Prediction card */}
              <div className="bg-surface rounded-lg p-8 candy-shadow-pink">
                {/* Winner banner */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  className="bg-primary-fixed rounded-lg p-4 text-center mb-8"
                >
                  <p className="text-on-primary-fixed-variant text-sm font-bold uppercase tracking-wider mb-1">🏆 Predicted Winner</p>
                  <h2 className="text-4xl font-black text-on-surface">{prediction.predicted_winner}</h2>
                  <p className="text-on-surface-variant font-semibold mt-1">{prediction.confidence}% confidence</p>
                </motion.div>

                {/* Probability bars */}
                <div className="space-y-4">
                  <StatBar label={`${prediction.home_team} win`} value={prediction.home_win_prob} color="text-primary" />
                  <StatBar label="Draw" value={prediction.draw_prob} color="text-tertiary" />
                  <StatBar label={`${prediction.away_team} win`} value={prediction.away_win_prob} color="text-secondary" />
                </div>
              </div>

              {/* Team stats side by side */}
              {homeStats && awayStats && !homeStats.error && !awayStats.error && (
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { stats: homeStats, color: 'primary', shadow: 'candy-shadow-pink', fixed: 'primary-fixed', textFixed: 'on-primary-fixed-variant' },
                    { stats: awayStats, color: 'secondary', shadow: 'candy-shadow-purple', fixed: 'secondary-fixed', textFixed: 'on-secondary-fixed' }
                  ].map(({ stats, color, shadow, fixed, textFixed }) => {
                    const sc = styleColors[stats.play_style] || { text: 'text-gray-500', bg: 'bg-gray-50' }
                    return (
                      <motion.div
                        key={stats.team}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`bg-surface rounded-lg p-6 ${shadow}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-black text-on-surface">{stats.team}</h3>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${sc.bg} ${sc.text} mt-1 inline-block`}>
                              {stats.play_style}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-black text-${color}`}>{stats.win_rate}%</div>
                            <div className="text-xs text-on-surface-variant">Win Rate</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: 'Goals/Game', value: stats.goals_per_game, color: `text-${color}` },
                            { label: 'Conceded', value: stats.conceded_per_game, color: 'text-red-400' },
                            { label: 'Goal Diff', value: stats.goal_difference > 0 ? `+${stats.goal_difference}` : stats.goal_difference, color: stats.goal_difference >= 0 ? `text-${color}` : 'text-red-400' },
                          ].map(s => (
                            <div key={s.label} className="bg-surface-container rounded-lg p-3 text-center">
                              <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
                              <div className="text-xs text-on-surface-variant">{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {/* Head to head */}
              {h2h && h2h.total_matches > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-surface rounded-lg p-8 candy-shadow-purple"
                >
                  <h3 className="text-2xl font-black text-on-surface mb-6">⚔️ Head to Head</h3>
                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    {[
                      { value: h2h.team1_wins, label: `${h2h.team1} Wins`, color: 'text-primary', bg: 'bg-primary-fixed/30' },
                      { value: h2h.draws, label: 'Draws', color: 'text-tertiary', bg: 'bg-tertiary-fixed/30' },
                      { value: h2h.team2_wins, label: `${h2h.team2} Wins`, color: 'text-secondary', bg: 'bg-secondary-fixed/30' },
                    ].map(s => (
                      <div key={s.label} className={`${s.bg} rounded-lg p-4`}>
                        <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-on-surface-variant font-semibold mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-3">Recent Matches</p>
                    {h2h.recent_matches.map((match, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex justify-between items-center bg-surface-container rounded-full px-5 py-3 text-sm"
                      >
                        <span className="text-on-surface-variant w-12">{match.Year}</span>
                        <div className="flex items-center gap-1.5 font-bold text-on-surface">
                          <FlagIcon team={match['Home Team Name']} size="xs" />
                          <span>{match['Home Team Name']}</span>
                        </div>
                        <span className="font-black text-primary mx-2">{match['Home Team Score']} – {match['Away Team Score']}</span>
                        <div className="flex items-center gap-1.5 font-bold text-on-surface">
                          <span>{match['Away Team Name']}</span>
                          <FlagIcon team={match['Away Team Name']} size="xs" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {h2h && h2h.total_matches === 0 && (
                <div className="bg-surface-container rounded-lg p-6 text-center text-on-surface-variant font-semibold">
                  No head to head history found between these teams.
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Predict