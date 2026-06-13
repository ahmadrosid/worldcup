import useSWR from 'swr'
import Script from 'next/script'
import dayjs from 'dayjs';
import { useCountdown } from '../hooks/useCountdown';
import { useState } from 'react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import TeamFlag from '../components/TeamFlag';

var relativeTime = require('dayjs/plugin/relativeTime')
var isToday = require('dayjs/plugin/isToday')
var isTomorrow = require('dayjs/plugin/isTomorrow')

dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function getMatchDateLabel(datetime) {
  const date = dayjs(datetime)
  if (date.isToday()) return 'Today'
  if (date.isTomorrow()) return 'Tomorrow'
  return date.format('ddd, MMM D')
}

function getTeamResultClass(teamName, winner) {
  if (winner === 'Draw') return 'opacity-80'
  if (teamName === winner) return 'font-semibold text-emerald-600 dark:text-emerald-400'
  return 'opacity-50'
}

const CountdownTimer = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  return (
    <p className='text-sm sm:text-3xl opacity-75'>{minutes}:{seconds}</p>
  );
};

export default function Home() {
  const [sliceComplete, setSliceComplete] = useState(4);
  const [sliceNextMatch, setSliceNextMatch] = useState(3);

  const { data, error } = useSWR('/api/matches', fetcher)
  const completedMatch = data?.filter(item => item.status == "completed");
  const nextMatch = data?.filter(item => item.status == "future_scheduled");
  let lastMatch = completedMatch?.at(-1);
  const in_progress_match = data?.filter(item => item.status == "in_progress");
  const hasLiveMatch = in_progress_match?.length >= 1;
  if (hasLiveMatch) lastMatch = in_progress_match[0];

  if (error) return <div className='w-full min-h-screen h-full bg-gray-50 dark:bg-black flex items-center justify-center text-gray-900 dark:text-white'>Failed to load</div>
  if (!data) return <LoadingSkeleton />

  return (
    <>
      <Script
        defer
        data-domain="worldcup-update.vercel.app"
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
      <div option={5} className="bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100 min-h-screen h-full px-4 py-8 sm:p-16">
        <div>
          <div className='text-center my-4'>
            <h1 className='text-5xl xs:text-6xl font-bold text-gray-900 dark:text-gray-100'>FIFA World Cup</h1>
            <p className='py-2 font-light text-lg text-gray-700 dark:text-gray-300'>Stay updated with FIFA World Cup USA, Mexico &amp; Canada 2026</p>
            <p className='text-gray-600 dark:text-gray-400'>made by <a className='text-amber-600 dark:text-amber-500' href="https://ahmadrosid.com">@ahmadrosid</a></p>
          </div>
          <div className='max-w-[650px] mx-auto my-8'>
            <div className='border border-dashed border-gray-300 dark:border-gray-500 bg-gray-100/80 dark:bg-[#85858536] p-4 sm:p-6 rounded-lg shadow-sm'>
              <div className="relative w-full flex gap-2">
                <h2 className='opacity-75 text-sm sm:text-base w-full'>{hasLiveMatch ? <span className='text-emerald-400'>Live match</span> : "Last match - " + dayjs(lastMatch.datetime).fromNow()}</h2>
                {hasLiveMatch && <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-block rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>}
              </div>
              <div className='flex gap-4 pt-4 items-center justify-between'>
                <div className='space-y-2'>
                  <TeamFlag name={lastMatch.home_team.name} country={lastMatch.home_team.country} className="h-12 w-16 sm:h-16 sm:w-20" />
                  <h3 className='text-center text-gray-700 dark:text-slate-200 opacity-75'>{lastMatch.home_team.name}</h3>
                </div>
                <div className='text-center'>
                  <h2 className='text-xl sm:text-7xl font-bold text-gray-800 dark:text-slate-200 opacity-75'>
                    {lastMatch.home_team.goals} : {lastMatch.away_team.goals}
                  </h2>
                  {hasLiveMatch ? <CountdownTimer targetDate={dayjs(lastMatch.datetime)} /> : (
                    <p className='text-gray-700 dark:text-slate-200 opacity-75 font-light'>
                      {dayjs(lastMatch.datetime).format("h:m A")}
                    </p>
                  )}
                </div>
                <div className='space-y-2 '>
                  <TeamFlag name={lastMatch.away_team.name} country={lastMatch.away_team.country} className="h-12 w-16 sm:h-16 sm:w-20" />
                  <h3 className='text-center font-base text-gray-700 dark:text-slate-200 opacity-75'>{lastMatch.away_team.name}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className='my-8 max-w-[650px] mx-auto'>
            <h2 className='text-4xl tracking-wide'>Next match</h2>
            <div className='py-4'>
              {nextMatch?.length > 0 ? (
              <>
              <ul className='space-y-3'>
                {nextMatch?.slice(0, sliceNextMatch).map(item =>
                  <li
                    key={item.id}
                    className='rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100/60 dark:bg-[#85858520] p-4'
                  >
                    <p className='text-center text-sm text-amber-700 dark:text-amber-400'>
                      {getMatchDateLabel(item.datetime)} · {dayjs(item.datetime).format('h:mm A')}
                    </p>
                    <p className='mt-1 text-center text-xs text-gray-500 dark:text-gray-400'>
                      {item.venue}, {item.location}
                    </p>
                    <div className='flex items-center justify-between gap-2 sm:gap-4 mt-4'>
                      <div className='flex flex-col items-center gap-2 flex-1 min-w-0'>
                        <TeamFlag
                          name={item.home_team.name}
                          country={item.home_team.country}
                          className="h-10 w-14 sm:h-12 sm:w-16"
                        />
                        <span className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 text-center leading-tight'>
                          {item.home_team.name}
                        </span>
                      </div>
                      <span className='text-xs font-medium text-gray-400 dark:text-gray-500 shrink-0'>vs</span>
                      <div className='flex flex-col items-center gap-2 flex-1 min-w-0'>
                        <TeamFlag
                          name={item.away_team.name}
                          country={item.away_team.country}
                          className="h-10 w-14 sm:h-12 sm:w-16"
                        />
                        <span className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 text-center leading-tight'>
                          {item.away_team.name}
                        </span>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
              {sliceNextMatch === 3 && <div className='py-3 w-full flex justify-center'>
                <button onClick={() => setSliceNextMatch(nextMatch?.length + 1)} className='text-xs rounded-full border border-gray-300 dark:border-gray-400 px-8 py-2 cursor-pointer bg-gray-100 dark:bg-[#85858536] text-gray-800 dark:text-gray-100'>Show more</button>
              </div>}
              {sliceNextMatch !== 3 && <div className='py-3 w-full flex justify-center'>
                <button onClick={() => setSliceNextMatch(3)} className='text-xs rounded-full border border-gray-300 dark:border-gray-400 px-8 py-2 cursor-pointer bg-gray-100 dark:bg-[#85858536] text-gray-800 dark:text-gray-100'>Show less</button>
              </div>}
              </>
              ) : (
                <p className='text-gray-500 dark:text-gray-400 opacity-75'>No upcoming matches scheduled.</p>
              )}
            </div>
          </div>
          <div className='my-8 max-w-[650px] mx-auto'>
            <h2 className='text-4xl tracking-wide'>Completed match</h2>
            <div className='py-4'>
              <ul className='space-y-3 transition-all'>
                {[...(completedMatch || [])].reverse().map(item =>
                  <li className='flex gap-2' key={item.id}>
                    <div className='pt-[4px]'>
                      <span className="block w-[9px] h-[9px] rounded-full bg-amber-600 dark:bg-amber-400 opacity-75"></span>
                      <div className='h-full py-[8px] px-[4px]'>
                        <span className='block w-[2px] bg-amber-600 dark:bg-amber-50 h-full opacity-60'></span>
                      </div>
                    </div>
                    <div className='w-full'>
                      <p className='text-amber-700 dark:text-amber-500 text-sm w-full flex justify-between'>
                        <span>{dayjs(item.datetime).fromNow()}</span>
                        <span className='text-amber-700 dark:text-amber-50 opacity-75'>{dayjs(item.datetime).format("MMM DD")}</span>
                      </p>
                      <div className='flex justify-between items-center w-full'>
                        <h3 className='space-x-2 text-lg pt-1 font-medium tracking-wide'>
                          <span className={getTeamResultClass(item.home_team.name, item.winner)}>
                            {item.home_team.name}
                          </span>
                          <span className='opacity-50'>vs</span>
                          <span className={getTeamResultClass(item.away_team.name, item.winner)}>
                            {item.away_team.name}
                          </span>
                          <span className='opacity-50'>-</span>
                          <span>
                            <span className={getTeamResultClass(item.home_team.name, item.winner)}>
                              {item.home_team.goals}
                            </span>
                            <span className='opacity-50'> : </span>
                            <span className={getTeamResultClass(item.away_team.name, item.winner)}>
                              {item.away_team.goals}
                            </span>
                          </span>
                        </h3>
                        <p className='text-gray-600 dark:text-gray-200 font-light opacity-60 text-sm'>
                          {dayjs(item.datetime).format("h:m A")}
                        </p>
                      </div>
                      <p className='text-sm opacity-75'>
                        <span>Result: </span>
                        <span className='text-emerald-600 dark:text-emerald-400'>{item.winner === "Draw" ? item.winner : item.winner + " Wins"}</span>
                      </p>
                    </div>
                  </li>
                ).slice(0, sliceComplete)}
              </ul>
              {sliceComplete === 4 && <div className='py-3 w-full flex justify-center'>
                <button onClick={() => setSliceComplete(-1)} className='text-xs rounded-full border border-gray-300 dark:border-gray-400 px-8 py-2 cursor-pointer bg-gray-100 dark:bg-[#85858536] text-gray-800 dark:text-gray-100'>Show more</button>
              </div>}
              {sliceComplete !== 4 && <div className='py-3 w-full flex justify-center'>
                <button onClick={() => setSliceComplete(4)} className='text-xs rounded-full border border-gray-300 dark:border-gray-400 px-8 py-2 cursor-pointer bg-gray-100 dark:bg-[#85858536] text-gray-800 dark:text-gray-100'>Show less</button>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
