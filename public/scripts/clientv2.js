$('document').ready(function() {
  console.log("Document ready");
  getCurrentTasks();
  $('#newTask').on('submit', addTask);
  $('#tasks').on('click', '.delete', deleteCurrentTask);
  $('#tasks').on('click', '.update', updateCurrentTask);
  $('#tasks').on('click', '.complete', completeCurrentTask);
  $('#completedTasks').on('click', getCompletedTasks);
  $('#currentTasks').on('click', getCurrentTasks);

});

function getCurrentTasks() {
  $.ajax({
    type: 'GET',
    url: '/tasks/currenttasks',
    success: function(response) {
      console.log("Current tasks received from server: ", response);
      appendTasks(response);
    },
    error: function(response) {
      console.log("Error receiving current tasks from server");
    }
  });
}
function getCompletedTasks() {
  $.ajax({
    type: 'GET',
    url: '/tasks/completedtasks',
    success: function(tasks) {
      console.log("Completed tasks received from server: ", tasks);
      appendTasks(tasks);
    },
    error: function(response) {
      console.log("Error receiving completed tasks from server");
    }
  });
}
function appendTasks(tasks) {
  $('#tasks').empty();
  for (var i = 0; i < tasks.length; i++) {
    $('#tasks').append(
      '<div class="task" id="task' + tasks[i].id +
      '"><input class ="complete" type="checkbox"/>' +
      '<input class="task_name" name="task_name" value="' +
      tasks[i].task_name + '"/><input class="task_details"' +
      'name="task_details" value="' + tasks[i].task_details +
      '"/><button class="delete">DELETE</button>' +
      '<button class="update">UPDATE</button></div>'
    );

    $('#tasks').children().last().data('taskId', tasks[i].id);
  }
}
function addTask() {
  event.preventDefault();
  var task = {};
  var fields = $(this).children().serializeArray();
  fields.forEach(function(field) {
    task[field.name] = field.value;
  });//end forEach
  console.log("New task created: ", task);
  $.ajax({
    type: 'POST',
    url: '/tasks',
    data: task,
    success: function() {
      console.log("successfully added new task to database");
      getCurrentTasks();
      $('.newInput').val("");
    },
    error: function(response) {
      console.log("Could not send new task to server. Error: ", response);
    }
  });//end ajax post
}
function deleteCurrentTask() {
  if (confirm("Are you sure you want to delete this task?")) {
    var taskId = $(this).parent().data('taskId');
    $.ajax({
      type: 'DELETE',
      url: '/tasks/' + taskId,
      success: function() {
        console.log("Deleted task successfully");
        getCurrentTasks();
      },
      error: function(response) {
        console.log("Error deleting response: ", response);
      }
    });
  } else {
    return console.log("User chose not to delete task");
  }
}
function updateCurrentTask() {
  var taskId = $(this).parent().data('taskId');
  var task = {};
  var fields = $(this).parent().children().serializeArray();
  fields.forEach(function(field) {
    task[field.name] = field.value;
  });
  $.ajax({
    type: 'PUT',
    url: '/tasks/' + taskId,
    data: task,
    success: function() {
      console.log("successfully updated task");
      // getCurrentTasks();
    },
    error: function(err) {
      console.log("Error in ajax PUT request to update task: ", err);
    }
  });
}
function completeCurrentTask() {
  var taskId = $(this).parent().data('taskId');
  $.ajax({
    type: 'PUT',
    url: '/tasks/completed/' + taskId,
    data: {completed: true},
    success: function() {
      console.log("Successfully completed task");
    },
    error: function() {
      console.log("Error completing task");
    }
  });
}
