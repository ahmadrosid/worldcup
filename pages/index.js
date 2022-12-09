import useSWR from 'swr'
import Head from 'next/head'
import dayjs from 'dayjs';
import { useCountdown } from '../hooks/useCountdown';
import { useState } from 'react';

var relativeTime = require('dayjs/plugin/relativeTime')
var isToday = require('dayjs/plugin/isToday')
var isTomorrow = require('dayjs/plugin/isTomorrow')

dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const CountdownTimer = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  return (
    <p className='text-sm sm:text-3xl opacity-75'>{minutes}:{seconds}</p>
  );
};


export default function Home() {
  const [sliceComplete, setSliceComplete] = useState(4);
  const imgUrlPrefix = "https://api.fifa.com/api/v3/picture/flags-sq-3/"

  const { data, error } = useSWR('https://worldcupjson.net/matches/?by_date=ASC', fetcher)
  const completedMatch = data?.filter(item => item.status == "completed");
  const nextMatch = data?.filter(item => item.status == "future_scheduled");
  let lastMatch = completedMatch?.at(-1);
  const in_progress_match = data?.filter(item => item.status == "in_progress");
  const hasLiveMatch = in_progress_match?.length >= 1;
  if (hasLiveMatch) lastMatch = in_progress_match[0];

  if (error) return <div className='w-full min-h-screen h-full bg-black flex items-center justify-center text-white'>Failed to load</div>
  if (!data) return <div className='w-full min-h-screen h-full bg-black flex items-center justify-center text-white'>Loading...</div>

  return (
    <>
      <Head>
        <script defer data-domain="worldcup-update.vercel.app" src="https://plausible.io/js/script.js"></script>
      </Head>
      <div option={5} className="bg-black min-h-screen h-full p-8 sm:p-16">
        <div>
          <div className='text-center my-4'>
            <h1 className='text-5xl xs:text-6xl font-bold text-gray-100'>FIFA World Cup</h1>
            <p className='py-2 font-light text-lg'>Stay updated with FIFA world cup QATAR 2022</p>
            <p>made by <a className='text-amber-500' href="https://ahmadrosid.com">@ahmadrosid</a></p>
          </div>
          <div className='max-w-[650px] mx-auto my-8'>
            <div className='border border-dashed border-gray-500 bg-[#85858536] p-4 sm:p-6 rounded-lg shadow-sm'>
              <div className="relative w-full flex gap-2">
                <h2 className='opacity-75 text-xl w-full'>{hasLiveMatch ? <span className='text-emerald-400'>Live match</span> : "Last Match - " + dayjs(lastMatch.datetime).fromNow()}</h2>
                {hasLiveMatch && <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-block rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>}
              </div>
              <div className='flex gap-4 pt-4 items-center justify-between'>
                <div className='space-y-2'>
                  <img alt={lastMatch.home_team.name} src={imgUrlPrefix + lastMatch.home_team.country} className="rounded-md border" />
                  <h3 className='text-center text-slate-200 opacity-75'>{lastMatch.home_team.name}</h3>
                </div>
                <div className='text-center'>
                  <h2 className='text-xl sm:text-7xl font-bold text-slate-200 opacity-75'>
                    {lastMatch.home_team.goals} : {lastMatch.away_team.goals}
                  </h2>
                  {hasLiveMatch ? <CountdownTimer targetDate={dayjs(lastMatch.datetime)} /> : (
                    <p className='text-slate-200 opacity-75 font-light'>
                      {dayjs(lastMatch.datetime).format("h:m A")}
                    </p>
                  )}
                </div>
                <div className='space-y-2 '>
                  <img alt={lastMatch.away_team.name} src={imgUrlPrefix + lastMatch.away_team.country} className="rounded-md border" />
                  <h3 className='text-center font-base text-slate-200  opacity-75'>{lastMatch.away_team.name}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className='my-8 max-w-[650px] mx-auto'>
            <h2 className='text-4xl tracking-wide'>Next match</h2>
            <div className='py-4'>
              <ul className='space-y-2'>
                {nextMatch?.slice(0, 3).map(item =>
                  <li className='flex gap-2' key={item.id}>
                    <div className='py-[4px]'>
                      <span className="block w-[9px] h-[9px] rounded-full bg-amber-400 opacity-75"></span>
                      <div className='h-full py-[8px] px-[4px]'>
                        <span className='block w-[2px] bg-gray-200 h-full opacity-60'></span>
                      </div>
                    </div>
                    <div className='w-full'>
                      <p className='text-amber-500 text-sm w-full flex justify-between'>
                        {dayjs(item.datetime).isToday() && <span>Today</span>}
                        {dayjs(item.datetime).isTomorrow() && <span>Tomorrow</span>}
                        <span className='text-amber-50 opacity-75'>{dayjs(item.datetime).format("MMM DD")}</span>
                      </p>
                      <div className='pb-2 pt-2'>
                        <div className='flex justify-between items-center w-full'>
                          <h3 className='space-x-2 text-lg py-0 font-medium tracking-wide opacity-80'>
                            <span>{item.home_team.name} vs {item.away_team.name}</span>
                          </h3>
                          <p className='text-gray-200 font-light opacity-60 text-sm'>
                            {dayjs(item.datetime).format("h:m A")}
                          </p>
                        </div>
                        <p className='text-sm opacity-80'>Venue : <span className='text-sky-400'>{item.venue}, {item.location}</span></p>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className='my-8 max-w-[650px] mx-auto'>
            <h2 className='text-4xl tracking-wide'>Completed match</h2>
            <div className='py-4'>
              <ul className='space-y-3 transition-all'>
                {completedMatch?.reverse().map(item =>
                  <li className='flex gap-2' key={item.id}>
                    <div className='pt-[4px]'>
                      <span className="block w-[9px] h-[9px] rounded-full bg-amber-400 opacity-75"></span>
                      <div className='h-full py-[8px] px-[4px]'>
                        <span className='block w-[2px] bg-amber-50 h-full opacity-60'></span>
                      </div>
                    </div>
                    <div className='w-full'>
                      <p className='text-amber-500 text-sm w-full flex justify-between'>
                        <span>{dayjs(item.datetime).fromNow()}</span>
                        <span className='text-amber-50 opacity-75'>{dayjs(item.datetime).format("MMM DD")}</span>
                      </p>
                      <div className='flex justify-between items-center w-full'>
                        <h3 className='space-x-2 text-lg pt-1 font-medium tracking-wide opacity-80'>
                          <span>{item.home_team.name} vs {item.away_team.name}</span>
                          <span>-</span>
                          <span>{item.home_team.goals} : {item.away_team.goals}</span>
                        </h3>
                        <p className='text-gray-200 font-light opacity-60 text-sm'>
                          {dayjs(item.datetime).format("h:m A")}
                        </p>
                      </div>
                      <p className='text-sm opacity-75'>
                        <span>Result: </span>
                        <span className='text-emerald-400'>{item.winner === "Draw" ? item.winner : item.winner + " Wins"}</span>
                      </p>
                    </div>
                  </li>
                ).slice(0, sliceComplete)}
              </ul>
              {sliceComplete === 4 && <div className='py-3 w-full flex justify-center'>
                <button onClick={() => setSliceComplete(-1)} className='text-xs rounded-full border border-gray-400 px-8 py-2 cursor-pointer bg-[#85858536]'>Show more</button>
              </div>}
              {sliceComplete !== 4 && <div className='py-3 w-full flex justify-center'>
                <button onClick={() => setSliceComplete(4)} className='text-xs rounded-full border border-gray-400 px-8 py-2 cursor-pointer bg-[#85858536]'>Show less</button>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
