const PredictionCard = ({ data }) => {
  if (!data) return null

  const { home_team, away_team, home_win_prob, away_win_prob, draw_prob, predicted_winner, confidence } = data

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl text-white">
      {/* Teams */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-center flex-1">
          <div className="text-2xl font-bold">{home_team}</div>
          <div className="text-green-400 text-sm mt-1">Home</div>
        </div>
        <div className="text-3xl font-bold text-gray-400 px-4">VS</div>
        <div className="text-center flex-1">
          <div className="text-2xl font-bold">{away_team}</div>
          <div className="text-blue-400 text-sm mt-1">Away</div>
        </div>
      </div>

      {/* Winner banner */}
      <div className="bg-green-600 rounded-xl p-3 text-center mb-6">
        <div className="text-sm text-green-100">🏆 Predicted Winner</div>
        <div className="text-2xl font-bold">{predicted_winner}</div>
        <div className="text-sm text-green-100">Confidence: {confidence}%</div>
      </div>

      {/* Probability bars */}
      <div className="space-y-3">
        {/* Home win */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{home_team} win</span>
            <span className="text-green-400 font-semibold">{home_win_prob}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-700"
              style={{ width: `${home_win_prob}%` }}
            />
          </div>
        </div>

        {/* Draw */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Draw</span>
            <span className="text-yellow-400 font-semibold">{draw_prob}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-yellow-500 h-3 rounded-full transition-all duration-700"
              style={{ width: `${draw_prob}%` }}
            />
          </div>
        </div>

        {/* Away win */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{away_team} win</span>
            <span className="text-blue-400 font-semibold">{away_win_prob}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-700"
              style={{ width: `${away_win_prob}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictionCard