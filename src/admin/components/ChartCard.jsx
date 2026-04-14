import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts';

const COLORS = ['#C0392B', '#F39C12', '#27AE60', '#2980B9', '#8E44AD'];

export function MembershipTrendChart({ data = [] }) {
  return (
    <div className="adm-chart-card">
      <div className="adm-chart-card__header">
        <p className="adm-chart-card__title">Membership Growth</p>
        <p className="adm-chart-card__sub">New members per month</p>
      </div>
      <div className="adm-chart-card__body">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid var(--clr-border)', fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="new_members"
              name="New Members"
              stroke="#C0392B"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#C0392B' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="total_members"
              name="Total Members"
              stroke="#F39C12"
              strokeWidth={2}
              dot={false}
              strokeDasharray="4 2"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ApplicationStatusChart({ data = [] }) {
  return (
    <div className="adm-chart-card">
      <div className="adm-chart-card__header">
        <p className="adm-chart-card__title">Application Status</p>
        <p className="adm-chart-card__sub">Breakdown by current status</p>
      </div>
      <div className="adm-chart-card__body">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="count"
              nameKey="status"
            >
              {data.map((entry, index) => (
                <Cell key={entry.status} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid var(--clr-border)', fontSize: 12 }}
              formatter={(val, name) => [val, name]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CommitteeTypesChart({ data = [] }) {
  return (
    <div className="adm-chart-card">
      <div className="adm-chart-card__header">
        <p className="adm-chart-card__title">Committees by Type</p>
        <p className="adm-chart-card__sub">Active committees per category</p>
      </div>
      <div className="adm-chart-card__body">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-border)" />
            <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid var(--clr-border)', fontSize: 12 }}
            />
            <Bar dataKey="count" name="Committees" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
