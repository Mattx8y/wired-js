/**
 * List of guild explicit content filter levels
 * @readyonly
 * @enum
 */
const GuildExplicitContentFilterLevel = {
  /**
   * Don't scan messages for explicit content
   */
  DISABLED: 0,
  /**
   * Only scan messages by members without roles for explicit content
   */
  MEMBERS_WITHOUT_ROLES: 1,
  /**
   * Scan all messages for explicit content
   */
  ALL_MEMBERS: 2
}

module.exports = GuildExplicitContentFilterLevel;