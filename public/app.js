let name,
    username,
    password,
    notes = '';

let btnSubmit;
document.getElementById('btn-add').addEventListener('click', () => {
    name = document.getElementById('inputName').value;
    username = document.getElementById('inputUserName').value;
    password = document.getElementById('inputPassword').value;
    notes = document.getElementById('inputNotes').value;

    if (name === '' || username === '' || password === '') {
        alert('name, username and password can not empty');
    } else {
        createItemPassData(name, username, password, notes);

        btnSubmit = document.getElementById('btn-submit');
        if (btnSubmit === null) createButtonSubmit();
    }
});

let divDataPass,
    listGroup,
    itemName,
    itemUsername,
    itemPass,
    inputPass,
    spanPeekPass,
    itemNotes;
const createItemPassData = (name, username, password, notes) => {
    divDataPass = document.createElement('div');
    divDataPass.className = 'pass-data mt-3';

    listGroup = document.createElement('ul');
    listGroup.className = 'list-group';

    itemName = document.createElement('li');
    itemName.className = 'list-group-item';
    itemName.textContent = name;

    itemUsername = document.createElement('li');
    itemUsername.className = 'list-group-item';
    itemUsername.textContent = username;

    itemPass = document.createElement('li');
    itemPass.className = 'list-group-item';
    inputPass = document.createElement('input');
    inputPass.setAttribute('type', 'password');
    inputPass.value = password;
    spanPeekPass = document.createElement('span');
    spanPeekPass.className = 'badge bg-dark peek-pass';
    spanPeekPass.setAttribute('role', 'button');
    spanPeekPass.setAttribute('onmousedown', 'peekPass(this)');
    spanPeekPass.setAttribute('onmouseup', 'hidePass(this)');
    spanPeekPass.textContent = 'Peek';

    if (notes !== '') {
        itemNotes = document.createElement('li');
        itemNotes.className = 'list-group-item';
        itemNotes.textContent = notes;
    }

    itemPass.appendChild(inputPass);
    itemPass.appendChild(spanPeekPass);

    listGroup.appendChild(itemName);
    listGroup.appendChild(itemUsername);
    listGroup.appendChild(itemPass);

    if (notes !== '') listGroup.appendChild(itemNotes);

    divDataPass.appendChild(listGroup);

    listPass = document.getElementsByClassName('list-pass')[0];
    listPass.insertBefore(divDataPass, listPass.children[0]);
};

let listPass;
const createButtonSubmit = () => {
    listPass = document.getElementsByClassName('list-pass')[0];
    btnSubmit = document.createElement('button');
    btnSubmit.id = 'btn-submit';
    btnSubmit.className = 'btn btn-primary mt-3';
    btnSubmit.setAttribute('type', 'submit');
    btnSubmit.setAttribute('name', 'submit');
    btnSubmit.setAttribute('data-bs-toggle', 'modal');
    btnSubmit.setAttribute('data-bs-target', '#exampleModal');
    btnSubmit.textContent = 'Submit';
    listPass.appendChild(btnSubmit);
};

const peekPass = (btnPeek) => {
    btnPeek.previousElementSibling.setAttribute('type', 'text');
};

const hidePass = (btnPeek) => {
    btnPeek.previousElementSibling.setAttribute('type', 'password');
};

let encrypted, decrypted;
let passObjects = [];
let masterPass;

const submitPass = () => {
    masterPass = document.getElementById('master-pass').value;

    if (masterPass === '') {
        alert('master password is mandatory');
    } else {
        passObjects = getPassObjects(masterPass);

        fetch('http://localhost:3000/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(passObjects),
        })
            .then((response) => {
                createAlert(response);
                eliminateModalAfterSubmit();
            })
            .catch((err) => {
                console.error(err);
            });
    }
};

const getPassObjects = (masterPass) => {
    let passObjectsTemp = [];

    let items = document.getElementsByClassName('list-group');

    for (const item of items) {
        if (item.childElementCount == 4) {
            passObjectsTemp.push({
                name: item.childNodes[0].innerHTML,
                username: item.childNodes[1].innerHTML,
                password: sjcl.encrypt(
                    masterPass,
                    item.childNodes[2].childNodes[0].value
                ),
                notes: item.childNodes[3].innerHTML,
            });
        } else {
            passObjectsTemp.push({
                name: item.childNodes[0].innerHTML,
                username: item.childNodes[1].innerHTML,
                password: sjcl.encrypt(
                    masterPass,
                    item.childNodes[2].childNodes[0].value
                ),
            });
        }
    }

    return passObjectsTemp;
};

const eliminateModalAfterSubmit = () => {
    document
        .getElementsByClassName('modal')[0]
        .setAttribute('style', 'display: none;');

    document.body.classList.remove('modal-open');
    document.body.removeAttribute('style');

    document.getElementsByClassName('modal-backdrop')[0].remove();
};

const createAlert = (response) => {
    const nodeDiv = document.createElement('div');
    nodeDiv.className = `
        alert
        ${response.headers.get('typeAlert')}
        alert-dismissible
        fade
        show
        mt-3`;
    nodeDiv.setAttribute('role', 'alert');
    const textnode = document.createTextNode(response.headers.get('note'));
    nodeDiv.appendChild(textnode);
    const nodeBtn = document.createElement('button');
    nodeBtn.className = 'btn-close';
    nodeBtn.setAttribute('type', 'button');
    nodeBtn.setAttribute('data-bs-dismiss', 'alert');
    nodeBtn.setAttribute('aria-label', 'Close');
    nodeDiv.appendChild(nodeBtn);
    document.getElementsByClassName('container')[0].appendChild(nodeDiv);
};
