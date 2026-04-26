import { useEffect, useMemo, useState } from 'react';
import AddMoodForm from './components/AddMoodForm.jsx';
import MoodList from './components/MoodList.jsx';
import InsightsPanel from './components/InsightsPanel.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const emptyForm = {
  mood: 'happy',
  note: '',
  created_at: new Date().toISOString().slice(0, 10)
};

export default function App() {
  const [moods, setMoods] = useState([]);
  const [stats, setStats] = useState({ most_frequent_mood: null, counts: [] });
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const moodCountsMap = useMemo(() => {
    return stats.counts.reduce((accumulator, item) => {
      accumulator[item.mood] = item.count;
      return accumulator;
    }, {});
  }, [stats.counts]);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const [moodsResponse, statsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/moods`),
        fetch(`${API_BASE_URL}/moods/stats`)
      ]);

      if (!moodsResponse.ok || !statsResponse.ok) {
        throw new Error('Unable to load mood data.');
      }

      const moodsData = await moodsResponse.json();
      const statsData = await statsResponse.json();

      setMoods(moodsData);
      setStats(statsData);
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong while loading data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || 'Failed to save mood entry.');
      }

      setForm(emptyForm);
      await fetchData();
    } catch (requestError) {
      setError(requestError.message || 'Failed to save mood entry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/moods/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || 'Failed to delete mood entry.');
      }

      await fetchData();
    } catch (requestError) {
      setError(requestError.message || 'Failed to delete mood entry.');
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Daily Mood Tracker</p>
          <h1>Track moods, review patterns, and spot trends.</h1>
          <p className="hero-copy">
            Log a quick mood every day and use simple analytics to see which feelings show up most often.
          </p>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-label">Entries logged</span>
          <strong>{moods.length}</strong>
        </div>
      </section>

      <section className="grid-layout">
        <div className="panel">
          <AddMoodForm
            form={form}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>

        <div className="panel">
          <InsightsPanel stats={stats} moodCountsMap={moodCountsMap} />
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Mood History</h2>
          <button className="secondary-button" type="button" onClick={fetchData} disabled={loading}>
            Refresh
          </button>
        </div>

        {error ? <div className="notice error">{error}</div> : null}
        {loading ? <div className="notice">Loading moods...</div> : null}
        {!loading ? <MoodList moods={moods} onDelete={handleDelete} /> : null}
      </section>
    </main>
  );
}
