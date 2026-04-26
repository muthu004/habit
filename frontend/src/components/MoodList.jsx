const moodLabels = {
  happy: 'Happy',
  sad: 'Sad',
  angry: 'Angry',
  neutral: 'Neutral',
  excited: 'Excited'
};

export default function MoodList({ moods, onDelete }) {
  if (!moods.length) {
    return <div className="empty-state">No moods yet. Add your first entry to get started.</div>;
  }

  return (
    <ul className="mood-list">
      {moods.map((mood) => (
        <li className="mood-item" key={mood.id}>
          <div>
            <div className="mood-row">
              <strong>{moodLabels[mood.mood] || mood.mood}</strong>
              <span className={`mood-pill mood-${mood.mood}`}>{mood.mood}</span>
            </div>
            <p>{mood.note || 'No note added.'}</p>
            <time>{new Date(mood.created_at).toLocaleDateString()}</time>
          </div>
          <button className="danger-button" type="button" onClick={() => onDelete(mood.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
