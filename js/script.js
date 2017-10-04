'use strict';

window.onload = function () {


    var btnAdd = document.querySelector('.btn-add');
    var btnDel = document.querySelector('.btn-del');
    var btnSave = document.querySelector('#btn-save');
    var text = document.querySelector('.enterArea-text');
    var date = document.querySelector('.enterArea-date');
    var notes = document.querySelector('.note');
    var boxForli = document.createElement('ul');
    notes.appendChild(boxForli);


    var ul = [];

    if (localStorage.savedNotes) {
        ul = JSON.parse(localStorage.getItem('savedNotes'));
        visibleArray();
    }

    var upFile = document.forms.fileUpload.children[0];
    upFile.addEventListener('change', uploadFile);

    btnAdd.onclick = addElem;
    btnDel.onclick = clearAll;
    btnSave.onclick = saveFile;


    function saveFile(type) {
        var strJson = JSON.stringify(ul);
        var name = prompt('Enter the name of file', 'file');
        if(name){
            if(ul.length !== 0){
                var a = document.getElementById("a");
                var file = new Blob([strJson], {type: type});
                a.href = URL.createObjectURL(file);
                a.download = name + '.json';
                a.click();
            }
        }
    }

    function uploadFile(e) /* upload file in .json format */ {

        var files = e.target.files;

        for (var i = 0, f; f = files[i]; i++) {

               var reader = new FileReader();

               reader.onload = (function(theFile) {
                   return function(e) {
                       var loadedArrayJson = e.target.result;
                       if(loadedArrayJson.length <= 19){
                           return alert("File is empty");

                       }else{
                           var loadedArray = JSON.parse(loadedArrayJson, function(key, value){
                               return value;
                           });
                           var animationBlock = document.querySelector('.main_body');
                           animationBlock.classList.add('animationON');
                       }

                       for(var j = 0; j < loadedArray.length; j++){
                           ul.splice(ul.length, 0 , loadedArray[j]);

                       }

                       visibleArray();
                       animationBlock.classList.remove('animationON');

                   };
               })(f);
            reader.readAsText(f);
        }
    }

    function addElem() /*add element into array and html-model*/ {
        if ( text.value === '' ){
            alert('You must to wright something');
        }else {
            if ( date.value === '') {
                alert('Please, choose the date');
            } else {

        var obj = {};
        obj.text = text.value;
        obj.date = date.value;
        obj.isCompleated = false;
        ul.push(obj);
        visibleArray();

        text.value = '';
        date.value = '';

        }
        }
    }

    function clearAll() /*delete all items from html-document and array*/ {
        if (confirm('Do you want to clean the TODOlist?')) {
            ul.splice(0);
            visibleArray();
            localStorage.clear();
        }
    }

    function itemDone(i)  /*accept the i number from array[ul] and paint it as done*/ {
        ul[i].isCompleated = !ul[i].isCompleated;
        visibleArray();
    }

    function itemDel(i)  /*accept the i number from array[ul] and delete it */ {
        if (confirm('Are you sure, that you want to delete?')) {
            ul.splice(i, 1);
            visibleArray();
        }
    }

    function visibleArray()  /*painting the html model of notes element*/ {

        boxForli.innerHTML = '';

        for (var i = 0; i < ul.length; i++) {

            var li = document.createElement('li');
            li.classList.add('liElem');


            var divLiElem = document.createElement('div');
            divLiElem.classList.add('divLiElem');

            var btnDone = document.createElement('a');
            btnDone.classList.add('input-done');
            btnDone.onclick = itemDone.bind(null, i);


            var btnDel = document.createElement('a');
            btnDel.classList.add('input-del');
            btnDel.onclick = itemDel.bind(null, i);
            if (ul[i].isCompleated) {
                li.classList.add('textDecor');
            }

            boxForli.appendChild(li);
            li.innerHTML += ul[i].text + '&nbsp' + ul[i].date;


            li.appendChild(divLiElem);
            divLiElem.appendChild(btnDone);
            divLiElem.appendChild(btnDel);

        }
        localStorage.setItem('savedNotes', JSON.stringify(ul));
    }

}

