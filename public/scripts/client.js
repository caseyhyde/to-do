$(document).ready(function() {
  console.log("javascript running!");

  $('button').on('click', getTasks); //button click to get tasks from sever/DB

});

function getTasks() { // route to get tasks from sever/db
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function(tasks) {
      console.log(tasks);
      appendTasks(tasks);
    }
  });
}

function appendTasks(tasks) {
  $('#tasks').empty();
  for (var i = 0; i < tasks.length; i++) {
    $('#tasks').append('<div class="task" id="task' + tasks[i].id + '"><p class="task_name">' + tasks[i].task_name + "</p><p class ='task_details'>" + tasks[i].task_details + '</p><button>DELETE</button></div>');
    $('#tasks').children().last().data('taskId', tasks[i].id);
  }
}
//
// function deleteTask() {
//   var taskID = $(this).
//   $.ajax({
//     type: 'DELETE',
//     url: '/tasks/' +
//   });
// }
