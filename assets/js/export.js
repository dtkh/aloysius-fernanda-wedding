const readClient = contentful.createClient({
  space: 'sd5z099u9fvf',
  accessToken: 'fb766GmKxuX74--YUMfg53WKw5gXhMAiIs86Xbh59fI'
});

function formatDate() {
  var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

const exportEntries = async () => {
  readClient.getEntries({
    'content_type': 'guest',
    'limit': 300
  })
    .then(response => {
      const entries = response.items;
      const rows = [['group', 'name', 'phone', 'coming', 'food choice', 'allergies']];

      for (let entry of entries) {
        let coming = 'no';
        if (entry.fields.coming) {
          coming = 'yes';
        }

        rows.push([entry.fields.group, entry.fields.name, entry.fields.phone, coming, entry.fields.dietaryPreference, entry.fields.allergies]);
      }

      let csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(",")).join("\n");

      const today = formatDate();

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "guestlist_" + today + ".csv");
      document.body.appendChild(link); // Required for FF

      link.click(); // This will download the data file named "my_data.csv".

    });
}

exportEntries();