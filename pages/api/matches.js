const WORLDCUP_API = process.env.WORLDCUP26_API_URL || 'https://worldcup26.ir'
const { transformGamesResponse } = require('../../lib/worldcup26')

export default async function handler(req, res) {
  try {
    const [gamesResponse, teamsResponse, stadiumsResponse] = await Promise.all([
      fetch(`${WORLDCUP_API}/get/games`),
      fetch(`${WORLDCUP_API}/get/teams`),
      fetch(`${WORLDCUP_API}/get/stadiums`),
    ])

    if (!gamesResponse.ok || !teamsResponse.ok || !stadiumsResponse.ok) {
      res.status(502).json({ error: 'Failed to fetch worldcup26 resources' })
      return
    }

    const [gamesData, teamsData, stadiumsData] = await Promise.all([
      gamesResponse.json(),
      teamsResponse.json(),
      stadiumsResponse.json(),
    ])

    const transformedMatches = transformGamesResponse(
      gamesData?.games || [],
      teamsData?.teams || [],
      stadiumsData?.stadiums || []
    )

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    res.status(200).json(transformedMatches)
  } catch {
    res.status(500).json({ error: 'Failed to fetch matches' })
  }
}
