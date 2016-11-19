console.log("TEST!");

$(document).ready(function() {

  $('#tasks').append('<h1>HELLO!!!</h1>');
  console.log("javascript running!");

  $('button').on('click', getTasks);

});

function getTasks() {
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function(tasks) {
      $('#tasks').append('<p>' + tasks + '</p>');
      console.log(tasks);
    }
  });
}
