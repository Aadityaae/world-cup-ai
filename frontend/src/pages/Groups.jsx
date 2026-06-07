import { FlagIcon } from '../utils/flags.jsx'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getGroupStage } from '../utils/api'

const groupColors = [
  { header: 'bg-primary', shadow: 'candy-shadow-pink', accent: 'text-primary', bg: 'bg-primary-fixed/20', pts: 'text-primary' },
  { header: 'bg-secondary', shadow: 'candy-shadow-purple', accent: 'text-secondary', bg: 'bg-secondary-fixed/20', pts: 'text-secondary' },
  { header: 'bg-tertiary', shadow: 'candy-shadow-blue', accent: 'text-tertiary', bg: 'bg-tertiary-fixed/20', pts: 'text-tertiary' },
]

const icons = ['star', 'trophy', 'celebration', 'groups', 'bolt', 'rocket_launch', 'sports_soccer', 'emoji_events', 'local_fire_department', 'diamond', 'thunderstorm', 'military_tech']

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
  })
}

const GroupCard = ({ groupName, data, index }) => {
  const [expanded, setExpanded] = useState(false)
  const color = groupColors[index % groupColors.length]
  const icon = icons[index % icons.length]
  const { standings, matches } = data

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      custom={index}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className={`bg-surface rounded-lg ${color.shadow} border border-outline-variant/30 overflow-hidden`}
    >
      {/* Header */}
      <div className={`${color.header} px-6 py-4 flex justify-between items-center`}>
        <h3 className="text-on-primary font-black text-xl">{groupName}</h3>
        <span className="material-symbols-outlined text-on-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>

      {/* Standings table */}
      <div className="p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-on-surface-variant text-xs font-bold uppercase tracking-wider border-b border-outline-variant">
              <th className="text-left pb-3">#</th>
              <th className="text-left pb-3">Team</th>
              <th className="text-center pb-3">P</th>
              <th className="text-center pb-3">W</th>
              <th className="text-center pb-3">D</th>
              <th className="text-center pb-3">L</th>
              <th className="text-center pb-3">GD</th>
              <th className="text-right pb-3 font-black">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, i) => (
              <motion.tr
                key={team.team}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`border-b border-outline-variant/30 ${team.advances ? color.bg : ''}`}
              >
                <td className="py-2.5 text-on-surface-variant text-xs">{team.rank}</td>
                <td className="py-2.5 font-semibold text-on-surface">
                  <div className="flex items-center gap-2">
                    {team.advances && (
                      <span className={`text-xs font-black ${color.accent}`}>✓</span>
                    )}
                    <FlagIcon team={team.team} size="xs" />
                    <span>{team.team}</span>
                  </div>
                </td>
                <td className="py-2.5 text-center text-on-surface-variant">{team.played}</td>
                <td className="py-2.5 text-center text-green-600 font-semibold">{team.wins}</td>
                <td className="py-2.5 text-center text-yellow-600 font-semibold">{team.draws}</td>
                <td className="py-2.5 text-center text-red-500 font-semibold">{team.losses}</td>
                <td className={`py-2.5 text-center font-semibold ${team.gd >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {team.gd > 0 ? '+' : ''}{team.gd}
                </td>
                <td className={`py-2.5 text-right font-black text-base ${color.pts}`}>{team.points}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Toggle matches */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpanded(!expanded)}
          className={`mt-4 w-full text-xs font-bold uppercase tracking-wider py-2 rounded-full border border-outline-variant text-on-surface-variant hover:${color.bg} transition-all`}
        >
          {expanded ? '▲ Hide Matches' : '▼ Show Predicted Matches'}
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-3 space-y-2"
            >
              {matches.map((match, idx) => (
                <div key={idx} className="flex justify-between items-center bg-surface-container rounded-full px-4 py-2 text-xs">
                  <div className={`flex items-center gap-1.5 font-semibold ${match.winner === match.home ? color.accent : 'text-on-surface-variant'}`}>
                    <FlagIcon team={match.home} size="xs" />
                    <span>{match.home}</span>
                  </div>
                  <span className="font-black text-on-surface mx-2">{match.predicted_score}</span>
                  <div className={`flex items-center gap-1.5 font-semibold ${match.winner === match.away ? color.accent : 'text-on-surface-variant'}`}>
                    <span>{match.away}</span>
                    <FlagIcon team={match.away} size="xs" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const Groups = () => {
  const [groups, setGroups] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGroupStage()
      .then(data => { setGroups(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="page-enter min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-32">

        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-on-surface tracking-tight mb-3">
            Group <span className="text-primary">Stage</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            AI predicted standings for all 12 groups of the 2026 World Cup
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm font-semibold">
            <span className="flex items-center gap-1 text-primary">
              <span>✓</span> Advances to Round of 32
            </span>
            <span className="text-on-surface-variant">Sorted by Pts → GD → GF</span>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-primary text-3xl">sports_soccer</span>
            </motion.div>
            <p className="text-on-surface-variant font-semibold text-lg">Simulating all 12 groups...</p>
            <p className="text-on-surface-variant text-sm">This may take a few seconds</p>
          </div>
        )}

        {/* Groups grid */}
        {groups && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(groups).map(([groupName, groupData], i) => (
              <GroupCard
                key={groupName}
                groupName={groupName}
                data={groupData}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Groups