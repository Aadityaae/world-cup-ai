import axios from 'axios'

const BASE_URL = 'https://world-cup-ai-production.up.railway.app'

export const getTeams = async () => {
  const res = await axios.get(`${BASE_URL}/teams`)
  return res.data
}

export const predictMatch = async (homeTeam, awayTeam) => {
  const res = await axios.post(`${BASE_URL}/predict`, {
    home_team: homeTeam,
    away_team: awayTeam
  })
  return res.data
}

export const getTeamStats = async (teamName) => {
  const res = await axios.get(`${BASE_URL}/team-stats/${teamName}`)
  return res.data
}

export const getHeadToHead = async (team1, team2) => {
  const res = await axios.post(`${BASE_URL}/head-to-head`, { team1, team2 })
  return res.data
}

export const getGroupStage = async () => {
  const res = await axios.get(`${BASE_URL}/group-stage`)
  return res.data
}

export const getSingleGroup = async (letter) => {
  const res = await axios.get(`${BASE_URL}/group-stage/${letter}`)
  return res.data
}

export const simulateTournament = async () => {
  const res = await axios.get(`${BASE_URL}/simulate`)
  return res.data
}