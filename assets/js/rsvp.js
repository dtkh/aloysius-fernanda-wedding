let guests = JSON.parse('{"96608646": {"name": "Daryl","others": [{"name": "Colleen","phone": 88786469}, {"name": "Lydia","phone": 82345678}]},"91234567": {"name": "Alphonsus","others": [{"name": "Geraldine","phone": 98765432}]}}');

const validatePhone = (phoneNumber) => {
  return guests[phoneNumber] || false;
}

const createGuestCheckbox = (mainGuest) => {
  let checkboxContainer = document.getElementById('form-step-2-checkboxes');
  checkboxContainer.innerHTML = '';

  checkboxContainer.append(createGuestCheckboxHelper(mainGuest, true));
  for (let subGuest of mainGuest.others) {
    checkboxContainer.append(createGuestCheckboxHelper(subGuest));
  }
}

const createGuestCheckboxHelper = (guest, isMainGuest = false) => {
  let div = document.createElement('div');
  div.classList.add('form-group', 'form-checkbox');

  let input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('name', 'guests');
  input.setAttribute('value', guest.name);
  input.setAttribute('id', 'guest-' + guest.name);

  if ( isMainGuest ) {
    input.setAttribute('checked', 'checked');
  }

  let label = document.createElement('label');
  label.setAttribute('for', 'guest-' + guest.name);
  label.innerHTML = guest.name;

  div.append(input, label);
  
  return div;
}

const createGuestFieldset = () => {

}

document.addEventListener('DOMContentLoaded', () => {
  let form = document.getElementById('rsvp-form');

  // Formdata to be submitted to the server
  let formdata = [];

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    switch (form.getAttribute('data-step')) {
      case '1':
        let mainGuest = validatePhone(event.target.querySelector('#phone').value);
        if (mainGuest) {

          // Add main guest to the formdata
          formdata.push({
            name: mainGuest.name,
            phone: mainGuest.phone
          })

          for (let el of document.getElementsByClassName('main-guest-name')) {
            el.innerHTML = mainGuest.name;
          }

          createGuestCheckbox(mainGuest);

          if (mainGuest.others.length) {
            form.setAttribute('data-step', '2');
          } else {
            form.setAttribute('data-step', '3');
          }
        }
        break;
      case '2':
        let confirmedGuests = document.querySelector('#form-step-2 .guests').checked;
        console.log(confirmedGuests);
        break;
    }
  });
});