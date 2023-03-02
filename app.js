function $(id) {
  return document.getElementById(id);
}

const form = $("form");
const date = $("date");
const tBody = $("tbody");
const today = new Date().toISOString().slice(0, 10);
date.value = today;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const inputsElements = [...this.elements];
  // console.log(inputsElements);
  const fromData = {};
  let isValid = true;
  inputsElements.forEach(function (element) {
    if (element.type !== "submit") {
      if (element.value == "") {
        alert("Please enter a valid value in the filled form.");
        isValid = false;
        return;
      }
      fromData[element.name] = element.value;
    }
  });
  if (isValid) fromData.status = "incomplete";
  fromData.id = uuidv4();
  const tasks = getDataFromLocalStorage();
  displayToUi(fromData, tasks.length + 1);
  tasks.push(fromData);
  setDataToLocalStorage(tasks);

  this.reset();
});

window.onload = load();

function load() {
  tBody.innerHTML = "";
  let tasks = getDataFromLocalStorage();
  tasks.forEach((task, index) => {
    displayToUi(task, index + 1);
  });
}

function displayToUi({ id, name, priority, status, date }, index) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
          <td id='no'>${index}</td>
          <td id='name'>${name}</td>
          <td id='priority'>${priority}</td>
          <td id='status'>${status}</td>
          <td id='date'>${date}</td>
          <td id='action'>
            <button id="delete"><i class="fas fa-trash-can"></i></button>
            <button id="check"><i class="fas fa-check"></i></button>
            <button id="edit"><i class="fas fa-pen"></i></button>
          </td>
  
  `;
  tr.dataset.id = id;
  tBody.appendChild(tr);
}

function getDataFromLocalStorage() {
  let tasks = [];
  const data = localStorage.getItem("tasks");
  if (data) {
    tasks = JSON.parse(data);
  }
  return tasks;
}

function setDataToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ====================Action Section =============== */

tBody.addEventListener("click", function (e) {
  if (e.target.id == "delete") {
    const tr = e.target.parentElement.parentElement;
    const id = tr.dataset.id;
    tr.remove();
    let tasks = getDataFromLocalStorage();

    tasks = tasks.filter(function (task) {
      if (task.id !== id) {
        return task;
      }
    });
    setDataToLocalStorage(tasks);
    load();
  } else if (e.target.id == "check") {
    const tr = e.target.parentElement.parentElement;
    const id = tr.dataset.id;
    const tds = e.target.parentElement.parentElement.children;
    [...tds].forEach((td) => {
      if (td.id == "status") {
        let tasks = getDataFromLocalStorage();
        tasks = tasks.filter(function (task) {
          if (task.id === id) {
            if (task.status == "incomplete") {
              task.status = "complete";
              td.innerText = "complete";
            } else {
              task.status = "incomplete";
              td.innerText = "incomplete";
            }
            return task;
          } else {
            return task;
          }
        });
        setDataToLocalStorage(tasks);
      }
    });
  } else if (e.target.id == "edit") {
    console.log("edit");
  }
});
