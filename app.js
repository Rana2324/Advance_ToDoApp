function $(id) {
  return document.getElementById(id);
}

const form = $("form");
const date = $("date");
const tBody = $("tbody");
const searchField = $("search");
const filterField = $("filter");
const sortField = $("sort");
const byDate = $("by_date");
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
let selectedTask = [];
function selectFunc(e) {
  const tr = e.target.parentElement.parentElement;
  const id = tr.dataset.id;
  const isChecked = e.target.checked;
  if (isChecked) {
    selectedTask.push(tr);
    bulkActionHandler();
  } else {
    const index = selectedTask.findIndex((task) => tr.dataset.id === id);
    selectedTask.splice(index, 1);
    bulkActionHandler();
  }
}
$("all_select").addEventListener("change", function (e) {
  const isChecked = e.target.checked;
  const checkBoxes = document.querySelectorAll(".checkbox");
  selectedTask = [];
  if (isChecked) {
    [...checkBoxes].forEach((box) => {
      const tr = box.parentElement.parentElement;
      selectedTask.push(tr);
      box.checked = true;
      bulkActionHandler();
    });
  } else {
    [...checkBoxes].forEach((box) => {
      box.checked = false;
      bulkActionHandler();
    });
  }
});

function bulkActionHandler(e) {
  if (selectedTask.length) {
    $("bulk_action").style.display = "flex";
  } else {
    $("bulk_action").style.display = "none";
  }
}

function displayToUi({ id, name, priority, status, date }, index) {
  const tr = document.createElement("tr");

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.className = "checkbox";
  checkBox.addEventListener("change", selectFunc);

  tr.innerHTML = `
          <td id='check'></td>
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
  tr.firstElementChild.appendChild(checkBox);
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

/* =======delete section===== */
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

    /* =======check section===== */
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

    /* =======Edit section===== */
  } else if (e.target.id == "edit") {
    const tr = e.target.parentElement.parentElement;
    const id = tr.dataset.id;
    const tds = tr.children;
    //name section
    let nameTd;
    let newNameField;

    //priority section
    let priorityTd;
    let prioritySelect;
    //date section
    let dateTd;
    let dateInputField;

    //action section
    let preButton;
    let actionTd;

    [...tds].forEach((td) => {
      if (td.id == "name") {
        nameTd = td;
        const preName = td.innerHTML;
        td.innerText = "";
        newNameField = document.createElement("input");
        newNameField.type = "text";
        newNameField.value = preName;
        td.appendChild(newNameField);
      } else if (td.id == "priority") {
        priorityTd = td;

        const prePriority = td.innerHTML;
        td.innerText = "";
        prioritySelect = document.createElement("select");
        prioritySelect.innerHTML = `
          <option disabled>Select One</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>

        
        `;

        if (prePriority === "high") {
          prioritySelect.selectedIndex = 1;
        } else if (prePriority === "medium") {
          prioritySelect.selectedIndex = 2;
        } else if (prePriority === "low") {
          prioritySelect.selectedIndex = 3;
        }

        td.appendChild(prioritySelect);
      } else if (td.id == "date") {
        dateTd = td;
        const preDate = td.textContent;
        td.innerHTML = "";
        dateInputField = document.createElement("input");
        dateInputField.type = "date";
        dateInputField.value = preDate;
        td.appendChild(dateInputField);
      } else if (td.id == "action") {
        actionTd = td;
        preButton = td.innerHTML;
        td.innerHTML = "";
        const saveBtn = document.createElement("button");
        saveBtn.innerHTML = "<i class='fas fa-sd-card'></i>";
        saveBtn.addEventListener("click", function () {
          //name
          const newName = newNameField.value;
          nameTd.innerHTML = newName;
          //priority

          const newPriority = prioritySelect.value;
          priorityTd.innerHTML = newPriority;

          //date
          const newDate = dateInputField.value;
          dateTd.innerHTML = newDate;

          //button
          actionTd.innerHTML = preButton;
          //save modified data localstorage
          let tasks = getDataFromLocalStorage();
          tasks = tasks.filter((task) => {
            if (task.id === id) {
              task.name = newName;
              task.priority = newPriority;
              task.date = newDate;

              return task;
            } else {
              return task;
            }
          });
          setDataToLocalStorage(tasks);
        });
        td.appendChild(saveBtn);
      }
    });
  }
});

/* search section */
searchField.addEventListener("input", function (e) {
  tBody.innerHTML = "";
  byDate.value = "";
  const searchTerm = this.value;
  const tasks = getDataFromLocalStorage();
  let no = 0;
  tasks.forEach((task) => {
    if (task.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      ++no;
      displayToUi(task, 0);
    }
  });
});

/* filter section */

filterField.addEventListener("change", function (e) {
  filterField.selectedIndex;
  byDate.value = "";
  searchField.value = "";
  tBody.innerHTML = "";
  const filterTerm = this.value;
  const tasks = getDataFromLocalStorage();

  switch (filterTerm) {
    case "all":
      tasks.forEach((task, i) => {
        displayToUi(task, i + 1);
      });
      break;
    case "complete":
      let no1 = 0;
      tasks.forEach((task, i) => {
        if (task.status === "complete") {
          ++no1;
          displayToUi(task, i + 1);
        }
      });
      break;
    case "incomplete":
      let no2 = 0;
      tasks.forEach((task, i) => {
        if (task.status === "incomplete") {
          ++no2;
          displayToUi(task, i + 1);
        }
      });
      break;
    case "today":
      let no3 = 0;
      tasks.forEach((task, i) => {
        if (task.date === today) {
          ++no3;
          displayToUi(task, i + 1);
        }
      });
      break;
    case "high":
      let no4 = 0;
      tasks.forEach((task, i) => {
        if (task.priority === "high") {
          ++no4;
          displayToUi(task, i + 1);
        }
      });
      break;
    case "medium":
      let no5 = 0;
      tasks.forEach((task, i) => {
        if (task.priority === "medium") {
          ++no5;
          displayToUi(task, i + 1);
        }
      });
      break;
    case "low":
      let no6 = 0;
      tasks.forEach((task, i) => {
        if (task.priority === "low") {
          ++no6;
          displayToUi(task, i + 1);
        }
      });
      break;
  }
});
/* sorting section */

sortField.addEventListener("change", function (e) {
  tBody.innerHTML = "";
  filterField.selectedIndex = 0;
  searchField.value = "";
  const sortTerm = this.value;
  const tasks = getDataFromLocalStorage();

  if (sortTerm === "newest") {
    tasks.sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
        return -1;
      } else if (new Date(a.date) < new Date(b.date)) {
        return 1;
      } else {
        return 0;
      }
    });
  } else {
    tasks.sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
        return 1;
      } else if (new Date(a.date) < new Date(b.date)) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  tasks.forEach((task, i) => {
    displayToUi(task, i + 1);
  });
});
/* date section */
byDate.addEventListener("change", function (e) {
  const selectDate = this.value;

  tBody.innerHTML = "";
  searchField.value = "";

  filterField.selectedIndex = 0;
  let tasks = getDataFromLocalStorage();
  if (selectDate) {
    let count = 0;
    tasks.forEach((task) => {
      if (task.date === selectDate) {
        ++count;
        displayToUi(task, count);
      }
    });
  } else {
    tasks.forEach((task, i) => {
      displayToUi(task, i + 1);
    });
  }
});
