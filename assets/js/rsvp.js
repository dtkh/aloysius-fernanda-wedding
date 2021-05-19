const readClient = contentful.createClient({
  space: 'sd5z099u9fvf',
  accessToken: 'fb766GmKxuX74--YUMfg53WKw5gXhMAiIs86Xbh59fI'
});

const getEntryVersion = async (entryId) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer CFPAT-OZl2ffWd-A9ak_CJMgkLL5xsfIomeke7Rs_dcbOPmM8");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  let version = await fetch("https://api.contentful.com/spaces/sd5z099u9fvf/environments/master/entries/" + entryId, requestOptions)
    .then(response => response.json())
    .then(result => {
      return result.sys.version;
    });

  return version;
}

const updateEntry = (payload) => {
  payload.forEach((guest) => {
    getEntryVersion(guest.id)
      .then((version) => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer CFPAT-OZl2ffWd-A9ak_CJMgkLL5xsfIomeke7Rs_dcbOPmM8");
        myHeaders.append("Content-Type", "application/vnd.contentful.management.v1+json");
        myHeaders.append("X-Contentful-Version", version);

        let data = {fields: {}};

        for (const [key, value] of Object.entries(guest)) {
          if (key !== 'id') {
            data.fields[key] = {
              'en-US': value
            };
          }
        }

        let body = JSON.stringify(data);

        let requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: body,
          redirect: 'follow'
        };

        fetch("https://api.contentful.com/spaces/sd5z099u9fvf/environments/master/entries/" + guest.id, requestOptions)
          .then(response => response.json())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      });
  });
}

const createGuestCheckbox = (payload) => {
  let checkboxContainer = document.getElementById('form-step-2-checkboxes');
  checkboxContainer.innerHTML = '';

  payload.forEach((entry, index) => {
    checkboxContainer.append(createGuestCheckboxHelper(entry, index));
  });
}

const createGuestCheckboxHelper = (guest, index) => {
  let div = document.createElement('div');
  div.classList.add('form-group', 'form-checkbox');

  let input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('name', 'guests');
  input.setAttribute('data-index', index);
  input.setAttribute('id', 'guestCheckbox-' + index);
  input.classList.add('guests-checkbox');

  if (guest.coming) {
    input.setAttribute('checked', 'checked');
  }

  let label = document.createElement('label');
  label.setAttribute('for', 'guestCheckbox-' + index);
  label.innerHTML = guest.name;

  div.append(input, label);

  return div;
}

const createGuestFieldset = (guest, index) => {
  let fieldset = document.createElement('fieldset');
  let legend = document.createElement('legend');
  legend.innerHTML = guest.name;
  fieldset.append(legend);

  let p = document.createElement('p');
  p.innerHTML = 'Chicken or fish?';
  fieldset.append(p);

  let divChicken = document.createElement('div');
  divChicken.classList.add('form-group', 'form-radio');

  let inputChicken = document.createElement('input');
  inputChicken.setAttribute('type', 'radio');
  inputChicken.setAttribute('name', 'chicken-fish-' + index);
  inputChicken.setAttribute('value', 'chicken');
  inputChicken.setAttribute('id', 'chicken-' + index);
  inputChicken.setAttribute('required', 'required');
  divChicken.append(inputChicken);

  let labelChicken = document.createElement('label');
  labelChicken.setAttribute('for', 'chicken-' + index);
  labelChicken.innerHTML = 'Chicken';
  divChicken.append(labelChicken);

  fieldset.append(divChicken);

  let divFish = document.createElement('div');
  divFish.classList.add('form-group', 'form-radio');

  let inputFish = document.createElement('input');
  inputFish.setAttribute('type', 'radio');
  inputFish.setAttribute('name', 'chicken-fish-' + index);
  inputFish.setAttribute('value', 'fish');
  inputFish.setAttribute('id', 'fish-' + index);
  inputFish.setAttribute('required', 'required');
  divFish.append(inputFish);

  let labelFish = document.createElement('label');
  labelFish.setAttribute('for', 'fish-' + index);
  labelFish.innerHTML = 'Fish';
  divFish.append(labelFish);

  fieldset.append(divFish);

  let divAllergies = document.createElement('div');
  divAllergies.classList.add('form-group');

  let labelAllergies = document.createElement('label');
  labelAllergies.setAttribute('for', 'allergies-' + index);
  labelAllergies.innerHTML = 'Any weaknesses?';
  divAllergies.append(labelAllergies);

  let textareaAllergies = document.createElement('textarea');
  textareaAllergies.setAttribute('row', '3');
  textareaAllergies.setAttribute('col', 3);
  textareaAllergies.setAttribute('name', 'allergies-' + index);
  textareaAllergies.setAttribute('id', 'allergies-' + index);
  divAllergies.append(textareaAllergies);

  fieldset.append(divAllergies);

  document.getElementById('form-step-3').append(fieldset);
}

const toggleSpinner = (text) => {
  if (!text) {
    document.querySelector('#rsvp-form button[type="submit"] span').innerHTML = '';
    document.querySelector('#rsvp-form button[type="submit"] svg').style.display = 'inline';
  } else {
    document.querySelector('#rsvp-form button[type="submit"] span').innerHTML = text;
    document.querySelector('#rsvp-form button[type="submit"] svg').style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let form = document.getElementById('rsvp-form');

  let payload = [];

  document.getElementById('back-btn').addEventListener('click', () => {
    let step = form.getAttribute('data-step') - 1;
    form.setAttribute('data-step', step.toString());

    if (step === 1) {
      document.getElementById('back-btn').style.visibility = 'hidden';
      payload = [];
    } else if (step === 2) {
      document.getElementById('form-step-3').innerHTML = '';
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    switch (form.getAttribute('data-step')) {
      case '1':
        document.getElementById('back-btn').style.visibility = 'hidden';

        if (event.target.querySelector('#phone').value) {
          toggleSpinner();

          readClient.getEntries({
            'fields.phone': event.target.querySelector('#phone').value,
            'content_type': 'guest'
          })
            .then((entries) => {
              if (!entries.items.length) {
                toggleSpinner('Halt! Who goes there?');
              } else {
                // There should only be one entry due to unique phone number
                let entry = entries.items[0];
                entry.fields.coming = true;
                entry.fields.id = entries.items[0].sys.id;

                payload.push(entry.fields);

                // Find other guests in the same group
                readClient.getEntries({
                  'fields.group': entry.group,
                  'content_type': 'guest'
                })
                  .then((entries) => {
                    if (!entries.items.length) {
                      // Skip to step 3
                      form.setAttribute('data-step', '3');
                    } else {
                      entries.items.forEach(function (entry) {
                        if (entry.fields.phone === payload[0].phone) {
                          return;
                        } else {
                          entry.fields.id = entry.sys.id;
                          payload.push(entry.fields);
                        }
                      });

                      for (let el of document.getElementsByClassName('main-guest-name')) {
                        el.innerHTML = payload[0].name;
                      }

                      createGuestCheckbox(payload);
                      form.setAttribute('data-step', '2');
                      document.getElementById('back-btn').style.visibility = 'visible';
                      toggleSpinner('Leggo!');
                    }
                  });
              }
            });
        }
        break;
      case '2':
        let checkboxes = document.getElementsByClassName('guests-checkbox');
        let guests = [];

        document.getElementById('form-step-3').innerHTML = '';

        for (let checkbox of checkboxes) {
          let index = checkbox.getAttribute('data-index');

          if (!checkbox.checked) {
            payload[index].coming = false;
          } else {
            payload[index].coming = true;

            // Create the fieldset for each guest
            createGuestFieldset(payload[index], index);
            form.setAttribute('data-step', '3');
            document.getElementById('back-btn').style.visibility = 'visible';

            toggleSpinner('Double confirm!');
          }
        }
        break;
      case '3':
        toggleSpinner('');
        payload.forEach((guest, index) => {
          if (!guest.coming) {
            return;
          }

          // Get the guest's choice of chicken or fish
          payload[index].dietaryPreference = document.querySelector('#form-step-3 input[name="chicken-fish-' + index + '"]:checked').value;

          // Get the guest's allergies
          payload[index].allergies = document.querySelector('#form-step-3 textarea[name="allergies-' + index + '"]').value;
        });

        updateEntry(payload);
        break;
    }
  });
});