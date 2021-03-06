import { Meteor } from 'meteor/meteor';
import Tasks from '/imports/collections/tasks.js'
import { check } from 'meteor/check';

Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
        $or: [{isPrivate: false}, {owner: this.userId}]
    });
});

// Meteor methods are sensible information. They shouln't be accesible to the client, only to the server.

Meteor.methods({

    addTask(text) {
        if (Meteor.userId()) {
            var task = {
                text: text,
                createdAt: new Date(),
                checked: false,
                owner: Meteor.userId(),
                username: Meteor.user().username,
                isPrivate: false
            };
            console.log('insertando task', task);
            Tasks.insert(task);
        } else {
            throw new Meteor.Error('Usuario no autorizado');
        }
    },
    removeTask: function(taskId) {
        console.log('borrando tarea id', taskId);
        Tasks.remove(taskId);
    },
    setChecked: function(taskId, isChecked) {
        check(isChecked, Boolean);
        console.log('modificando campo isChecked en bd', isChecked);
        Tasks.update( taskId, {$set: {checked: !isChecked}} );
    },
    setPrivate: function (task) {
        check(task.isPrivate, Boolean);
        Tasks.update(task._id, {$set: {isPrivate: !task.isPrivate}});
    }
});




