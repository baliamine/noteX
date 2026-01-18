const compareNotePassword = require("./compare.password");

/**
 * Check if a locked note can be accessed
 * @param {Object} note - Note document
 * @param {String} notePassword - Password provided by user
 * @throws {Object} error with status & message
 */
const checkNoteLock = async (note, notePassword) => {
  if (!note.isLocked) return true;

  if (!notePassword) {
    throw {
      status: 403,
      message: "This note is locked. Password is required.",
    };
  }

  const isMatch = await compareNotePassword(
    notePassword,
    note.password
  );

  if (!isMatch) {
    throw {
      status: 403,
      message: "Incorrect password",
    };
  }

  return true;
};

module.exports = checkNoteLock;
