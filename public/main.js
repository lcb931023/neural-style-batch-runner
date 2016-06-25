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

document.querySelector(".start").onclick = function start(e) {
  var form = document.querySelector(".panel form");
  // TODO Validate that fields have content or selections

  // Upload images
  uploadStatus.domElement.innerText = "Uploading...";
  var contentFileList = form.elements["content_image"].files;
  var styleFileList = form.elements["style_image"].files;
  uploadStatus.fileCount = 1 + styleFileList.length;
  // TODO id should be kept at a better place?
  var id = Math.round(Math.random() * Math.pow(10, 16));

  var args = [[contentFileList[0], id, "content_image", 0]];
  for (var i = 0; i < styleFileList.length; i++) {
    args.push([styleFileList[i], id, "style_image", i]);
  }
  doasync(uploadImage, args, function(){
    // TODO invoke the final ajax call here
  });
}

/**
 * From Michael; Simple replication of caolan's async module
 * Runs function for each arguments, and executes done when they all finish
 */
var doasync = function(func, arr, done) {
  var limit = arr.length;
  var i = 0;
  function count() {
    limit -= 1;
    if (limit === 0) {
      return done();
    }
  }
  for(; i < arr.length; i++) {
    arr[i].push(count);
    func.apply(null, arr[i]);
  }
}

var uploadStatus = {
  fileCount: 0,
  finishedCount: 0,
  update: function () {
    this.finishedCount ++;
    this.domElement.innerText = "Uploading... " + this.finishedCount + "/" + this.fileCount;
    this.check();
  },
  check: function () {
    if (this.finishedCount == this.fileCount) {
      this.domElement.innerText = "Done!";
      setTimeout(function(){
        this.domElement.innerText = "";
      }.bind(this), 1000);
      this.finishedCount = 0;
      this.fileCount = 0;
      return true;
    }
    return false;
  },
  domElement: document.querySelector('.panel .upload-status')
}

function uploadImage(file, id, purpose, index, callback) {
  var xhr = new XMLHttpRequest();
  // When upload's done?
  xhr.addEventListener('load', function(event) {
    uploadStatus.update();
    callback();
  }.bind(this), false);
  xhr.open('POST', '/upload/' + id + '/' + purpose + '/' + index);
  xhr.setRequestHeader('Content-Type', 'application/octet-stream');
  var reader = new FileReader();
  reader.onload = function(event) {
    xhr.send(event.target.result);
  };
  reader.readAsArrayBuffer(file);
}

function sendRender(id, settings) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/render/' + id);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(settings));
}



function handleFileChange(e) {
  var previewHolder = document.querySelector('.preview.'+e.target.id);
  previewHolder.innerHTML = "";
  for (var i = 0; i < e.target.files.length; i++) {
    var reader = new FileReader();
    reader.onload = function(event) {
      var image = new Image(100, 100);
      image.src = event.target.result;
      previewHolder.appendChild(image);
    };
    reader.readAsDataURL(e.target.files[i]);
  }
}

document.querySelector('#content_image').onchange = handleFileChange;
document.querySelector('#style_image').onchange = handleFileChange;
