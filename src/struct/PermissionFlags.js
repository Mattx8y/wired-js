/**
 * List of permissions
 * @readyonly
 * @enum
 * @type {number}
 */
PermissionFlags = {
  /**
   * Allows creation of instant invites
   */
  CREATE_INSTANT_INVITE: 0x1,
  /**
   * Allows kicking members
   */
  KICK_MEMBERS: 0x2,
  /**
   * Allows banning members
   */
  BAN_MEMBERS: 0x4,
  /**
   * Allows all permissions and bypasses channel permission overwrites
   */
  ADMINISTRATOR: 0x8,
  /**
   * Allows management and editing of channels
   */
  MANAGE_CHANNELS: 0x10,
  /**
   * Allows management and editing of the guild
   */
  MANAGE_GUILD: 0x20,
  /**
   * Allows for the addition of reactions to messages
   */
  ADD_REACTIONS: 0x40,
  /**
   * Allows for viewing of audit logs
   */
  VIEW_AUDIT_LOG: 0x80,
  /**
   * Allows for using priority speaker in a voice channel
   */
  PRIORITY_SPEAKER: 0x100,
  /**
   * Allows the user to go live
   */
  STREAM: 0x200,
  /**
   * Allows guild members to view a channel, which includes reading messages in text channels
   */
  VIEW_CHANNEL: 0x400,
  /**
   * Allows for sending messages in a channel
   */
  SEND_MESSAGES: 0x800,
  /**
   * Allows for sending `/tts` messages
   */
  SEND_TTS_MESSAGES: 0x1000,
  /**
   * Allows for deletion of other users messages
   */
  MANAGE_MESSAGES: 0x2000,
  /**
   * Links sent by users with this permission will be auto-embedded
   */
  EMBED_LINKS: 0x4000,
  /**
   * Allows for uploading images and files
   */
  ATTACH_FILES: 0x8000,
  /**
   * Allows for reading of message history
   */
  READ_MESSAGE_HISTORY: 0x10000,
  /**
   * Allows for using the `@everyone` tag to notify all users in a channel, and the `@here` tag to notify all online users in a channel	
   */
  MENTION_EVERYONE: 0x20000,
  /**
   * Allows the usage of custom emojis from other servers
   */
  USE_EXTERNAL_EMOJIS: 0x40000,
  /**
   * Allows for viewing guild insights
   */
  VIEW_GUILD_INSIGHTS: 0x80000,
  /**
   * Allows for joining of a voice channel
   */
  CONNECT: 0x100000,
  /**
   * Allows for speaking in a voice channel
   */
  SPEAK: 0x200000,
  /**
   * Allows for muting members in a voice channel
   */
  MUTE_MEMBERS: 0x400000,
  /**
   * Allows for deafening of members in a voice channel
   */
  DEAFEN_MEMBERS: 0x800000,
  /**
   * Allows for moving of members between voice channels
   */
  MOVE_MEMBERS: 0x1000000,
  /**
   * Allows for using voice-activity-detection in a voice channel
   */
  USE_VAD: 0x2000000,
  /**
   * Allows for modification of own nickname
   */
  CHANGE_NICKNAME: 0x4000000,
  /**
   * Allows for modification of other users nicknames
   */
  MANAGE_NICKNAMES: 0x8000000,
  /**
   * Allows management and editing of roles
   */
  MANAGE_ROLES: 0x10000000,
  /**
   * Allows management and editing of webhooks
   */
  MANAGE_WEBHOOKS: 0x20000000,
  /**
   * Allows management and editing of emojis
   */
  MANAGE_EMOJIS: 0x40000000
}

module.exports = PermissionFlags;