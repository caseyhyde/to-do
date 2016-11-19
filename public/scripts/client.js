$(document).ready(function() {
  console.log("javascript running!");

  $('button').on('click', getTasks); //button click to get tasks from sever/DB

});

function getTasks() { // route to get tasks from sever/db
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function(tasks) {
      appendTasks(tasks);
    }
  });
}

function appendTasks(tasks) {
  for (var i = 0; i < tasks.length; i++) {
    $('#tasks').append('<p>' + tasks[i].task_name + "<br>" + tasks[i].task_details + '</p>');
  }
}
