import express from 'express';
import cors from 'cors';
import {
  createStory,
  getAllStories,
  getStoryById,
  addEntry,
  resetStory,
  MAX_PARTICIPANTS,
  MAX_CHARS_PER_STORY
} from './storyService.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function handleServiceResult(res, result) {
  if (!result.success) {
    return res.status(result.code || 400).json({ error: result.error });
  }
  res.json(result.story);
}

app.get('/api/config', (_req, res) => {
  res.json({
    maxParticipants: MAX_PARTICIPANTS,
    maxCharsPerStory: MAX_CHARS_PER_STORY
  });
});

app.get('/api/stories', (_req, res, next) => {
  try {
    res.json(getAllStories());
  } catch (err) {
    next(err);
  }
});

app.get('/api/stories/:id', (req, res, next) => {
  try {
    const story = getStoryById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: '故事不存在' });
    }
    res.json(story);
  } catch (err) {
    next(err);
  }
});

app.post('/api/stories', (req, res, next) => {
  try {
    const result = createStory(req.body);
    if (!result.success) {
      return res.status(result.code || 400).json({ error: result.error });
    }
    res.status(201).json(result.story);
  } catch (err) {
    next(err);
  }
});

app.post('/api/stories/:id/entries', (req, res, next) => {
  try {
    handleServiceResult(res, addEntry(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
});

app.post('/api/admin/stories/:id/reset', (req, res, next) => {
  try {
    const result = resetStory(req.params.id);
    if (!result.success) {
      return res.status(result.code || 400).json({ error: result.error });
    }
    res.json({ message: '故事已重置', story: result.story });
  } catch (err) {
    next(err);
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`微小说接力服务已启动: http://localhost:${PORT}`);
});
