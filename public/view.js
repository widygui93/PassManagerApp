let masterPass = '';
const viewPass = () => {
    masterPass = document.getElementById('inputMasterPassword').value;
    if (masterPass) {
        fetch('http://localhost:3000/list')
            .then((response) => response.text())
            .then((data) => {
                const objPass = JSON.parse(data);

                try {
                    sjcl.decrypt(masterPass, objPass[0].password);
                    for (let x = 0; x < objPass.length; x++) {
                        createItemPassData(
                            objPass[x].name,
                            objPass[x].username,
                            objPass[x].password,
                            objPass[x].notes
                        );
                    }
                } catch (error) {
                    console.log(error);
                    alert('Master Password is incorrect');
                }
            });
    } else {
        alert('Master password is mandatory');
    }
};

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
    inputPass.value = sjcl.decrypt(masterPass, password);
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

const peekPass = (btnPeek) => {
    btnPeek.previousElementSibling.setAttribute('type', 'text');
};

const hidePass = (btnPeek) => {
    btnPeek.previousElementSibling.setAttribute('type', 'password');
};
