import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter} from 'meteor/ostrio:flow-router-extra';

import './main.html';
import './register.html';
import './login.html';
import './dashboard.html';
import './home.html';

var Files = new FS.Collection("files", {
  stores: [new FS.Store.FileSystem("files", {path: "~/uploads"})]
})

Template.register.events({
  'click #register_submit'(event, instance) {
    var username = $('#register_username').val()
    var email = $('#register_email').val()
    var password = $('#register_password').val()
    Accounts.createUser({username: username, email: email, password: password}, function(err) {
      if(err) console.log(err)
      if(Meteor.user()) FlowRouter.go('/dashboard')
    })
  },
})

Template.login.events({
  'click #login_submit'(event, instance) {
    var email = $('#login_email').val()
    var password = $('#login_password').val()
    Meteor.loginWithPassword(email, password, function(err) {
        if(err) console.log(err)
        if(Meteor.user()) {
            FlowRouter.go('/dashboard')
        } else {
            console.log("failed to login")
        }
    })
  }
})

Template.navbar.events({
  'click #navbar_logout'(event, instance) {
    Meteor.logout()
    FlowRouter.go('/login')
  }
})

Template.dashboard.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({ // set default state
  });
  var state = this.state
})

Template.dashboard.helpers({
  getUploadedFiles: function() {
    var files =  Files.find({userId: Meteor.userId()})
    return files
  },
  getWindowUrl: function() {
    return window.location.href
  },
  convertSize: function(size) {
    return (parseInt(size) / 1000).toString().split(".")[0];
  }
})

Template.dashboard.events({
  'click .share_url'(event, instance) {
    var url = $(event.target).data('url')
	  var textArea = document.createElement("textarea")
	  textArea.value = url
	  document.body.appendChild(textArea);
	  textArea.focus();
	  textArea.select();
	  document.execCommand('copy')
  	  textArea.remove();
	  $(event.target).text('Copied to Clipboard')
  },
  'click .delete_file'(event, instance) {
    var fileId = $(event.target).data('id')
    Files.remove({_id: fileId})
  },
  'change #file_upload'(event, instance) {
    var files = event.currentTarget.files;
    for(var i=0; i<files.length; i++) {
      var file = new FS.File(files[i])
      file.userId = Meteor.user()._id
      Files.insert(file, function(err, fileObj){
        console.log("file uploading")
      })
    }
  }
 })

FlowRouter.route('/', {
  name: 'home',
  action: function() {
    BlazeLayout.render('App_body', {main: 'home'})
  }
})

FlowRouter.route('/register', {
  name: 'register',
  action: function() {
    BlazeLayout.render('App_body', {main: 'register'})
  }
})

FlowRouter.route('/login', {
  name: 'login',
  action: function() {
    BlazeLayout.render('App_body', {main: 'login'})
  }
})

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  action: function() {
    if(Meteor.userId()){
      BlazeLayout.render('App_body', {main: 'dashboard'})
    } else {
      BlazeLayout.render('App_body', {main: 'login'})
    }
  }
})
