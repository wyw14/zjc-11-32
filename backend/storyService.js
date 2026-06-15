import {
  readData,
  saveStory,
  findStory,
  allStories,
  generateId
} from './storage.js';
import {
  applyStoryStatus,
  computeStoryStatus,
  calcTotalChars,
  formatStoryDetail,
  formatStoryListItem,
  MAX_PARTICIPANTS,
  MAX_CHARS_PER_STORY
} from './storyStatus.js';
import {
  validateCreateStoryInput,
  validateAddEntryInput
} from './validators.js';

export { MAX_PARTICIPANTS, MAX_CHARS_PER_STORY };

function fail(error, code = 400) {
  return { success: false, error, code };
}

function ok(story) {
  return { success: true, story: formatStoryDetail(story) };
}

export function createStory(rawInput) {
  const validation = validateCreateStoryInput(rawInput);
  if (!validation.valid) {
    return fail(validation.error, validation.code);
  }
  const { title, content, author } = validation.data;
  const data = readData();
  const now = Date.now();
  const story = {
    id: generateId(),
    title,
    createdAt: now,
    updatedAt: now,
    entries: [{
      id: generateId(),
      author,
      content,
      order: 1,
      createdAt: now
    }]
  };
  applyStoryStatus(story);
  saveStory(data, story);
  return { success: true, story: formatStoryDetail(story) };
}

export function getAllStories() {
  const data = readData();
  const stories = allStories(data);
  for (const story of stories) {
    applyStoryStatus(story);
  }
  return stories
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map(formatStoryListItem);
}

export function getStoryById(id) {
  const data = readData();
  const story = findStory(data, id);
  if (!story) return null;
  applyStoryStatus(story);
  return formatStoryDetail(story);
}

export function addEntry(storyId, rawInput) {
  const validation = validateAddEntryInput(rawInput);
  if (!validation.valid) {
    return fail(validation.error, validation.code);
  }
  const { content, author } = validation.data;
  const data = readData();
  const story = findStory(data, storyId);
  if (!story) {
    return fail('故事不存在', 404);
  }
  const status = computeStoryStatus(story);
  if (status.locked) {
    return fail(status.lockedReason || '故事已锁定', 409);
  }
  const contentLen = content.length;
  const remaining = MAX_CHARS_PER_STORY - status.totalChars;
  if (contentLen > remaining) {
    return fail(`内容过长，当前剩余可容纳 ${remaining} 字`, 413);
  }
  const now = Date.now();
  story.entries.push({
    id: generateId(),
    author,
    content,
    order: story.entries.length + 1,
    createdAt: now
  });
  story.updatedAt = now;
  applyStoryStatus(story);
  saveStory(data, story);
  return ok(story);
}

export function resetStory(storyId) {
  const data = readData();
  const story = findStory(data, storyId);
  if (!story) {
    return fail('故事不存在', 404);
  }
  const firstEntry = story.entries[0];
  const now = Date.now();
  story.entries = firstEntry ? [{
    id: generateId(),
    author: firstEntry.author,
    content: firstEntry.content,
    order: 1,
    createdAt: now
  }] : [];
  story.createdAt = now;
  story.updatedAt = now;
  applyStoryStatus(story);
  saveStory(data, story);
  return ok(story);
}
