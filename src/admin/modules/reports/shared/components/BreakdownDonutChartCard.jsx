import ReportChartCard from './ReportChartCard';

export default function BreakdownDonutChartCard({ chart }) {
  return <ReportChartCard chart={{ ...chart, type: 'donut' }} />;
}
