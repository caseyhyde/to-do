$(document).ready(function() {
  console.log("javascript running!");

  getTasks();

  $('#tasks').on('click', '.delete', function() {
    var $el = $(this);
    deleteTask($el)
  }); //button click to delete specific task from DB
  $('#tasks').on('click', '.update', updateTask); //button click to update task
  $('#submitNewTask').on('click', function() {
    var $el = $(this);
    addTask($el, 'current_tasks');
  });

  $('#tasks').on('click', '.complete', completeTask);

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

function deleteTask(clickLocation) {
  var taskId = $(clickLocation).parent().data('taskId');
  console.log($(this));
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

function updateTask() {
  var taskId = $(this).parent().data('taskId');
  var task = {};
  var fields = $(this).parent().children().serializeArray();
  fields.forEach(function(field) {
    task[field.name] = field.value;
  });
  console.log(task);

  $.ajax({
    type: 'PUT',
    url: '/tasks/' + taskId,
    data: task,
    success: function(result) {
      console.log("Updated task");
      getTasks();
    },
    error: function(result) {
      console.log("Could not update");
    }
  });
}

function completeTask() {
  var $el = $(this);
  addTask($el, 'completed_tasks');
  deleteTask($el);
}

function addTask(clickLocation, table) {
  event.preventDefault();
  var task = {};
  var fields = $(clickLocation).parent().children().serializeArray();
  fields.forEach(function(field) {
    task[field.name] = field.value;
  });
  console.log("New task created: ", task);

  $.ajax({
    type: 'POST',
    url: '/tasks/' + table,
    data: task,
    success: function() {
      console.log("successfully added new task to database");
      getTasks();
      $('.newInput').val("");
    },
    error: function(response) {
      console.log("Could not send new task to server. Error: ", response);
    }
  });

}
