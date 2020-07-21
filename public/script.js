function pad(num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
}
function padBlank(num, size) {
    var s = num + '';
    while (s.length < size) s = ' ' + s;
    return s;
}

const root = $('.container-fluid');

const countDownTimer = (id, name, date) => {
    root.append(`
<div id="${id}" class="deadline">
    <div class="center row title">
        <div class="col">${name}</div>
    </div>
    <div class="time row">
        <div class="day"></div>:
        <div class="hour"></div>:
        <div class="minute"></div>:
        <div class="second"></div>
    </div>
    <div class="row desc">
        <div class="d1"></div>
        days 
        <div class="d2"></div>
        hours 
        <div class="d3"></div>
        minutes 
        <div class="d4"></div>
        seconds
    </div>
</div>
<hr/>
    `);

    let mDate = moment(date);
    let day_div = $(`#${id} .day`);
    let hour_div = $(`#${id} .hour`);
    let minute_div = $(`#${id} .minute`);
    let second_div = $(`#${id} .second`);

    const showRemain = () => {
        let remain = mDate - moment();
        let days = Math.floor(remain / 1000 / (60 * 60 * 24));
        let hours = Math.floor((remain / 1000 / (60 * 60)) % 24);
        let minutes = Math.floor((remain / 1000 / (60)) % 60);
        let seconds = Math.floor((remain / 1000)  % 60);
        let miliseconds = Math.floor(remain % 1000);
        
        // time_div.text(`${days}:${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`);
        day_div.text(padBlank(days, 3));
        hour_div.text(pad(hours, 2));
        minute_div.text(pad(minutes, 2));
        second_div.text(pad(seconds, 2));

        requestAnimationFrame(showRemain);
    }

    showRemain();
}

function refresh() {
    $.get('/schedules/get', (res) => {
        root.empty();
        res.result.forEach((schedule) => {
            const { id, name, date } = schedule;
            countDownTimer(id, name, date);
        });
    });
}

setInterval(refresh, 1000);

// countDownTimer('cvpr', 'CVPR (추정)', '2020-11-15T04:00Z');
// countDownTimer('siggraph', 'SIGGRAPH (추정)', '2021-01-23T09:00Z');
// countDownTimer('minhkim', '김민혁 교수님 생신', '02/06/2021 00:00 AM');