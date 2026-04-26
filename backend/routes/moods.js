import { Router } from 'express';
import db from '../db.js';

const router = Router();

const allowedMoods = ['happy', 'sad', 'angry', 'neutral', 'excited'];

router.post('/', async (req, res) => {
  try {
    const { mood, note = '', created_at } = req.body;

    if (!mood || !created_at) {
      return res.status(400).json({ message: 'mood and created_at are required.' });
    }

    if (!allowedMoods.includes(mood)) {
      return res.status(400).json({ message: 'Invalid mood value.' });
    }

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [deleteResult] = await connection.execute('DELETE FROM moods WHERE created_at = ?', [created_at]);
      const [insertResult] = await connection.execute(
        'INSERT INTO moods (mood, note, created_at) VALUES (?, ?, ?)',
        [mood, note, created_at]
      );

      await connection.commit();

      const [rows] = await connection.execute('SELECT * FROM moods WHERE id = ?', [insertResult.insertId]);
      return res.status(deleteResult.affectedRows > 0 ? 200 : 201).json({
        mood: rows[0],
        replaced: deleteResult.affectedRows > 0
      });
    } catch (transactionError) {
      await connection.rollback();
      throw transactionError;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('POST /moods error:', error);
    return res.status(500).json({ message: 'Failed to create mood entry.' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM moods ORDER BY created_at DESC, id DESC');
    return res.json(rows);
  } catch (error) {
    console.error('GET /moods error:', error);
    return res.status(500).json({ message: 'Failed to fetch mood entries.' });
  }
});

router.get('/stats', async (_req, res) => {
  try {
    const [[mostFrequentMood]] = await db.execute(
      'SELECT mood, COUNT(*) AS count FROM moods GROUP BY mood ORDER BY count DESC, mood ASC LIMIT 1'
    );

    const [counts] = await db.execute(
      'SELECT mood, COUNT(*) AS count FROM moods GROUP BY mood ORDER BY mood ASC'
    );

    return res.json({
      most_frequent_mood: mostFrequentMood || null,
      counts
    });
  } catch (error) {
    console.error('GET /moods/stats error:', error);
    return res.status(500).json({ message: 'Failed to fetch mood stats.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM moods WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Mood entry not found.' });
    }

    return res.json({ message: 'Mood entry deleted successfully.' });
  } catch (error) {
    console.error('DELETE /moods/:id error:', error);
    return res.status(500).json({ message: 'Failed to delete mood entry.' });
  }
});

export default router;
