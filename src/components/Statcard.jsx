export default function StatCard({ label, value, detail }) {
    return (
      <article className="stat-card">
        <p className="stat-label">{label}</p>
        <div className="stat-value">{value}</div>
        <p className="stat-detail">{detail}</p>
      </article>
    );
  }