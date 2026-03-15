function normalizeThread(thread) {
  return {
    platform: 'gmail',
    externalId: thread.id,
    title: 'Gmail Thread',
    unreadCount: 0,
    updatedAt: new Date()
  };
}

function normalizeMessage(msg, conversationId) {
  return {
    conversationId,
    platform: 'gmail',
    externalMessageId: msg.id,
    sender: msg.payload.headers.find(h => h.name === 'From')?.value,
    content: Buffer.from(msg.payload.body.data || '', 'base64').toString(),
    timestamp: new Date(parseInt(msg.internalDate))
  };
}

module.exports = { normalizeThread, normalizeMessage };
