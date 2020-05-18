import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
var fs = require('fs');
var Files = new FS.Collection("files", {
  stores: [new FS.Store.FileSystem("files", {path: "~/uploads"})],
})

Files.allow({
  insert: function() {
    return true;
  },
})

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  deleteFile: function(fileName) {
    console.log("delete file called, "+fileName)
    var userDirectory = Meteor.user().userDirectory
    if(userDirectory) {
      fs.unlinkSync(base+uploadPath+userDirectory+"/"+fileName)
      filesLink.remove({
        fileName: fileName,
        userId: Meteor.user()._id
      })
    }

  },
})
