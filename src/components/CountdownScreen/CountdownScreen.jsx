import styled from 'styled-components/macro'
import Countdown from '../Countdown/Countdown'
import EndTime from '../EndTime/EndTime'
import { ReactComponent as PlayButton } from '../../assets/play-icon.svg'
import { ReactComponent as PauseButton } from '../../assets/pause-icon.svg'
import { ReactComponent as StopButton } from '../../assets/stop-icon.svg'
import { useEffect } from 'react'

export default function CountdownScreen({
  DURATIONTWENTYFIVE,
  DURATIONFIFTY,
  countdownMinutes,
  countdownSeconds,
  endHours,
  endMinutes,
  isActive,
  isPaused,
  timerExpired,
  durationLong,
  setCounter,
  setIsActive,
  setTimerExpired,
  handleStart,
  handleStop,
  handlePause,
}) {
  function timer() {
    if (timerExpired) {
      setIsActive(false)
      durationLong
        ? setCounter([
            parseInt(DURATIONFIFTY.minutes),
            parseInt(DURATIONFIFTY.seconds),
          ])
        : setCounter([
            parseInt(DURATIONTWENTYFIVE.minutes),
            parseInt(DURATIONTWENTYFIVE.seconds),
          ])
      setTimerExpired(false)
      return alert('Congratulations! Time is up.')
    }
    if (isPaused) return
    if (countdownMinutes === 0 && countdownSeconds === 0) setTimerExpired(true)
    else if (countdownSeconds === 0) {
      setCounter([countdownMinutes - 1, 59])
    } else {
      setCounter([countdownMinutes, countdownSeconds - 1])
    }
  }

  useEffect(() => {
    if (isActive) {
      const timeoutID = setTimeout(() => timer(), 1000)
      return () => clearTimeout(timeoutID)
    }
  })

  return (
    <CountdownScreenGrid>
      <CountdownGrid>
        <Countdown
          countdownMinutes={countdownMinutes}
          countdownSeconds={countdownSeconds}
        />
        {isActive && <EndTime endHours={endHours} endMinutes={endMinutes} />}
      </CountdownGrid>
      <ConfigurationGrid></ConfigurationGrid>
      <ExecutionGrid>
        <StopButton role="button" onClick={handleStop} />
        {!isActive ? (
          <PlayButton role="button" onClick={handleStart} />
        ) : (
          <PauseButton role="button" onClick={handlePause} />
        )}
      </ExecutionGrid>
    </CountdownScreenGrid>
  )
}

const CountdownScreenGrid = styled.main`
  display: grid;
  grid-template-rows: 1fr 1fr 100px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

const CountdownGrid = styled.section`
  display: grid;
  gap: 10px;
  grid-template-rows: 1fr 30px;
  align-items: end;
  justify-items: center;
  animation: slide-opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`

const ConfigurationGrid = styled.section`
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
  align-content: end;
  justify-content: center;
  animation: slide-opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  padding: 0 0 40px;
`

const ExecutionGrid = styled.section`
  display: grid;
  grid-template-columns: auto auto;
  gap: 40px;
  align-content: start;
  justify-content: center;
  padding: 10px;
  animation: slide-opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`
