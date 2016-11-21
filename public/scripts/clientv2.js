$('document').ready(function() {
  console.log("Document ready");
  getCurrentTasks();
  // getCompletedTasks();
  $('#newTask').on('submit', addTask);
  $('#tasks').on('click', '.delete', deleteCurrentTask);

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
    success: function(response) {
      console.log("Completed tasks received from server: ", response);
      appendTasks(response);
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
}
