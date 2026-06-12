const LOCAL_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/

function parseLocalDate(localDate) {
  if (!localDate || typeof localDate !== 'string') {
    return null
  }

  const match = localDate.match(LOCAL_DATE_PATTERN)
  if (!match) {
    return null
  }

  const [, month, day, year, hour, minute] = match
  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  )

  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate.toISOString()
}

function buildTeamMap(teams = []) {
  return teams.reduce((acc, team) => {
    if (team?.id) {
      acc[String(team.id)] = team
    }
    return acc
  }, {})
}

function buildStadiumMap(stadiums = []) {
  return stadiums.reduce((acc, stadium) => {
    if (stadium?.id) {
      acc[String(stadium.id)] = stadium
    }
    return acc
  }, {})
}

function deriveStatus(game) {
  const finished = String(game?.finished || '').toUpperCase()
  const timeElapsed = String(game?.time_elapsed || '').toLowerCase()

  if (finished === 'TRUE' || timeElapsed === 'finished') {
    return 'completed'
  }

  if (timeElapsed === 'notstarted') {
    return 'future_scheduled'
  }

  return 'in_progress'
}

function toScore(value) {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

function deriveWinner(game, homeTeamName, awayTeamName) {
  if (deriveStatus(game) !== 'completed') {
    return ''
  }

  const homeGoals = toScore(game?.home_score)
  const awayGoals = toScore(game?.away_score)

  if (homeGoals === awayGoals) {
    return 'Draw'
  }

  return homeGoals > awayGoals ? homeTeamName : awayTeamName
}

function transformGame(game, teamMap, stadiumMap) {
  const homeTeam = teamMap[String(game?.home_team_id)] || {}
  const awayTeam = teamMap[String(game?.away_team_id)] || {}
  const stadium = stadiumMap[String(game?.stadium_id)] || {}

  const homeTeamName = game?.home_team_name_en || game?.home_team_label || 'TBD'
  const awayTeamName = game?.away_team_name_en || game?.away_team_label || 'TBD'
  const parsedDate = parseLocalDate(game?.local_date)

  return {
    id: game?.id,
    datetime: parsedDate || new Date(0).toISOString(),
    status: deriveStatus(game),
    venue: stadium?.name_en || '',
    location: [stadium?.city_en, stadium?.country_en].filter(Boolean).join(', '),
    winner: deriveWinner(game, homeTeamName, awayTeamName),
    home_team: {
      name: homeTeamName,
      country: homeTeam?.fifa_code || '',
      goals: toScore(game?.home_score),
    },
    away_team: {
      name: awayTeamName,
      country: awayTeam?.fifa_code || '',
      goals: toScore(game?.away_score),
    },
  }
}

function transformGamesResponse(games = [], teams = [], stadiums = []) {
  const teamMap = buildTeamMap(teams)
  const stadiumMap = buildStadiumMap(stadiums)

  return games
    .map((game) => transformGame(game, teamMap, stadiumMap))
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
}

module.exports = {
  parseLocalDate,
  buildTeamMap,
  buildStadiumMap,
  deriveStatus,
  deriveWinner,
  transformGame,
  transformGamesResponse,
}
