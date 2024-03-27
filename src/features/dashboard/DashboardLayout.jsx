import styled from 'styled-components'
import { useRecentBookings } from './useRecentBookings'
import Spinner from '../../ui/Spinner'
import { useRecentStays } from './useRecentStays'
import Stats from './Stats'
import { useCabins } from '../cabins/useCabins'
import SalesChart from './SalesChart'

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`

function DashboardLayout() {
  const { isLoading: isLoadingBookings, bookings } = useRecentBookings()
  const { isLoadingStays, stays, confirmedStays, numDays } = useRecentStays()
  const { cabins, isLoading: isLoading3 } = useCabins()

  if (isLoadingBookings || isLoadingStays || isLoading3) return <Spinner />
  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStatys={confirmedStays}
        numDays={numDays}
        cabinCount={cabins?.length}
      />
      <div>Today's activity</div>
      <div>Chart stay durations</div>
      <SalesChart bookings={bookings} numDays={numDays} />
    </StyledDashboardLayout>
  )
}

export default DashboardLayout
