import { useDispatch, useSelector } from 'react-redux'
import { downloadStatisticsExcelThunk } from '../../../features/admins/statisticsSlice'

const OwnerStatistics = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.statistics)

  const downloadExcel = () => {
    dispatch(downloadStatisticsExcelThunk())
  }

  return (
    <div>
      <h1>📊 Export Statistics</h1>

      <button
        onClick={downloadExcel}
        disabled={loading}
        style={{
          background: '#007bff',
          color: 'white',
          padding: '10px 18px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        {loading ? 'Формируется...' : 'Скачать Excel'}
      </button>
    </div>
  )
}

export default OwnerStatistics
