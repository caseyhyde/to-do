/**************************
GLOBAL STORAGE FOR TASKS
*************************/
var currentTasks = [];
var completedTasks = [];

/*******************************
ON DOCUMENT READY
********************************/
$(document).ready(function() {
  console.log("Document ready!");
  getTasks('current_tasks');
  // getTasks(completedTasks, 'completed_tasks');
/*****************
EVENT LISTENERS
******************/
  $('#tasks').on('click', '.delete', function() {
    var $el = $(this); //save location of click to pass into deleteTask function
    deleteTask($el, 'current_tasks');
  }); //button click to delete specific task from DB
  $('#tasks').on('click', '.update', updateTask); //button click to update task
  $('#submitNewTask').on('click', function() {
    var $el = $(this); //need to save location of click to pass into addTask function
    addTask($el, 'current_tasks', 'current_tasks');
  });
  $('#tasks').on('click', '.complete', completeTask);
  $('#completedTasks').on('click', function() {
    getTasks('completed_tasks');
    $('#completedTasks').css("background-color", "green");
    $('#currentTasks').css("background-color", "white");
  });
  $('#currentTasks').on('click', function() {
    getTasks('current_tasks');
    $('#completedTasks').css("background-color", "white");
    $('#currentTasks').css("background-color", "green");
  });
  // $('#completeTasks').on('click', )
});

function getTasks(table) { // route to get tasks from sever/db
  var receivedTasks = [];
  $.ajax({
    type: 'GET',
    url: '/tasks/' + table,
    success: function(tasks) {
      receivedTasks = tasks;
      console.log("%cTasks received from GET request: ", "font-size: large; background-color: blue; color: yellow");
      for (var i = 0; i < tasks.length; i++) {
        console.log("%c" + tasks[i].task_name, "color: yellow; text-align: right");
      }
      appendTasks(receivedTasks, table);
    },
    error: function() {
      console.log("Failed to GET tasks from server");
    }
  });
}
function appendTasks(tasks, table) {
  $('#tasks').empty();
  for (var i = 0; i < tasks.length; i++) {
    $('#tasks').append(
      '<div class="' + table + ' task" id="task' + tasks[i].id +
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
//Delete task function: use this function to delete tasks on delete press
//or when completing a task and moving to completed tasks table
function deleteTask(clickLocation, table) {
  var taskId = $(clickLocation).parent().data('taskId');
  console.log("Task clicked ID: ", taskId);

  $.ajax({
    type: 'DELETE',
    url: '/tasks/' + taskId + '/' + table,  //Which task to delete, from which table
    success: function(response) {
      console.log(response);
      removeTaskFromDOM(clickLocation);
      return; //hopefully this makes any function called after deleteTask not run until success finishes
    },
    error: function() {
      console.log("Could not delete that task");
      return;
    }
  });
}
function removeTaskFromDOM(clickLocation) {
  $(clickLocation).parent().remove();
}
function updateTask() {
  var $el = $(this);
  var taskId = $($el).parent().data('taskId');
  var task = {};
  var fields = $($el).parent().children().serializeArray();
  fields.forEach(function(field) {
    task[field.name] = field.value;
  });

  $.ajax({
    type: 'PUT',
    url: '/tasks/' + taskId,
    data: task,
    success: function(result) {
      updateTaskOnDOM($el, task); //rather than get all data from server again, just remove from dom after removing from server.
    },
    error: function(result) {
      console.log("Could not update");
    }
  });
}
function updateTaskOnDOM(clickLocation, task) {
  $(clickLocation).prev().prev().prev().val(task.task_name);
  $(clickLocation).prev().prev().val(task.task_details);
}
function completeTask(table) {
  var $el = $(this);
  deleteTask($el, table);
  addTask($el, 'completed_tasks', 'current_tasks');
}
function addTask(clickLocation, addTable, removeTable) {
  event.preventDefault();
  var task = {};
  var fields = $(clickLocation).parent().children().serializeArray();
  fields.forEach(function(field) {
    task[field.name] = field.value;
  });
  console.log("New task created: ", task, "Added to table: ", addTable);

  $.ajax({
    type: 'POST',
    url: '/tasks/' + addTable,
    data: task,
    success: function() {
      console.log("successfully added new task to database");
      getTasks(removeTable);
      $('.newInput').val("");
    },
    error: function(response) {
      console.log("Could not send new task to server. Error: ", response);
    }
  });

}
