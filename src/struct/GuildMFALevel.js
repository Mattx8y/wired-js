/**
 * List of guild MFA levels
 * @enum {number}
 * @readonly
 */
const GuildMFALevels = {
  /**
   * Elevated permissions don't require MFA
   */
  NONE: 0,
  /**
   * Elevated permissions require MFA
   */
  ELEVATED: 1
}

module.exports = GuildMFALevels;