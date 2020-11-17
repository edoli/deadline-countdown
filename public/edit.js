
const root = $('.container-fluid');
const specialTzs = {
	'GMT': 'GMT',
	'UTC': 'UTC',
	'PST': 'America/Los_Angeles'
};
const tzs = moment.tz.names();
const tzSelect = `
<select name="tz-select" class="tz-select">
    <optgroup label="standard times">
      <option value="">Local</option>
      <option value="GMT">GMT</option>
      <option value="UTC">UTC</option>
      <option value="America/Los_Angeles">PST</option>
    </optgroup>
    <optgroup label="timezones">
      ${tzs.map((name) => `<option value="${name}">${name}</option>`)}
    </optgroup>
</select>
`;

function update(id) {
    const elem = $(`#${id}`);
    const newId = elem.find('.input-id').val();
    const newName = elem.find('.input-name').val();
    const newDate = elem.find('.input-date').val();

    const data = {
        id: newId,
        name: newName,
        date: newDate
    };
    $.post('/schedules/update', data, () => {
        location.reload();
    });
}

function remove(id) {
    const data = {
        id: id
    };
    $.post('/schedules/delete', data, () => {
        location.reload();
    });
}


const countDownTimer = (id, name, date) => {
    if (date) {
        date = new Date(date + 'Z').toISOString();
        date = date.substring(0, date.length-1);
    }
    root.append(`
<div id="${id}" class="schedule-item">
    <input class="input-id" type="text" readonly value="${id}">
    <input class="input-name" type="text" value="${name}">
    <input class="input-date" type="datetime-local" value="${date}">
    <button onclick="update(\'${id}\')">Update</button>
    <button onclick="remove(\'${id}\')">Delete</button>

    ${tzSelect} 
    <div class="timezone"></div>
</div>
    `);
    let tzText = root.find(`#${id} .timezone`);
    root.find(`#${id} .tz-select`).change((value) => {
	    let tz = value.target.value;
	    if (tz != '') {
	      tzText.text(moment(date).tz(tz).format());
	    } else {
	      tzText.text(moment(date).format());
	    }
    });
}

$.get('/schedules/get', (res) => {
    root.empty();
    res.result.forEach((schedule) => {
        const { id, name, date } = schedule;
        countDownTimer(id, name, date);
    });
    root.append(`
    <div height="32px"></div>
    <hr/>
    <div height="32px">New schedule</div>`);
    
    root.append(`
<div id="New" class="schedule-item">
    <input class="input-id" type="text">
    <input class="input-name" type="text">
    <input class="input-date" type="datetime-local">
    <button onclick="update(\'New\')">Create</button>
</div>
    `);
});
