const GroupTable = ({ groupName, data }) => {
  if (!data) return null

  const { standings, matches } = data

  return (
    <div className="bg-gray-800 rounded-2xl p-5 shadow-xl text-white">
      <h3 className="text-lg font-bold text-green-400 mb-4">{groupName}</h3>

      {/* Standings table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2 pr-2">#</th>
              <th className="text-left py-2">Team</th>
              <th className="text-center py-2">P</th>
              <th className="text-center py-2">W</th>
              <th className="text-center py-2">D</th>
              <th className="text-center py-2">L</th>
              <th className="text-center py-2">GD</th>
              <th className="text-center py-2 text-yellow-400">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team) => (
              <tr
                key={team.team}
                className={`border-b border-gray-700 ${
                  team.advances ? 'bg-green-900/20' : ''
                }`}
              >
                <td className="py-2 pr-2 text-gray-400">{team.rank}</td>
                <td className="py-2 font-semibold flex items-center gap-2">
                  {team.advances && <span className="text-green-400 text-xs">✓</span>}
                  {team.team}
                </td>
                <td className="text-center py-2 text-gray-300">{team.played}</td>
                <td className="text-center py-2 text-green-400">{team.wins}</td>
                <td className="text-center py-2 text-yellow-400">{team.draws}</td>
                <td className="text-center py-2 text-red-400">{team.losses}</td>
                <td className={`text-center py-2 ${team.gd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {team.gd > 0 ? '+' : ''}{team.gd}
                </td>
                <td className="text-center py-2 font-bold text-yellow-400">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Match results */}
      <div className="space-y-2">
        <div className="text-xs text-gray-400 font-semibold mb-2">PREDICTED MATCHES</div>
        {matches.map((match, idx) => (
          <div key={idx} className="flex justify-between items-center bg-gray-700/50 rounded-lg px-3 py-2 text-sm">
            <span className={match.winner === match.home ? 'font-bold text-green-400' : 'text-gray-300'}>
              {match.home}
            </span>
            <span className="text-gray-400 font-mono text-xs">{match.predicted_score}</span>
            <span className={match.winner === match.away ? 'font-bold text-green-400' : 'text-gray-300'}>
              {match.away}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupTable