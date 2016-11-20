$(document).ready(function() {
  console.log("javascript running!");

  $('button').on('click', getTasks); //button click to get tasks from sever/DB
  $('#tasks').on('click', '.delete', deleteTask); //button click to delete specific task from DB

});

function getTasks() { // route to get tasks from sever/db
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function(tasks) {
      console.log("Tasks received from GET request: ", tasks);
      appendTasks(tasks);
    }
  });
}

function appendTasks(tasks) {
  $('#tasks').empty();
  for (var i = 0; i < tasks.length; i++) {
    $('#tasks').append('<div class="task" id="task' + tasks[i].id + '"><p class="task_name">' + tasks[i].task_name + '</p><p class ="task_details">' + tasks[i].task_details + '</p><button class="delete">DELETE</button></div>');
    $('#tasks').children().last().data('taskId', tasks[i].id);
  }
}

function deleteTask() {
  var taskId = $(this).parent().data('taskId');
  console.log("Task clicked ID: ", taskId);

  $.ajax({
    type: 'DELETE',
    url: '/tasks/' + taskId,
    success: function(response) {
      console.log(response);
      getTasks();
    },
    error: function() {
      console.log("Could not delete that task");
    }
  });
}
