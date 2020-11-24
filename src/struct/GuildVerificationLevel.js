/**
 * List of guild verification levels
 * @readonly
 * @enum {number}
 */
const GuildVerificationLevel = {
  /**
   * Unrestricted
   */
  NONE: 0,
  /**
   * Must have verified email on account
   */
  LOW: 1,
  /**
   * Must be registered on Discord for longer than 5 minutes
   */
  MEDIUM: 2,
  /**
   * Must be a member of the server for longer than 10 minutes
   */
  HIGH: 3,
  /**
   * Must have verified phone number
   */
  VERY_HIGH: 4
}

module.exports = GuildVerificationLevel;