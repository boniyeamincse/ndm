import ReportChartCard from './ReportChartCard';

export default function TrendLineChartCard({ chart }) {
  return <ReportChartCard chart={{ ...chart, type: 'line' }} />;
}
