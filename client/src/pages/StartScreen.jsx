import styled from 'styled-components/macro'
import Header from '../components/Header/Header'
import { ReactComponent as GetThingsDoneSVG } from '../assets/get-things-done.svg'
import { ReactComponent as BreakSVG } from '../assets/break.svg'
import { useEffect } from 'react'
import { addMinToMs } from '../lib/time'
import PropTypes from 'prop-types'

export default function StartScreen({
  SHORT,
  LONG,
  isDurationLong,
  setIsDurationLong,
  appStatus,
  setAppStatus,
  navigateHistory,
  navigateCountdown,
  setStartDate,
  setEndTime,
  setTimer,
  brTimerMin,
  brTimerSec,
  setBrTimer,
}) {
  useEffect(() => {
    if (appStatus === 'break') {
      const breakTimeoutID = setTimeout(() => breakTimer(), 1000)
      return () => clearTimeout(breakTimeoutID)
    }
  })
  return (
    <Grid>
      <HeaderGrid>
        {appStatus === 'break' ? (
          <Header text="Time for a break" />
        ) : (
          <Header text="Let’s get things done" />
        )}
      </HeaderGrid>
      <SVGGrid>
        {appStatus === 'break' ? <BreakSVG /> : <GetThingsDoneSVG />}
      </SVGGrid>
      <ConfigGrid>
        <Duration onClick={handleShort} selected={!isDurationLong}>
          {SHORT.min + ':00'}
        </Duration>
        <Duration onClick={handleLong} selected={isDurationLong}>
          {LONG.min + ':00'}
        </Duration>
      </ConfigGrid>
      <StartGrid>
        {appStatus === 'break' ? (
          <BreakButton onClick={handleBreakAlert}>
            {brTimerMin.toString().padStart(2, '0')}:
            {brTimerSec.toString().padStart(2, '0')}
          </BreakButton>
        ) : (
          <StartButton onClick={handleStart}>Start timer</StartButton>
        )}
      </StartGrid>
      <HistoryGrid>
        <HistoryButton onClick={navigateHistory}>
          Take a look at your history
        </HistoryButton>
      </HistoryGrid>
    </Grid>
  )

  function breakTimer() {
    if (brTimerMin === 0 && brTimerSec === 0) {
      setAppStatus('default')
      return
    } else if (brTimerSec === 0) {
      setBrTimer([brTimerMin - 1, 59])
    } else {
      setBrTimer([brTimerMin, brTimerSec - 1])
    }
  }

  function handleStart() {
    const now = new Date()
    setStartDate(new Date())
    const nowMS = now.getTime()
    const endTimeShort = addMinToMs(nowMS, SHORT.min)
    const endTimeLong = addMinToMs(nowMS, LONG.min)

    if (isDurationLong) {
      setTimer([LONG.min, 0])
      now.setTime(endTimeLong)
    } else {
      now.setTime(endTimeShort)
      setTimer([SHORT.min, 0])
    }

    setEndTime([now.getHours(), now.getMinutes()])
    setAppStatus('active')
    navigateCountdown()
  }

  function handleShort() {
    setIsDurationLong(false)
  }

  function handleLong() {
    setIsDurationLong(true)
  }

  function handleBreakAlert() {
    if (
      window.confirm(
        'Your break is not finished yet. Are you sure to continue?'
      )
    ) {
      setAppStatus('default')
    }
  }
}

StartScreen.propTypes = {
  SHORT: PropTypes.object,
  LONG: PropTypes.object,
  appStatus: PropTypes.string,
  isDurationLong: PropTypes.bool,
  setIsDurationLong: PropTypes.func,
  setAppStatus: PropTypes.func,
  navigateHistory: PropTypes.func,
  navigateCountdown: PropTypes.func,
  setStartDate: PropTypes.func,
  setEndTime: PropTypes.func,
  setTimer: PropTypes.func,
  brTimerMin: PropTypes.number,
  brTimerSec: PropTypes.number,
  setBrTimer: PropTypes.func,
}

const Grid = styled.main`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr auto auto;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 10.5vh 13vw 4.5vh;
`

const HeaderGrid = styled.section`
  display: grid;
  align-items: start;
  animation: slide-opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`

const SVGGrid = styled.section`
  display: grid;
  align-content: start;
  justify-content: center;
  animation: slide-opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`

const ConfigGrid = styled.section`
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
  align-content: end;
  justify-content: center;
  animation: slide-opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  padding: 0 0 40px;
`

const StartGrid = styled.section`
  animation: slide-opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  display: grid;
  align-content: end;
  justify-content: stretch;
`

const HistoryGrid = styled.section`
  animation: slide-opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  display: grid;
  align-content: end;
  justify-content: center;
  padding: 10px 0 10px;
`

const Duration = styled.button`
  color: ${props => (props.selected ? '#52DFD1' : '#585858')};
  border: none;
  background-color: transparent;
  font-size: 20px;
  width: fit-content;
  height: fit-content;
  transition: 0.2s;
`

const StartButton = styled.button`
  font-size: 18px;
  color: white;
  background: linear-gradient(125deg, #a4e3cc, #56dfd1);
  height: 50px;
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 0;
  animation: slide-opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`

const BreakButton = styled.button`
  font-size: 18px;
  color: white;
  background: gray;
  height: 50px;
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 0;
  animation: slide-opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`

const HistoryButton = styled.button`
  font-size: 12px;
  color: #585858;
  background: white;
  border: none;
  border-bottom: 1px solid #a4e3cc;
  height: 30px;
  padding: 5px;
  animation: slide-opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`