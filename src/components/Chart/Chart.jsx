import styled from 'styled-components/macro'
import { v4 as uuidv4 } from 'uuid'

export default function Chart({ chartData, todayValue, timeFrame }) {
  return (
    <Container>
      <InfoBox>
        <TodayBox>
          <TodayValue>{todayValue}</TodayValue>
          <TodayLabel>Today</TodayLabel>
        </TodayBox>
        <LastTenDays>{timeFrame}</LastTenDays>
      </InfoBox>
      <Graph>
        <Bars>
          {chartData.map(data => (
            <Bar key={uuidv4()} style={{ height: `${data.height}%` }} />
          ))}
        </Bars>
        <XAxis>
          {chartData.map(data => (
            <AxisEl key={uuidv4()}>{data.weekday}</AxisEl>
          ))}
        </XAxis>
      </Graph>
    </Container>
  )
}

const Container = styled.section`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 20px;
`

const InfoBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  padding: 0 0 20px;
`

const TodayBox = styled.div`
  display: grid;
`

const TodayValue = styled.div`
  display: grid;
  justify-content: start;
  font-weight: 600;
  font-size: 16px;
  color: #585858;
`

const TodayLabel = styled.div`
  display: grid;
  justify-content: start;
  font-weight: 400;
  font-size: 12px;
  color: #a3a3a3;
`

const LastTenDays = styled.div`
  display: grid;
  justify-content: end;
  font-weight: 600;
  font-size: 12px;
  color: #a3a3a3;
`

const Graph = styled.div`
  display: grid;
  grid-template-rows: 120px min-content;
  height: 150px;
  justify-content: center;
`

const Bars = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 10px;
  align-items: end;
  gap: 15px;
  padding: 0 0 3px;
`

const Bar = styled.div`
  background: linear-gradient(125deg, #a4e3cc, #56dfd1);
  border-radius: 5px;
`

const XAxis = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 10px;
  align-items: end;
  gap: 15px;
`

const AxisEl = styled.div`
  color: #585858;
  font-size: 10px;
  font-weight: 600;
`