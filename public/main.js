var wsUrl = 'ws://' + location.hostname + ':' + location.port + '/updates';
var socket = new WebSocket(wsUrl);
socket.onmessage = function(event) {
  var msg = JSON.parse(event.data);
  if (msg.type == 'render') {
    // update render progress
  }
  if (msg.type == 'status') {
    // update GPU status
    updateToolBarStatus(msg.data);
  }
}

function updateToolBarStatus(status) {
  document.querySelector('#queuedTask').textContent = status.queuedTasks;
  document.querySelector('#utilization').textContent = status.gpus[0].utilization;
  document.querySelector('#temperature').textContent = status.gpus[0].temperature;
  document.querySelector('#power').textContent = status.gpus[0].power;
}

var variableOptions = [
  'content_weight',
  'style_weight',
  'style_scale',
  'learning_rate',
  'tv_weight'
];

var variablesFieldset = document.querySelector('.variables');
var template = document.querySelector('.variables > script[type="x/template"]').innerHTML;
variableOptions.forEach( function(optionName) {
  var field = Mustache.render(template, {option: optionName});
  var fragment = document.createRange().createContextualFragment(field);
  variablesFieldset.appendChild(fragment);
});

function addMoreFields(e) {
  var optionName = e.currentTarget.dataset.option;
  var fieldContainer = document.querySelector('.field-container.'+optionName);
  var clone = fieldContainer.querySelector('input[data-option="'+optionName+'"]').cloneNode();
  clone.value = '';
  fieldContainer.appendChild(clone);
}
