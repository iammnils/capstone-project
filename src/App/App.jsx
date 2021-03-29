import CountdownScreen from '../pages/CountdownScreen'
import StartScreen from '../pages/StartScreen'
import HistoryScreen from '../pages/HistoryScreen'
import { addMinToDate } from '../services/math'
import { useState, useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

function App() {
  const { push } = useHistory()
  const SHORT = {
    min: 25,
    brMin: 5,
  }
  const LONG = {
    min: 50,
    brMin: 10,
  }

  const [appStatus, setAppStatus] = useState('')
  const [isDurationLong, setIsDurationLong] = useState(false)
  const [[endHrs, endMin], setEndTime] = useState([])
  const [[timerMin, timerSec], setTimer] = useState([SHORT.min, 0])
  const [[brTimerMin, brTimerSec], setBrTimer] = useState([SHORT.brMin, 0])
  const [bars, setBars] = useState([
    { height: 10, day: 'Mo' },
    { height: 100, day: 'Tu' },
    { height: 30, day: 'We' },
    { height: 30, day: 'Th' },
    { height: 100, day: 'Tu' },
    { height: 30, day: 'We' },
    { height: 30, day: 'Th' },
    { height: 100, day: 'Tu' },
    { height: 30, day: 'We' },
    { height: 30, day: 'Th' },
  ])

  useEffect(() => {
    if (appStatus === 'active') {
      const timeoutID = setTimeout(() => timer(), 1000)
      return () => clearTimeout(timeoutID)
    }
    if (appStatus === 'break') {
      const breakTimeoutID = setTimeout(() => breakTimer(), 1000)
      return () => clearTimeout(breakTimeoutID)
    }
  })

  return (
    <>
      <Switch>
        {appStatus === 'active' && (
          <Route path="/countdown">
            <CountdownScreen
              SHORT={SHORT}
              LONG={LONG}
              timerMin={timerMin}
              timerSec={timerSec}
              endHrs={endHrs}
              endMin={endMin}
              appStatus={appStatus}
              isDurationLong={isDurationLong}
              handleStart={handleStart}
              handleStop={handleStop}
            />
          </Route>
        )}
        <Route path="/history">
          <HistoryScreen bars={bars} />
        </Route>
        <Route path="/*">
          <StartScreen
            SHORT={SHORT}
            LONG={LONG}
            brTimerMin={brTimerMin}
            brTimerSec={brTimerSec}
            isDurationLong={isDurationLong}
            appStatus={appStatus}
            setAppStatus={setAppStatus}
            handleHistory={handleHistory}
            handleStart={handleStart}
            handleShort={handleShort}
            handleLong={handleLong}
          />
        </Route>
      </Switch>
    </>
  )

  function handleHistory() {
    push('/history')
  }

  function timer() {
    if (timerMin === 0 && timerSec === 0) {
      isDurationLong
        ? setBrTimer([LONG.brMin, 0])
        : setBrTimer([SHORT.brMin, 0])
      push('/')
      setAppStatus('break')
      return alert('Congratulations! Time is up.')
    } else if (timerSec === 0) {
      setTimer([timerMin - 1, 59])
    } else {
      setTimer([timerMin, timerSec - 1])
    }
  }

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

  function handleShort() {
    setIsDurationLong(false)
    setTimer([SHORT.min, 0])
  }

  function handleLong() {
    setIsDurationLong(true)
    setTimer([LONG.min, 0])
  }

  function handleStop() {
    isDurationLong ? setTimer([LONG.min, 0]) : setTimer([SHORT.min, 0])
    setAppStatus('default')
    push('/')
  }

  function handleStart() {
    const now = new Date()
    const nowMS = now.getTime()
    const endTimeShort = addMinToDate(nowMS, SHORT.min)
    const endTimeLong = addMinToDate(nowMS, LONG.min)

    if (isDurationLong) {
      setTimer([LONG.min, 0])
      now.setTime(endTimeLong)
    } else {
      now.setTime(endTimeShort)
      setTimer([SHORT.min, 0])
    }

    setEndTime([now.getHours(), now.getMinutes()])
    setAppStatus('active')
    push('/countdown')
  }
}

export default App
