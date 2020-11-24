const PermissionFlags = require("./PermissionFlags");

/**
 * Represents permissions on Discord
 * @extends {Array}
 */
class Permissions extends Array {
  /**
   * Creates a new Permissions class
   * @param {number} bitwise The permissions integer
   */
  constructor(bitwise) {
    super();
    /**
     * The raw permissions integer
     * @type {number}
     */
    this.bitwise = bitwise;

    for (let flag in PermissionFlags) {
      if ((bitwise & PermissionFlags[flag]) === PermissionFlags[flag]) {
        this.push(PermissionFlags[flag]);
      }
    }
  }

  /**
   * Check if this has a specific permission
   * @param {PermissionFlags} permission The permission to check
   */
  has(permission) {
    return this.includes(permission) || this.includes(PermissionFlags.ADMINISTRATOR);
  }
}

module.exports = Permissions;