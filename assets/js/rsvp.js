const readClient = contentful.createClient({
  space: 'sd5z099u9fvf',
  accessToken: 'fb766GmKxuX74--YUMfg53WKw5gXhMAiIs86Xbh59fI'
});

function splitArrayToChunks(arr, size) {
  var myArray = [];
  for (var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
}

const getEntryVersion = async (guest) => {
  const entryId = guest.id;

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
      return {
        guest: guest,
        version: result.sys.version
      }
    });

  return version;
}

const submitPayload = async (payload) => {
  const payloadChunks = splitArrayToChunks(payload, 2);

  for (let i = 0; i < payloadChunks.length; i++) {
    await updateEntry(payloadChunks[i]);
    setTimeout(() => {}, 1000);
  }

  return Promise.resolve(true);
}

const updateEntry = (payload) => {
  let promises = [];

  payload.forEach((guest) => {
    promises.push(getEntryVersion(guest));
  });

  return Promise.all(promises)
    .then((responses) => {
      promises = [];

      responses.forEach((response) => {
        const version = response.version;
        const guest = response.guest;

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer CFPAT-OZl2ffWd-A9ak_CJMgkLL5xsfIomeke7Rs_dcbOPmM8");
        myHeaders.append("Content-Type", "application/vnd.contentful.management.v1+json");
        myHeaders.append("X-Contentful-Version", version);

        let data = { fields: {} };

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

        promises.push(fetch('https://api.contentful.com/spaces/sd5z099u9fvf/environments/master/entries/' + guest.id, requestOptions));
      });

      return Promise.all(promises)
        .then((responses) => {

          // Publish the entries at the background
          payload.forEach((guest) => {
            getEntryVersion(guest)
              .then((response) => {
                const version = response.version;

                let myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer CFPAT-OZl2ffWd-A9ak_CJMgkLL5xsfIomeke7Rs_dcbOPmM8");
                myHeaders.append("Content-Type", "application/vnd.contentful.management.v1+json");
                myHeaders.append("X-Contentful-Version", version);

                let requestOptions = {
                  method: 'PUT',
                  headers: myHeaders,
                  redirect: 'follow'
                };

                fetch('https://api.contentful.com/spaces/sd5z099u9fvf/environments/master/entries/' + guest.id + '/published', requestOptions);
              });
          });

          return responses;
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

  if (guest.dietaryPreference === 'chicken') {
    inputChicken.checked = true;
  }

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

  if (guest.dietaryPreference === 'fish') {
    inputFish.checked = true;
  }

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
  textareaAllergies.setAttribute('placeholder', 'Allergies');

  if (guest.allergies) {
    textareaAllergies.value = guest.allergies;
  }

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
      toggleSpinner('Find me!');
      payload = [];
    } else if (step === 2) {
      document.getElementById('form-step-3').innerHTML = '';
      toggleSpinner('Confirm!');
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    toggleSpinner();

    switch (form.getAttribute('data-step')) {
      case '1':
        document.getElementById('back-btn').style.visibility = 'hidden';

        if (event.target.querySelector('#phone').value) {
          readClient.getEntries({
            'fields.phone': event.target.querySelector('#phone').value,
            'content_type': 'guest'
          })
            .then((entries) => {
              if (!entries.items.length) {
                toggleSpinner('Oops, wrong number?');
              } else {
                // There should only be one entry due to unique phone number
                let entry = entries.items[0];
                entry.fields.coming = true;
                entry.fields.id = entries.items[0].sys.id;

                payload.push(entry.fields);

                // Find other guests in the same group
                readClient.getEntries({
                  'fields.group': entry.fields.group,
                  'content_type': 'guest'
                })
                  .then((entries) => {
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
                    toggleSpinner('Confirm!');
                  });
              }
            });
        }
        break;
      case '2':
        let checkboxes = document.getElementsByClassName('guests-checkbox');

        document.getElementById('form-step-3').innerHTML = '';

        let atLeastOneComing = false;
        for (let checkbox of checkboxes) {
          let index = checkbox.getAttribute('data-index');

          if (!checkbox.checked) {
            payload[index].coming = false;
          } else {
            payload[index].coming = true;
            atLeastOneComing = true;

            // Create the fieldset for each guest
            createGuestFieldset(payload[index], index);
          }
        }

        if (atLeastOneComing) {
          form.setAttribute('data-step', '3');
          toggleSpinner('Double confirm!');
        } else {
          updateEntry(payload)
            .then(() => {
              form.setAttribute('data-step', '4');
              document.getElementById('back-btn').style.visibility = 'hidden';
              document.getElementById('submit-btn').style.visibility = 'hidden';
            });
        }
        break;
      case '3':
        payload.forEach((guest, index) => {
          if (!guest.coming) {
            return;
          }

          // Get the guest's choice of chicken or fish
          payload[index].dietaryPreference = document.querySelector('#form-step-3 input[name="chicken-fish-' + index + '"]:checked').value;

          // Get the guest's allergies
          payload[index].allergies = document.querySelector('#form-step-3 textarea[name="allergies-' + index + '"]').value;
        });

        submitPayload(payload)
          .then(() => {
            form.setAttribute('data-step', '4');
            document.getElementById('back-btn').style.visibility = 'hidden';
            document.getElementById('submit-btn').style.visibility = 'hidden';
          });
        break;
    }
  });
});