const moodOrder = ['happy', 'excited', 'neutral', 'sad', 'angry'];

export default function InsightsPanel({ stats, moodCountsMap }) {
  const mostFrequent = stats.most_frequent_mood;
  const maxCount = Math.max(...Object.values(moodCountsMap), 1);

  return (
    <div className="insights-card">
      <div className="section-title">
        <p className="eyebrow">Insights</p>
        <h2>Quick mood analysis</h2>
      </div>

      <div className="insight-box">
        <span>Most frequent mood</span>
        <strong>{mostFrequent ? mostFrequent.mood : 'No data yet'}</strong>
        {mostFrequent ? <small>{mostFrequent.count} total entries</small> : null}
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <span>Mood counts</span>
          <small>Grouped by mood</small>
        </div>

        <div className="bar-chart">
          {moodOrder.map((mood) => {
            const count = moodCountsMap[mood] || 0;
            const height = count ? Math.max((count / maxCount) * 100, 12) : 12;

            return (
              <div className="bar-column" key={mood}>
                <div className="bar-track">
                  <div className={`bar-fill mood-${mood}`} style={{ height: `${height}%` }} />
                </div>
                <span>{mood}</span>
                <small>{count}</small>
              </div>
            );
          })}
        </div>
      </div>

      <div className="stats-grid">
        {stats.counts.map((item) => (
          <div className="stat-chip" key={item.mood}>
            <span>{item.mood}</span>
            <strong>{item.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
