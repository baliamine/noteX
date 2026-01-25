/**
 
 * @param {Object} sharedNote 
 * @returns {boolean} 
 */
function isSharedNoteExpired(sharedNote) {
  const createdAt = sharedNote.createdAt;
  const expiresAt = new Date(
    createdAt.getTime() + sharedNote.expiresInDays * 24 * 60 * 60 * 1000,
  );
  return new Date() > expiresAt;
}

module.exports = { isSharedNoteExpired };
