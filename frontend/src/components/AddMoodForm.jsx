const moodOptions = ['happy', 'sad', 'angry', 'neutral', 'excited'];

export default function AddMoodForm({ form, onChange, onSubmit, submitting }) {
  return (
    <form className="form-card" onSubmit={onSubmit}>
      <div className="section-title">
        <p className="eyebrow">Add Mood</p>
        <h2>Log today&apos;s mood</h2>
      </div>

      <label>
        Mood
        <select value={form.mood} onChange={(event) => onChange('mood', event.target.value)}>
          {moodOptions.map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>
      </label>

      <label>
        Note
        <textarea
          rows="4"
          placeholder="What influenced your mood today?"
          value={form.note}
          onChange={(event) => onChange('note', event.target.value)}
        />
      </label>

      <label>
        Date
        <input type="date" value={form.created_at} onChange={(event) => onChange('created_at', event.target.value)} />
      </label>

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save Mood'}
      </button>
    </form>
  );
}
