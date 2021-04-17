import CountdownScreen from '../pages/CountdownScreen'
import StartScreen from '../pages/StartScreen'
import HistoryScreen from '../pages/HistoryScreen'
import useLocalStorage from '../hooks/useLocalStorage'
import getHistory from '../services/getHistory'
import postHistory from '../services/postHistory'
import postUser from '../services/postUser'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Route, Switch, useHistory } from 'react-router-dom'
import { getMaxValue } from '../lib/dataExtraction'
import { toShortDate, getWeekDay } from '../lib/date'
import { relativeShare } from '../lib/math'

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

  const [error, setError] = useState(null)
  const [localUser, setLocalUser] = useLocalStorage('localUser')
  const [history, setHistory] = useState([])

  const [appStatus, setAppStatus] = useState('')
  const [[timerMin, timerSec], setTimer] = useState([])
  const [[brTimerMin, brTimerSec], setBrTimer] = useState([])
  const [[endHrs, endMin], setEndTime] = useState([])
  const [startDate, setStartDate] = useState(0)
  const [isDurationLong, setIsDurationLong] = useState(false)
  const [historyData, setHistoryData] = useLocalStorage('historyData', [])
  const [chartData, setChartData] = useState(
    calcHeight(createChartData(historyData))
  )

  useEffect(() => {
    if (!localUser) {
      const newUser = uuidv4()
      postUser(newUser).then(setLocalUser).catch(setError)
    } else {
      const userObjectId = localUser._id
      getHistory(userObjectId).then(data => setHistory([...data]))
    }
  }, [localUser, setLocalUser])

  return (
    error || (
      <Switch>
        {appStatus === 'active' && (
          <Route path="/countdown">
            <CountdownScreen
              SHORT={SHORT}
              LONG={LONG}
              appStatus={appStatus}
              setAppStatus={setAppStatus}
              isDurationLong={isDurationLong}
              timerMin={timerMin}
              timerSec={timerSec}
              setTimer={setTimer}
              endHrs={endHrs}
              endMin={endMin}
              startDate={startDate}
              updateData={updateData}
              navigateStart={navigateStart}
              setBrTimer={setBrTimer}
            />
          </Route>
        )}
        <Route path="/history">
          <HistoryScreen
            historyData={historyData}
            chartData={chartData}
            navigateStart={navigateStart}
          />
        </Route>
        <Route path="/*">
          <StartScreen
            SHORT={SHORT}
            LONG={LONG}
            appStatus={appStatus}
            setAppStatus={setAppStatus}
            isDurationLong={isDurationLong}
            setIsDurationLong={setIsDurationLong}
            setTimer={setTimer}
            setEndTime={setEndTime}
            setStartDate={setStartDate}
            updateData={updateData}
            navigateCountdown={navigateCountdown}
            navigateHistory={navigateHistory}
            brTimerMin={brTimerMin}
            brTimerSec={brTimerSec}
            setBrTimer={setBrTimer}
          />
        </Route>
      </Switch>
    )
  )

  function navigateStart() {
    push('/')

    const newHistory = {
      start: new Date(),
      end: new Date(),
      duration: 2000,
      user: localUser._id,
    }
    setHistory([...history, newHistory])
    postHistory(newHistory)
    console.log(history)
  }

  function navigateCountdown() {
    push('/countdown')
  }

  function navigateHistory() {
    push('/history')
  }

  function calcHeight(chartData) {
    let array = []
    chartData.forEach(element => array.push(element.duration))
    const maxValue = getMaxValue(array)

    chartData.forEach(
      el => (el.height = relativeShare(el.duration, 0, maxValue))
    )
    return chartData
  }

  function createChartData(historyData) {
    const goBackDays = 10
    const setupArray = []

    for (let i = 0; i < goBackDays; i++) {
      let today = new Date()
      let date = new Date(today.setDate(today.getDate() - 1 * i))
      let formattedDate = toShortDate(date)

      setupArray.push({
        date: formattedDate,
        duration: 0,
        weekday: getWeekDay(date),
        height: 0,
      })
    }

    const chartData = setupArray.reverse()
    chartData.map(targetEntry => {
      historyData.map(rawEntry => {
        if (toShortDate(new Date(rawEntry.start)) === targetEntry.date) {
          targetEntry.duration = targetEntry.duration + rawEntry.duration
        }
        return chartData
      })
      return chartData
    })
    return chartData
  }

  function updateData() {
    const updatedHistoryData = [
      {
        id: uuidv4(),
        start: startDate,
        end: new Date(),
        duration: new Date().getTime() - startDate.getTime(),
      },
      ...historyData,
    ]
    const updateChartData = calcHeight(createChartData(updatedHistoryData))
    setHistoryData(updatedHistoryData)
    setChartData(updateChartData)
  }
}

export default App
