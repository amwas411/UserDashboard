"use strict";
;
;
;
;
const BASE_URL = document.location.origin;
const USER_COLLECTION_NAME = "users";
const BOOL_VALUES_MAP = new Map([["on", true], [null, false]]);
const USER_DIALOG_MODES = {
    UNSET: 0,
    CREATE: 1,
    UPDATE: 2
};
const COLUMN_TYPES = {
    TEXT: 1,
    BOOL: 2
};
const USER_TABLE_COLUMNS = [
    {
        name: "id",
        type: COLUMN_TYPES.BOOL,
        caption: "Id",
    },
    {
        name: "name",
        type: COLUMN_TYPES.TEXT,
        caption: "Пользователь",
    },
    {
        name: "contact.name",
        type: COLUMN_TYPES.TEXT,
        caption: "Контакт",
    },
    {
        name: "active",
        type: COLUMN_TYPES.BOOL,
        caption: "Активен",
    },
    {
        name: "userPassword",
        type: COLUMN_TYPES.TEXT,
        caption: "Пароль",
    }
];
const EXCLUDED_TABLE_COLUMN_NAMES = ["userPassword"];
const EXCLUDED_DIALOG_COLUMN_NAMES = ["id"];
const USER_TABLE_ID = "output-table";
const USER_DIALOG_ID = "user-dialog";
const SEARCH_BUTTON_ID = "search-button";
const ADD_BUTTON_ID = "add-button";
const DIALOG_CLOSE_BUTTON_ID = "dialog-close-btn";
const DIALOG_OK_BUTTON_ID = "dialog-ok-btn";
let updatingUserId = "";
let userDialogMode = USER_DIALOG_MODES.UNSET;
window.addEventListener("load", () => {
    let dialog = document.getElementById(USER_DIALOG_ID);
    let searchBtn = document.getElementById(SEARCH_BUTTON_ID);
    let addBtn = document.getElementById(ADD_BUTTON_ID);
    let dialogCloseBtn = document.getElementById(DIALOG_CLOSE_BUTTON_ID);
    let dialogOkBtn = document.getElementById(DIALOG_OK_BUTTON_ID);
    if (!dialog) {
        throw new Error(`Required element ${USER_DIALOG_ID} not found`);
    }
    if (!searchBtn) {
        throw new Error(`Required element ${SEARCH_BUTTON_ID} not found`);
    }
    if (!addBtn) {
        throw new Error(`Required element ${ADD_BUTTON_ID} not found`);
    }
    if (!dialogCloseBtn) {
        throw new Error(`Required element ${DIALOG_CLOSE_BUTTON_ID} not found`);
    }
    if (!dialogOkBtn) {
        throw new Error(`Required element ${DIALOG_OK_BUTTON_ID} not found`);
    }
    dialog.classList.add("hidden");
    searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        getUsers();
    });
    addBtn.addEventListener("click", () => {
        userDialogMode = USER_DIALOG_MODES.CREATE;
        showDialog(USER_DIALOG_ID);
    });
    dialogCloseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        setDialogVisible(USER_DIALOG_ID, false);
        updatingUserId = "";
    });
    dialogOkBtn.addEventListener("click", (e) => {
        e.preventDefault();
        switch (userDialogMode) {
            case USER_DIALOG_MODES.CREATE:
                createUser();
                break;
            case USER_DIALOG_MODES.UPDATE:
                updateUser();
                break;
            default:
                throw new Error(`Unknown user dialog mode: ${userDialogMode}`);
        }
    });
});
function getUserPostPayload(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        throw new Error(`#${formId} not found`);
    }
    let payload = {};
    let formData = new FormData(form);
    for (const [key, v] of formData) {
        let value = v;
        if (value !== "" && value !== null) {
            if (key.indexOf(".") > 0) {
                let path = key.split(".", 2);
                if (!path.every(part => part !== "")) {
                    throw new Error(`Path part is invalid`);
                }
                payload[path[0]] = {};
                payload[path[0]][path[1]] = value;
            }
            else {
                payload[key] = value;
            }
        }
    }
    payload.active = BOOL_VALUES_MAP.get(formData.get("active"));
    return payload;
}
async function createUser() {
    let response = await fetch(`${BASE_URL}/${USER_COLLECTION_NAME}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(getUserPostPayload("user-form")),
    }).catch((reason) => console.error(reason));
    if (!response || response.status < 200 || response.status > 299) {
        alert("Error occured. See console.");
    }
    else {
        setDialogVisible(USER_DIALOG_ID, false);
    }
}
async function getUsers() {
    let formId = "search-form";
    const form = document.getElementById(formId);
    if (form === null) {
        throw new Error(`Element with id = ${formId} not found`);
    }
    let params = "";
    let hasParameters = false;
    for (const [key, value] of new FormData(form)) {
        if (value !== "") {
            hasParameters = true;
            params += `${key}=${value}&`;
        }
    }
    if (!hasParameters) {
        createUsersTable(await fetch(`${BASE_URL}/${USER_COLLECTION_NAME}`)
            .catch((reason) => console.error(reason)));
        return;
    }
    params = params.slice(0, params.length - 1);
    createUsersTable(await fetch(`${BASE_URL}/${USER_COLLECTION_NAME}?${params}`)
        .catch((reason) => console.error(reason)));
}
async function updateUser() {
    let payload = getUserPostPayload("user-form");
    let response = await fetch(`${BASE_URL}/${USER_COLLECTION_NAME}?id=${updatingUserId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }).catch((reason) => console.error(reason));
    if (!response || response.status < 200 || response.status > 299) {
        alert("Error occured. See console.");
    }
    else {
        setDialogVisible(USER_DIALOG_ID, false);
    }
}
async function deleteUser(elementId) {
    let response = await fetch(`${BASE_URL}/${USER_COLLECTION_NAME}?id=${elementId}`, {
        method: "DELETE"
    }).catch((reason) => console.error(reason));
    if (!response || response.status < 200 || response.status > 299) {
        alert("Error occured. See console.");
    }
}
function createTable(data, columns, tableId) {
    let table = document.createElement("table");
    table.setAttribute("id", tableId);
    let trHeader = document.createElement("tr");
    for (const column of columns) {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(column.caption));
        trHeader.appendChild(th);
    }
    table.appendChild(trHeader);
    for (const entity of data) {
        let tr = document.createElement("tr");
        for (const column of columns) {
            let td = document.createElement("td");
            td.appendChild(document.createTextNode(getEntityColumnValue(entity, column.name)));
            tr.appendChild(td);
        }
        appendRowButtons(tr, entity);
        table.appendChild(tr);
    }
    return table;
}
async function createUsersTable(response) {
    document.getElementById(USER_TABLE_ID)?.remove();
    if (!response || response.status < 200 || response.status > 299) {
        return;
    }
    let data = await response.json();
    let table = createTable(data, USER_TABLE_COLUMNS.filter((i) => !EXCLUDED_TABLE_COLUMN_NAMES.includes(i.name)), USER_TABLE_ID);
    let searchOutputId = "search-output";
    let searchOutput = document.getElementById(searchOutputId);
    if (!searchOutput) {
        throw new Error(`Element with id = ${searchOutputId} not found`);
    }
    searchOutput.appendChild(table);
}
function appendRowButtons(tr, element) {
    if (element.id === undefined) {
        throw new Error("Admin unit has empty id");
    }
    let updateTd = document.createElement("td");
    updateTd.classList.add("tool-element");
    updateTd.appendChild(getUpdateButton(element));
    let deleteTd = document.createElement("td");
    deleteTd.classList.add("tool-element");
    deleteTd.appendChild(getDeleteButton(element.id));
    tr.appendChild(updateTd);
    tr.appendChild(deleteTd);
}
function getDeleteButton(elementId) {
    let deleteBtn = document.createElement("button");
    deleteBtn.appendChild(document.createTextNode("DELETE"));
    deleteBtn.addEventListener("click", deleteUser.bind(undefined, elementId));
    return deleteBtn;
}
function getUpdateButton(element) {
    let updateBtn = document.createElement("button");
    updateBtn.appendChild(document.createTextNode("UPDATE"));
    updateBtn.addEventListener("click", () => {
        if (element.id === undefined) {
            throw new Error("Admin unit has empty id");
        }
        updatingUserId = element.id;
        userDialogMode = USER_DIALOG_MODES.UPDATE;
        let defaultValues = new Map([["active", element.active || false]]);
        showDialog(USER_DIALOG_ID, defaultValues);
    });
    return updateBtn;
}
function getEntityColumnValue(element, columnName) {
    let elementValue = "";
    if (columnName.indexOf(".") > 0) {
        let pathParts = columnName.split(".", 2);
        if (!pathParts.every(part => part !== "")) {
            throw new Error(`Invalid path: ${columnName}`);
        }
        elementValue = element[pathParts[0]] !== undefined && element[pathParts[0]] !== null
            ? element[pathParts[0]][pathParts[1]] + ""
            : "";
    }
    else {
        elementValue = element[columnName] + "";
    }
    return elementValue;
}
function setDialogVisible(dialogId, isVisible) {
    let dialog = document.getElementById(dialogId);
    if (!dialog) {
        throw new Error(`Element with Id = ${dialogId} not found`);
    }
    if (isVisible) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        userDialogMode = USER_DIALOG_MODES.UNSET;
    }
}
function showDialog(dialogId, defaultValues) {
    prepareDialogColumns(dialogId, defaultValues);
    setDialogVisible(dialogId, true);
}
function prepareDialogColumns(dialogId, defaultValues) {
    let inputFields = document.querySelectorAll(`#${dialogId} form .field input`);
    if (inputFields?.length < 1) {
        throw new Error(`${dialogId} does not contain any forms or fields or inputs`);
    }
    for (let input of inputFields) {
        switch (input.type) {
            case "checkbox":
                input.checked = defaultValues?.get(input.name) || false;
                break;
            default:
                input.value = "";
                break;
        }
    }
}
//# sourceMappingURL=main.js.map