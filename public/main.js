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


function renderFields(options, fieldset){

  function addMoreFields(e) {
    var optionName = e.currentTarget.dataset.option;
    var field = fieldset.querySelector('.field[data-option='+optionName+']');
    var clone = field.cloneNode(true);
    clone.value = '';
    var fragment = document.createDocumentFragment();
    fragment.appendChild(clone);
    // Add remove button
    var removeButtonHTML = document.querySelector('#template-remove-button').innerHTML;
    var removeButtonFragment = document.createRange().createContextualFragment(removeButtonHTML);
    removeButtonFragment.firstElementChild.onclick = function removeField(e){
      var parent = clone.parentElement;
      parent.removeChild(clone);
      parent.removeChild(this);
    }
    field.parentElement.appendChild(clone);
    field.parentElement.appendChild(removeButtonFragment);
    clone.focus();
  }

  var template = fieldset.querySelector('script[type="x/template"]').innerHTML;
  options.forEach( function(optionName) {
    var fieldHTML = Mustache.render(template, {option: optionName});
    var fragment = document.createRange().createContextualFragment(fieldHTML);
    var addButton = fragment.querySelector('.add-more-fields');
    if (addButton) {
      addButton.onclick = addMoreFields;
    }
    fieldset.appendChild(fragment);
  });
}

renderFields(variableOptions, document.querySelector('.variables'));
renderFields(choiceOptions, document.querySelector('.choices'));
renderFields(flagsOptions, document.querySelector('.flags'));
