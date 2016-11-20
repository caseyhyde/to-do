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
  getTasks(currentTasks, 'current_tasks');
  // getTasks(completedTasks, 'completed_tasks');
/*****************
EVENT LISTENERS
******************/
  $('#tasks').on('click', '.delete', function() {
    var $el = $(this); //save location of click to pass into deletTask function
    deleteTask($el)
  }); //button click to delete specific task from DB
  $('#tasks').on('click', '.update', updateTask); //button click to update task
  $('#submitNewTask').on('click', function() {
    var $el = $(this); //need to save location of click to pass into addTask function
    addTask($el, 'current_tasks');
  });
  $('#tasks').on('click', '.complete', completeTask);
  // $('#completeTasks').on('click', )
});

function getTasks(taskType, getUrl) { // route to get tasks from sever/db
  $.ajax({
    type: 'GET',
    url: '/tasks/' + getUrl,
    success: function(tasks) {
      taskType = tasks;
      console.log("%cTasks received from GET request: ", "font-size: large; background-color: blue; color: yellow");
      for (var i = 0; i < tasks.length; i++) {
        console.log("%c" + tasks[i].task_name, "color: yellow; text-align: right");
      }
      appendTasks(taskType);
    },
    error: function() {
      console.log("Failed to GET tasks from server");
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


//Delete task function: use this function to delete tasks on delete press
//or when completing a task and moving to completed tasks table
function deleteTask(clickLocation) {
  var taskId = $(clickLocation).parent().data('taskId');
  console.log($(this));
  console.log("Task clicked ID: ", taskId);

  $.ajax({
    type: 'DELETE',
    url: '/tasks/' + taskId, //Which task to delete
    success: function(response) {
      console.log(response);
      removeTaskFromDOM(clickLocation);
    },
    error: function() {
      console.log("Could not delete that task");
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
  console.log(task);

  $.ajax({
    type: 'PUT',
    url: '/tasks/' + taskId,
    data: task,
    success: function(result) {
      console.log("Updated task");
      console.log("TASK: ", task);
      updateTaskOnDOM($el, task); //rather than get all data from server again, just remove from dom after removing from server.
    },
    error: function(result) {
      console.log("Could not update");
    }
  });
}

function updateTaskOnDOM(clickLocation, task) {
  console.log(clickLocation);
  console.log(task);
  $(clickLocation).prev().prev().prev().val(task.task_name);
  $(clickLocation).prev().prev().val(task.task_details);
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
