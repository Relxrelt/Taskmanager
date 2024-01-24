async function fetchTodoTasksData() {
  try {
    const docRef = doc(db, "users", newUserId); // Assuming you have already set newUserId somewhere
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const todoTasksArray = userData.todoTasks;
      username = userData.username;
      console.log(todoTasksArray); // Do whatever you want with the todoTasks array here
      taskArray = todoTasksArray;
      console.log(taskArray);
      createTasks(taskArray, currentDiv);
    } else {
      console.log(newUserId);
      console.log("User document not found!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
}

async function fetchDoneToTasksData() {
  try {
    const docRef = doc(db, "users", newUserId); // Assuming you have already set newUserId somewhere
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const doneTaskArray = userData.doneTasks || [];
      console.log(doneTaskArray); // Do whatever you want with the todoTasks array here
      taskArray = doneTaskArray;
      console.log(taskArray);
      createTasks(taskArray, currentDiv);
    } else {
      console.log(newUserId);
      console.log("User document not found!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
}

let currentDiv = "taskList";
let newUserId = "your-desired-id";
const dataObject = {
  username: "John Doe",
  email: "john.doe@example.com",
  todoTasks: [],
  doneTasks: [],
};
let user;
let email = "";
let password = "";
let username = "";
let taskArray = [];

const logoutButton = document.querySelector(".logoutbutton");

function createUser() {
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;
  username = document.querySelector(".username").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in

      user = userCredential.user;
      dataObject.email = email;
      dataObject.username = username;
      newUserId = user.uid;
      await addUserToDatabase(newUserId, dataObject);
      await fetchTodoTasksData();
      changeContainer();
      logoutButton.style.display = "inline";
      document.querySelector(".password").value = "";
      document.querySelector(".email").value = "";
      document.querySelector(".username").value = "";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(error.message);
      // ..
    });
}

function loginUser() {
  const password = document.querySelector(".password").value;
  const email = document.querySelector(".email").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in

      logoutButton.style.display = "inline";
      user = userCredential.user;
      newUserId = user.uid;

      await fetchTodoTasksData();
      changeContainer();
      document.querySelector(".password").value = "";
      document.querySelector(".email").value = "";

      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(error.message);
    });
}
async function addUserToDatabase(newUserId, dataObject) {
  const docRef = doc(db, "users", newUserId);
  try {
    await setDoc(docRef, dataObject);
  } catch (error) {
    console.error("Error writing document:", error);
  }
}

document
  .querySelector(".anotheroption")
  .addEventListener("click", changeLayout);

function changeLayout() {
  const button = document.getElementById("slbutton");
  const text = document.querySelector(".anotheroption");
  const usernameEl = document.querySelector(".username");
  document.querySelector(".password").value = "";
  document.querySelector(".email").value = "";
  document.querySelector(".username").value = "";

  if (button.className === "regButton") {
    button.className = "logButton";
    button.textContent = "Log in";
    text.textContent = "Want to Sign up?";
    usernameEl.style.display = "none";

    button.onclick = function () {
      loginUser();
    };
  } else if (button.className === "logButton") {
    button.className = "regButton";
    text.textContent = "Already have account?";
    button.textContent = "Sign up";
    usernameEl.style.display = "block";
    button.onclick = function () {
      createUser();
    };
  }
}

function createTasks(taskArray, divclass) {
  const taskListDiv = document.querySelector(`.${divclass}`);

  taskListDiv.innerHTML = "";

  taskArray.forEach((taskName) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.id = `${divclass}-${taskName.replace(/\s+/g, "-").toLowerCase()}`;

    const taskNameDiv = document.createElement("div");
    taskNameDiv.classList.add("taskname");
    taskNameDiv.innerText = taskName.toUpperCase();

    const taskEditsDiv = document.createElement("div");
    taskEditsDiv.classList.add("taskEdits");
    taskDiv.appendChild(taskNameDiv);
    if (divclass === "taskList") {
      const removeButton = document.createElement("button");
      removeButton.classList.add("removetaskbutton");
      removeButton.innerText = "REMOVE";

      removeButton.addEventListener("click", () => {
        removeTask(taskName);
      });

      const doneButton = document.createElement("button");
      doneButton.classList.add("taskdonebutton");
      doneButton.innerText = "TASK DONE";

      doneButton.addEventListener("click", () => {
        doneTask(taskName);
      });

      taskEditsDiv.appendChild(removeButton);
      taskEditsDiv.appendChild(doneButton);

      taskDiv.appendChild(taskEditsDiv);
    }

    taskListDiv.appendChild(taskDiv);
  });
}

async function addTask() {
  const input = document.querySelector(".addtaskname").value;
  document.querySelector(".addtaskname").value = "";
  if (input) {
    taskArray.push(input);
    createTasks(taskArray, currentDiv);
  }

  try {
    // Fetch the user document from Firestore
    const docRef = doc(db, "users", newUserId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();

      // Update the todoTasks array in the user document
      userData.todoTasks.push(input);

      // Update the document in Firestore
      await updateDoc(docRef, userData);
    } else {
      console.log("User document not found!");
    }
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

async function removeTask(name) {
  const taskIndex = taskArray.indexOf(name);
  if (taskIndex !== -1) {
    // Remove the task from the taskArray
    taskArray.splice(taskIndex, 1);

    // Remove the task element from the HTML
    const taskElement = document.getElementById(
      name.replace(/\s+/g, "-").toLowerCase()
    );
    if (taskElement) {
      taskElement.remove();
    }

    try {
      // Fetch the user document from Firestore
      const docRef = doc(db, "users", newUserId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        // Update the todoTasks array in the user document
        userData.todoTasks = taskArray;

        // Update the document in Firestore
        await updateDoc(docRef, userData);

        createTasks(taskArray, currentDiv);
      } else {
        console.log("User document not found!");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }
}

function changeContainer() {
  let loginContainer = document.querySelector(".loginContainer");
  let todoListContainer = document.querySelector(".todoListContainer");

  loginContainer.style.display = "none";
  todoListContainer.style.display = "flex";
}

async function doneTask(taskName) {
  // Remove the task from the todoTasks array
  const taskIndex = taskArray.indexOf(taskName);
  if (taskIndex !== -1) {
    taskArray.splice(taskIndex, 1);
    createTasks(taskArray, currentDiv); // Update the HTML display

    try {
      // Fetch the user document from Firestore
      const docRef = doc(db, "users", newUserId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        // Update the todoTasks array in the user document
        userData.todoTasks = taskArray;

        // Add the task to the doneTasks array in the user document
        if (!userData.doneTasks) {
          userData.doneTasks = []; // Initialize doneTasks array if it doesn't exist
        }
        userData.doneTasks.push(taskName);

        // Update the document in Firestore
        await updateDoc(docRef, userData);
      } else {
        console.log("User document not found!");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }
}

function logOut() {
  logoutButton.style.display = "none";
  currentDiv = "taskList";
  user = "";
  email = "";
  password = "";
  username = "";
  taskArray = [];
  document.querySelector(".loginContainer").style.display = "flex";
  document.querySelector(".todoListContainer").style.display = "none";
  document.querySelector(".doneTodoListContainer").style.display = "none";
  document.querySelector(".viewprofiledata").style.display = "none";
}

async function openDoneList() {
  if (user) {
    currentDiv = "doneTaskList";
    await fetchDoneToTasksData();
    document.querySelector(".loginContainer").style.display = "none";
    document.querySelector(".todoListContainer").style.display = "none";
    document.querySelector(".doneTodoListContainer").style.display = "flex";
    document.querySelector(".viewprofiledata").style.display = "none";
  }
}

async function openProfileView() {
  if (user) {
    await changeProfileInfo();
    document.querySelector(".loginContainer").style.display = "none";
    document.querySelector(".todoListContainer").style.display = "none";
    document.querySelector(".doneTodoListContainer").style.display = "none";
    document.querySelector(".viewprofiledata").style.display = "flex";
  }
}

async function openTaskList() {
  currentDiv = "taskList";
  if (user) {
    await fetchTodoTasksData();
    document.querySelector(".loginContainer").style.display = "none";
    document.querySelector(".todoListContainer").style.display = "flex";
    document.querySelector(".doneTodoListContainer").style.display = "none";
    document.querySelector(".viewprofiledata").style.display = "none";
  }
}

async function clearHistory() {
  if (!user) {
    console.log("User not logged in!");
    return;
  }

  try {
    // Fetch the user document from Firestore
    const docRef = doc(db, "users", newUserId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();

      // Clear the doneTasks array in the user document
      userData.doneTasks = [];

      // Update the document in Firestore to clear the doneTasks array
      await updateDoc(docRef, userData);

      // Fetch the updated doneTasks array and refresh the HTML
      await fetchDoneToTasksData();

      // Reload the HTML to reflect the changes
      createTasks(taskArray, currentDiv);
    } else {
      console.log("User document not found!");
    }
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

async function changeProfileInfo() {
  try {
    const docRef = doc(db, "users", newUserId); // Assuming you have already set newUserId somewhere
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const doneTasksLength = userData.doneTasks
        ? userData.doneTasks.length
        : 0;
      const todoTasksLength = userData.todoTasks
        ? userData.todoTasks.length
        : 0;

      // Update the elements' text content
      document.querySelector(".viewprofWelcome").textContent =
        userData.username;
      document.querySelector(
        ".viewprofdone"
      ).textContent = `Done tasks: ${doneTasksLength}`;
      document.querySelector(
        ".viewprofpending"
      ).textContent = `Pending tasks: ${todoTasksLength}`;
    } else {
      console.log(newUserId);
      console.log("User document not found!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
}
