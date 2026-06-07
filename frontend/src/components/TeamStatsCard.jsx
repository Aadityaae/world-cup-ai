import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

const TeamStatsCard = ({ data }) => {
  if (!data) return null

  const radarData = [
    { subject: 'Win Rate',     value: data.win_rate          },
    { subject: 'Goals/Game',   value: data.goals_per_game * 20 },
    { subject: 'Defense',      value: 100 - data.conceded_per_game * 20 },
    { subject: 'Goal Diff',    value: Math.max(0, (data.goal_difference + 3) * 15) },
    { subject: 'Experience',   value: Math.min(100, data.games * 2) },
  ]

  const styleColors = {
    '🏆 Elite':      'text-yellow-400',
    '⚔️ Attacking':  'text-red-400',
    '🛡️ Defensive':  'text-blue-400',
    '📈 Developing': 'text-gray-400',
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold">{data.team}</h3>
          <span className={`text-sm font-semibold ${styleColors[data.play_style] || 'text-gray-400'}`}>
            {data.play_style}
          </span>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-400">{data.win_rate}%</div>
          <div className="text-xs text-gray-400">Win Rate</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-700 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-green-400">{data.goals_per_game}</div>
          <div className="text-xs text-gray-400">Goals/Game</div>
        </div>
        <div className="bg-gray-700 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-red-400">{data.conceded_per_game}</div>
          <div className="text-xs text-gray-400">Conceded/Game</div>
        </div>
        <div className="bg-gray-700 rounded-xl p-3 text-center">
          <div className={`text-xl font-bold ${data.goal_difference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.goal_difference > 0 ? '+' : ''}{data.goal_difference}
          </div>
          <div className="text-xs text-gray-400">Goal Diff</div>
        </div>
      </div>

      {/* Radar chart */}
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
          <Radar
            dataKey="value"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TeamStatsCard