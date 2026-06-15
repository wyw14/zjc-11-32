export const MAX_PARTICIPANTS = 10;
export const MAX_CHARS_PER_STORY = 5000;

export function calcTotalChars(entries) {
  let sum = 0;
  for (let i = 0; i < entries.length; i++) {
    sum += entries[i].content?.length || 0;
  }
  return sum;
}

export function calcParticipantCount(entries) {
  const set = new Set();
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].author) {
      set.add(entries[i].author);
    }
  }
  return set.size;
}

export function computeStoryStatus(story) {
  const totalChars = calcTotalChars(story.entries);
  const participantCount = calcParticipantCount(story.entries);
  const locked = totalChars >= MAX_CHARS_PER_STORY || participantCount >= MAX_PARTICIPANTS;
  let lockedReason = null;
  if (totalChars >= MAX_CHARS_PER_STORY) {
    lockedReason = `已达到字数上限（${totalChars}/${MAX_CHARS_PER_STORY}字）`;
  } else if (participantCount >= MAX_PARTICIPANTS) {
    lockedReason = `已达到接龙人数上限（${participantCount}/${MAX_PARTICIPANTS}人）`;
  }
  return { totalChars, participantCount, locked, lockedReason };
}

export function applyStoryStatus(story) {
  const status = computeStoryStatus(story);
  story.totalChars = status.totalChars;
  story.participantCount = status.participantCount;
  story.locked = status.locked;
  story.lockedReason = status.lockedReason;
  return status;
}

export function formatStoryListItem(story) {
  return {
    id: story.id,
    title: story.title,
    createdAt: story.createdAt,
    updatedAt: story.updatedAt,
    entryCount: story.entries.length,
    participantCount: story.participantCount,
    totalChars: story.totalChars,
    locked: story.locked,
    lockedReason: story.lockedReason
  };
}

export function formatStoryDetail(story) {
  return {
    id: story.id,
    title: story.title,
    createdAt: story.createdAt,
    updatedAt: story.updatedAt,
    entryCount: story.entries.length,
    participantCount: story.participantCount,
    totalChars: story.totalChars,
    maxChars: MAX_CHARS_PER_STORY,
    maxParticipants: MAX_PARTICIPANTS,
    locked: story.locked,
    lockedReason: story.lockedReason,
    entries: story.entries
  };
}
