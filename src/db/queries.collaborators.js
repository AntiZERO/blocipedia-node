const Collaborator = require("./models").Collaborator;
const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/application");

module.exports = {

  createCollaborator(req, callback) {
    if (req.user.username == req.body.collaborator) {
      return callback("You are unable to set yourself as a collaborator to your own wiki.");
    }

    User.findOne({
      where: {
        username: req.body.collaborator
      }
    })
      .then((user) => {
        if (!user) {
          return callback("User does not exist")
        }
        Collaborator.findOne({
          where: {
            userId: user.id,
            wikiId: req.params.wikiId
          }
        })
          .then((collaborator) => {
            if (collaborator) {
              return callback("This user is already set as a collaborator on this wiki.")
            }
            let newCollaborator = {
              userId: user.id,
              wikiId: req.params.wikiId
            };
            return Collaborator.create({
              userId: user.id,
              wikiId: req.params.wikiId
            })
              .then((collaborator) => {
                callback(null, collaborator);
              })
              .catch((err) => {
                callback("Unable to locate")
              })
          })
      })
  },

  deleteCollaborator(id, callback) {
    console.log('got to queries...');
    return Collaborator.destroy({
      where: { id: id }
    })
    .then((deletedRecordsCount) => {
      callback(null, deletedRecordsCount);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getCollaborators(id, callback){
    console.log('getting...')
    let result = {};
    Wiki.findOne(
      {
        where: { id: id }
      })
    .then(wiki => {
      if(!wiki){
        callback(404);
      } else {
        result['wiki'] = wiki;
        // select * from "Collaborators" where wikiId = wiki.id
        // select username from "Users" where id=userId
        Collaborator.scope({ method: ['collaboratorsFor', wiki.id]})
        .findAll()
        .then(collaborators => {
          result['collaborators'] = collaborators;
          console.log('returning...', 'wiki collabs: ', collaborators);
          callback(null, wiki, collaborators);
        })
        .catch(err => {
          callback(err);
        })
      }
      //callback(null, wiki, wiki.collaborators);
    })
    .catch(err => {
      callback(err);
    })
  }

};