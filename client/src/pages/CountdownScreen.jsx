import { useEffect } from 'react'
import styled from 'styled-components/macro'
import DisplayTimer from '../components/DisplayTimer/DisplayTimer'
import DisplayTimerEnd from '../components/DisplayTimerEnd/DisplayTimerEnd'
import PropTypes from 'prop-types'
import { timer } from '../lib/timer'

CountdownScreen.propTypes = {
  SHORT: PropTypes.object,
  LONG: PropTypes.object,
  appStatus: PropTypes.string,
  isDurationLong: PropTypes.bool,
  setAppStatus: PropTypes.func,
  updateData: PropTypes.func,
  navigateStart: PropTypes.func,
  timerMin: PropTypes.number,
  timerSec: PropTypes.number,
  setTimer: PropTypes.func,
  endHrs: PropTypes.number,
  endMin: PropTypes.number,
  setBrTimer: PropTypes.func,
}

export default function CountdownScreen({
  SHORT,
  LONG,
  appStatus,
  isDurationLong,
  setAppStatus,
  updateData,
  navigateStart,
  timerMin,
  timerSec,
  setTimer,
  endHrs,
  endMin,
  setBrTimer,
  startDate,
}) {
  useEffect(() => {
    if (appStatus === 'active') {
      const timeoutID = setTimeout(() => {
        if (isDurationLong) {
          const timerLength = LONG.lengthMS
          timer(startDate, timerLength, onTimerEnd, setTimer)
        } else {
          const timerLength = SHORT.lengthMS
          timer(startDate, timerLength, onTimerEnd, setTimer)
          console.log(startDate, timerMin, timerSec)
        }
      }, 1000)

      return () => clearTimeout(timeoutID)
    }
  })

  function onTimerEnd() {
    updateData()
    updateBrTimer(isDurationLong)
    navigateStart()
    setAppStatus('break')
    return alert('Congratulations! Time is up.')
  }

  return (
    <Grid>
      <TimerGrid>
        <DisplayTimer timerMin={timerMin} timerSec={timerSec} />
        {appStatus === 'active' && (
          <DisplayTimerEnd endHrs={endHrs} endMin={endMin} />
        )}
      </TimerGrid>
      <ConfigGrid name="activeConfig">
        {isDurationLong
          ? LONG.min.toString().padStart(2, '0') + ':00'
          : SHORT.min.toString().padStart(2, '0') + ':00'}
      </ConfigGrid>
      <ExecutionGrid>
        <StopButton role="button" onClick={handleStop} name="stopButton">
          Stop timer
        </StopButton>
      </ExecutionGrid>
    </Grid>
  )

  function handleStop() {
    setAppStatus('default')
    updateData()
    navigateStart()
  }

  // function timer() {
  //   if (timerMin === 0 && timerSec === 0) {
  //     updateData()
  //     updateBrTimer(isDurationLong)
  //     navigateStart()
  //     setAppStatus('break')
  //     return alert('Congratulations! Time is up.')
  //   } else if (timerSec === 0) {
  //     setTimer([timerMin - 1, 59])
  //   } else {
  //     setTimer([timerMin, timerSec - 1])
  //   }
  // }

  function updateBrTimer(isDurationLong) {
    isDurationLong ? setBrTimer([LONG.brMin, 0]) : setBrTimer([SHORT.brMin, 0])
  }
}

const Grid = styled.main`
  display: grid;
  grid-template-rows: 1fr 1fr auto;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 10.5vh 13vw 9vh;
`

const TimerGrid = styled.section`
  display: grid;
  gap: 10px;
  grid-template-rows: 1fr 30px;
  align-items: end;
  justify-items: center;
  padding: 0 0 20px;
  animation: slide-opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`

const ConfigGrid = styled.section`
  display: grid;
  color: #52dfd1;
  align-content: end;
  justify-content: center;
  padding: 0 0 40px;
  font-size: 20px;
  animation: slide-opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`

const ExecutionGrid = styled.section`
  display: grid;
  align-content: start;
  justify-content: center;
  animation: slide-opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  justify-content: stretch;
`

const StopButton = styled.button`
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
