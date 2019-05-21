const ApplicationPolicy = require("./applicateion");

module.exports = class wikiPolicy extends ApplicationPolicy {

  new() {
    return this._isStandard() || this._isPremium() || this._isAdmin();
  }

  create() {
    return this.new();
  }

  edit() {
    return this._admin() || this._isOwner() || this._isPublic();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }

  private() {
    return this._isPremium() || this._isAdmin();
  }

  public() {
    return this.private();
  }

}