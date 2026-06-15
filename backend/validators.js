import { MAX_CHARS_PER_STORY } from './storyStatus.js';

function isBlank(str) {
  return !str || !str.trim();
}

export function validateCreateStoryInput(input) {
  const { title, content, author } = input || {};
  if (isBlank(title)) return { valid: false, error: '故事标题不能为空', code: 400 };
  if (isBlank(author)) return { valid: false, error: '作者名称不能为空', code: 400 };
  if (isBlank(content)) return { valid: false, error: '开篇内容不能为空', code: 400 };
  if (content.length > MAX_CHARS_PER_STORY) {
    return { valid: false, error: `开篇内容不能超过 ${MAX_CHARS_PER_STORY} 字`, code: 400 };
  }
  return { valid: true, data: { title: title.trim(), content: content.trim(), author: author.trim() } };
}

export function validateAddEntryInput(input) {
  const { content, author } = input || {};
  if (isBlank(author)) return { valid: false, error: '作者名称不能为空', code: 400 };
  if (isBlank(content)) return { valid: false, error: '续写内容不能为空', code: 400 };
  return { valid: true, data: { content: content.trim(), author: author.trim() } };
}
