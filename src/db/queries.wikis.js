const User = require("./models").User;
const Wiki = require("./models").Wiki;

module.exports = {
  getAllWikis(callback) {
    return Wiki.findAll()
      .then((wikis) => {
        callback(null, wikis);
      })
      .catch((err) => {
        callback(err);
      })
  },

  addWiki(newWiki, callback) {
    return Wiki.create(newWiki)
      .then((wiki) => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getWiki(id, callback) {
    return Wiki.findByPk(id)
      .then((wiki) => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      })
  },

  deleteWiki(req, callback) {
    return Wiki.findByPk(req.params.id)
      .then((wiki) => {

        wiki.destroy()
          .then((res) => {

            callback(null, wiki);
          });
      })
      .catch((err) => {
        callback(err);
      })
  },

  updateWiki(req, updatedWiki, callback) {
    return Wiki.findByPk(req.params.id)
      .then((wiki) => {
        if (!wiki) {
          return callback("Wiki not found");
        }

        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
          .then(() => {
            callback(null, wiki);
          })
          .catch((err) => {
            callback(err);
          });
      });
  },

  toPublic(id, callback){
    return Wiki.findOne({
      where: { id: id }
    })
    .then(wiki => {
      if (!wiki) {
        return callback("Wiki not found");
      }
      wiki.update({
        private: false
      });
      callback(null, wiki);
    })
    .catch(err => {
      callback(err);
    })
  },

  toPrivate(id, callback){
    return Wiki.findOne({
      where: { id: id }
    })
    .then(wiki => {
      if (!wiki) {
        return callback("Wiki not found");
      }
      wiki.update({
        private: true
      });
      callback(null, wiki);
    })
    .catch(err => {
      callback(err);
    })
  },

  downgrade(userId){
    return Wiki.findAll({
      where: { userId: userId }
    })
    .then((wikis) => {
      wikis.forEach(wiki => {
        wiki.update({
          private: false
        });
      });
    })
    .catch(err => {
      console.log(err);
    })
  }

}