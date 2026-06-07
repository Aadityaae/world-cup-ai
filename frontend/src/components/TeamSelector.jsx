const TeamSelector = ({ teams, selected, onChange, label }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-300 text-sm font-semibold">{label}</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-700 text-white border border-gray-600 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-green-400 cursor-pointer"
      >
        <option value="">-- Select Team --</option>
        {teams.map(team => (
          <option key={team} value={team}>{team}</option>
        ))}
      </select>
    </div>
  )
}

export default TeamSelector