// @flow

const Redis = require('ioredis');
const config = require('config');

const redisConfig = config.get('redis');

const shared = new Redis(redisConfig);

shared.defineCommand('readMessage', {
  numberOfKeys: 1,
  lua: `
    --[[ Define Local Vars ]]--
    local receiverUserId = KEYS[1]
    local senderUserId = ARGV[1]
    local readMessageTimestamp = ARGV[2]

    --[[ Get the current unread timestamp ]]--
    local currentUnreadTimestamp = redis.call('hget', receiverUserId,senderUserId)

    --[[ If the current timestamp is the message that we are reading, delete it ]]--
    --[[ This will set the conversation to read by the receiver ]]--
    local conversationRead = currentUnreadTimestamp == readMessageTimestamp
    if conversationRead then
      redis.call('hdel', receiverUserId, senderUserId)
    end
    return conversationRead
  `,
});

shared.defineCommand('insertMessage', {
  numberOfKeys: 1,
  lua: `
    --[[ Define Local Vars ]]--
    local receiverUserId = KEYS[1]
    local senderUserId = ARGV[1]
    local newMessageTimestamp = ARGV[2]

    --[[ Get the current unread timestamp ]]--
    local currentUnreadTimestamp = redis.call('hget', receiverUserId, senderUserId)

    --[[ If the current unread timestamp is false, always update it ]]--
    --[[ Otherwise, ensure the new message's timestamp is after the previous messages's timestamp ]]--
    local shouldSetConversationUnread = (not currentUnreadTimestamp) or (newMessageTimestamp > currentUnreadTimestamp)
    if shouldSetConversationUnread then
      redis.call('hset', receiverUserId, senderUserId, newMessageTimestamp)
      return newMessageTimestamp
    end

    return currentUnreadTimestamp
  `,
});

/*

    if newMessageAfterCurrMessage then
      redis.call('hset', receiverUserId, senderUserId, newMessageTimestamp)
    end
*/

const prefix = 'gem';
function unreadConversationsKey(userId: number) {
  return `${prefix}:unread-conversations userId:${userId}`;
}


module.exports = {
  shared,
  prefix,
  unreadConversationsKey,
};
