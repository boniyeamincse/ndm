import SectionCard from '../../../membership/shared/components/SectionCard';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#1d4ed8', '#0f766e', '#b45309', '#b91c1c', '#7c3aed', '#475569'];

export default function ReportChartCard({ chart }) {
  function renderChart() {
    if (chart.type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chart.data}>
            <XAxis dataKey="label" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#1d4ed8" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chart.type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chart.data}>
            <XAxis dataKey="label" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#0f766e" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={chart.data} dataKey="value" nameKey="label" innerRadius={60} outerRadius={92} paddingAngle={3}>
            {chart.data.map((entry, index) => <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <SectionCard title={chart.title}>
      <div className="rpt-chart-card">{renderChart()}</div>
    </SectionCard>
  );
}
