import ReportChartCard from './ReportChartCard';

export default function GroupedBarChartCard({ chart }) {
  return <ReportChartCard chart={{ ...chart, type: 'bar' }} />;
}
