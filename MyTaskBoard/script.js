window.onload = init;
var notes, myForm, myFormContent, myFormDate, myFormTime, myFormErr, now;

function init() {
    myForm = document.forms.task;
    myFormContent = myForm.content;
    myFormDate = myForm.date;
    myFormTime = myForm.time;
    formReset();
    myFormErr = document.getElementById('formErr');
    getLocalStorage();
    fadeInAll();
    myForm.onsubmit = submitForm;
    myForm.clrbtn.onclick = formReset;
    myForm.dateclrbtn.onclick = () => {
        now = new Date();
        myFormDate.value = dateToValue(now);
    }
    myForm.timeclrbtn.onclick = () => {
        now = new Date();
        myFormTime.value = timeToValue(now);
    }
    myFormContent.addEventListener('input', (e) => {
        while (e.target.scrollHeight > e.target.clientHeight) {
            e.target.setAttribute('rows', parseInt(e.target.getAttribute('rows')) + 1);
        }
    })
}

function getLocalStorage() {
    notes = JSON.parse(localStorage.getItem("session"));
    if (notes == null) {
        notes = [];
    }
    for (let i = 0; i < notes.length; i++) {
        addNote(notes[i].content, notes[i].date, notes[i].time);
    }
}

function setLocalStorage() {
    localStorage.setItem("session", JSON.stringify(notes));
}

function submitForm() {
    var noteObj = {
        content: myFormContent.value,
        date: myFormDate.value,
        time: myFormTime.value
    };
    if (noteObj.date == '') {
        myAlert('Date is empty!');
    } else if (!checkDateValStr(noteObj.date)) {
        myAlert('Date is invalid!');
    } else if (noteObj.time == '') {
        myAlert('Time is empty!')
    } else if (!checkTimeValStr(noteObj.time)) {
        myAlert('Time is invalid!')
    } else if (myFormContent.innerText = '') {
        myAlert('Task description is empty!')
    } else {
        notes.push(noteObj);
        setLocalStorage();
        addNote(noteObj.content, noteObj.date, noteObj.time);
        formReset();
        fadeInAll();
    }
    return false; // do browser input validations without actually submitting
}

function myAlert(str) {
    document.getElementById('addError').querySelector('.modal-body h4').innerHTML = str;
    document.getElementById('alertErrorBtn').click();
}

function fadeInAll() {
    setTimeout(() => {
        var visualNotes = document.querySelectorAll("section > article");
        for (let i = 0; i < visualNotes.length; i++) {
            visualNotes[i].classList.remove('hideme');
        }
    })
}

function addNote(content, date, time) {
    //build note
    var note = document.createElement("article");
    note.classList.add('note');
    note.classList.add('hideme');
    //build trash icon
    var trash = document.createElement("span");
    trash.className = "fas fa-trash-alt";
    trash.onclick = (e) => {
        var thisNote = e.target.parentElement;
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].content == content) { // do if content matches
                notes.splice(i, 1); // remove one array item starting from i
            }
        }
        setLocalStorage();
        thisNote.classList.add('hideme');
        setTimeout((e) => {
            thisNote.parentNode.removeChild(thisNote);
        }, 1000, this); // after transition time remove element from DOM
    };
    //end build trash icon
    //build note content
    var contentElm = document.createElement("section");
    contentElm.className = "content";
    contentElm.innerText = content;
    //end build note content
    //build note details
    var detailsElm = document.createElement("section");
    detailsElm.className = "details";
    var dateElm = document.createElement("p");
    dateElm.innerText = date;
    var timeElm = document.createElement("p");
    timeElm.innerText = time;
    //end build note details
    //append all to note
    detailsElm.appendChild(dateElm);
    detailsElm.appendChild(timeElm);
    note.appendChild(trash);
    note.appendChild(contentElm);
    note.appendChild(detailsElm);
    //end append all to note
    //end build note
    //add freshly built note to notes area
    document.getElementById("notesArea").appendChild(note);
}

function dateToValue(date) {
    var str = '';
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var sap = '/';
    str =
        ('0' + day).slice(-2) +
        sap +
        ('0' + month).slice(-2) +
        sap +
        ('000' + year).slice(-4);
    return str;
}

function timeToValue(date) {
    var str = '';
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var sap = ':';
    str =
        ('0' + hours).slice(-2) +
        sap +
        ('0' + minutes).slice(-2);
    return str;
}

function checkDateValStr(str) {
    var pattern =
        /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
    return pattern.test(str);
}

function checkTimeValStr(str) {
    var pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return pattern.test(str);
}

function formReset() {
    now = new Date();
    myFormDate.value = dateToValue(now);
    myFormTime.value = timeToValue(now);
    myFormContent.value = '';
    myFormContent.setAttribute('rows', 4);
}