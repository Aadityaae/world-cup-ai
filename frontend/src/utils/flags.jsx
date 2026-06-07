// Maps team names to ISO 3166-1 alpha-2 country codes
export const teamFlags = {
  // Group A
  'Mexico':                'mx',
  'South Africa':          'za',
  'South Korea':           'kr',
  'Czech Republic':        'cz',
  // Group B
  'Canada':                'ca',
  'Bosnia and Herzegovina':'ba',
  'Qatar':                 'qa',
  'Switzerland':           'ch',
  // Group C
  'Spain':                 'es',
  'Cape Verde':            'cv',
  'Saudi Arabia':          'sa',
  'Uruguay':               'uy',
  // Group D
  'United States':         'us',
  'Paraguay':              'py',
  'Australia':             'au',
  'Turkey':                'tr',
  // Group E
  'Germany':               'de',
  'Ivory Coast':           'ci',
  'Ecuador':               'ec',
  'Curacao':               'cw',
  // Group F
  'Portugal':              'pt',
  'Nigeria':               'ng',
  'Colombia':              'co',
  'New Zealand':           'nz',
  // Group G
  'France':                'fr',
  'Belgium':               'be',
  'Peru':                  'pe',
  'Iran':                  'ir',
  // Group H
  'England':               'gb-eng',
  'Senegal':               'sn',
  'Serbia':                'rs',
  'Panama':                'pa',
  // Group I
  'Brazil':                'br',
  'Japan':                 'jp',
  'Croatia':               'hr',
  'Chile':                 'cl',
  // Group J
  'Argentina':             'ar',
  'Algeria':               'dz',
  'Austria':               'at',
  'Jordan':                'jo',
  // Group K
  'Netherlands':           'nl',
  'Cameroon':              'cm',
  'Ghana':                 'gh',
  'Uzbekistan':            'uz',
  // Group L
  'Denmark':               'dk',
  'Morocco':               'ma',
  'Haiti':                 'ht',
  'Scotland':              'gb-sct',
}

export const getFlag = (teamName) => {
  const code = teamFlags[teamName]
  if (!code) return null
  return code
}

// React component for inline use
export const FlagIcon = ({ team, size = 'sm' }) => {
  const code = getFlag(team)
  if (!code) return <span className="text-lg">🏴</span>

  const sizes = {
    xs: 'w-5 h-4',
    sm: 'w-8 h-6',
    md: 'w-10 h-8',
    lg: 'w-14 h-10',
  }

  return (
    <span
      className={`fi fi-${code} ${sizes[size] || sizes.sm} rounded-sm shadow-sm inline-block`}
      style={{ backgroundSize: 'cover' }}
    />
  )
}
// Only the 48 qualified teams for 2026
export const QUALIFIED_TEAMS_2026 = [
  'Mexico', 'South Africa', 'South Korea', 'Czech Republic',
  'Canada', 'Bosnia and Herzegovina', 'Qatar', 'Switzerland',
  'Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay',
  'United States', 'Paraguay', 'Australia', 'Turkey',
  'Germany', 'Ivory Coast', 'Ecuador', 'Curacao',
  'Portugal', 'Nigeria', 'Colombia', 'New Zealand',
  'France', 'Belgium', 'Peru', 'Iran',
  'England', 'Senegal', 'Serbia', 'Panama',
  'Brazil', 'Japan', 'Croatia', 'Chile',
  'Argentina', 'Algeria', 'Austria', 'Jordan',
  'Netherlands', 'Cameroon', 'Ghana', 'Uzbekistan',
  'Denmark', 'Morocco', 'Haiti', 'Scotland',
].sort()