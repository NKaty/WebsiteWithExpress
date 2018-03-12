function getName(input) {
  var span = document.getElementById('form-upload-span');
  span.innerHTML = input.files[0].name;
}
