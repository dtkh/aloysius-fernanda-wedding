let guests = JSON.parse('{"96608646": {"name": "Daryl","phone":"96608646","others": [{"name": "Colleen","phone": 88786469}, {"name": "Lydia","phone": 82345678}]},"91234567": {"name": "Alphonsus","phone":"91234567","others": [{"name": "Geraldine","phone": 98765432}]}}');

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
  input.setAttribute('data-name', guest.name);
  input.setAttribute('data-phone', guest.phone);
  input.classList.add('guests-checkbox');

  if ( isMainGuest ) {
    input.setAttribute('checked', 'checked');
  }

  let label = document.createElement('label');
  label.setAttribute('for', 'guest-' + guest.name);
  label.innerHTML = guest.name;

  div.append(input, label);
  
  return div;
}

const createGuestFieldset = (name, phone) => {
  let fieldset = document.createElement('fieldset');
  let legend = document.createElement('legend');
  legend.innerHTML = name;
  fieldset.append(legend);

  let p = document.createElement('p');
  p.innerHTML = 'Chicken or fish?';
  fieldset.append(p);

  let divChicken = document.createElement('div');
  divChicken.classList.add('form-group', 'form-radio');

  let inputChicken = document.createElement('input');
  inputChicken.setAttribute('type', 'radio');
  inputChicken.setAttribute('name', 'chicken-fish-' + phone);
  inputChicken.setAttribute('value', 'chicken');
  inputChicken.setAttribute('id', 'chicken-' + phone);
  divChicken.append(inputChicken);

  let labelChicken = document.createElement('label');
  labelChicken.setAttribute('for', 'chicken-' + phone);
  labelChicken.innerHTML = 'Chicken';
  divChicken.append(labelChicken);

  fieldset.append(divChicken);

  let divFish = document.createElement('div');
  divFish.classList.add('form-group', 'form-radio');

  let inputFish = document.createElement('input');
  inputFish.setAttribute('type', 'radio');
  inputFish.setAttribute('name', 'chicken-fish-'  + phone);
  inputFish.setAttribute('value', 'fish');
  inputFish.setAttribute('id', 'fish-' + phone);
  divFish.append(inputFish);

  let labelFish = document.createElement('label');
  labelFish.setAttribute('for', 'fish-' + phone);
  labelFish.innerHTML = 'Fish';
  divFish.append(labelFish);

  fieldset.append(divFish);

  let divAllergies = document.createElement('div');
  divAllergies.classList.add('form-group');

  let labelAllergies = document.createElement('label');
  labelAllergies.setAttribute('for', 'allergies-' + phone);
  labelAllergies.innerHTML = 'Any weaknesses?';
  divAllergies.append(labelAllergies);

  let textareaAllergies = document.createElement('textarea');
  textareaAllergies.setAttribute('row', '3');
  textareaAllergies.setAttribute('col', 3);
  textareaAllergies.setAttribute('name', 'allergies-' + phone);
  textareaAllergies.setAttribute('id', 'allergies-' + phone);
  divAllergies.append(textareaAllergies);

  fieldset.append(divAllergies);

  document.getElementById('form-step-3').append(fieldset);
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
        let checkboxes = document.getElementsByClassName('guests-checkbox');
        let guests = [];

        for (let checkbox of checkboxes) {
          if (checkbox.checked) {
            // Create the fieldset for each guest
            createGuestFieldset(checkbox.getAttribute('data-name'), checkbox.getAttribute('data-phone'));
            form.setAttribute('data-step', '3');
          }
        }

        break;
    }
  });
});