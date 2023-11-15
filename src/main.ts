import Toastify from "toastify-js";
import { v4 } from "uuid";

import "toastify-js/src/toastify.css";
import "./style.css";

const taskForm = document.querySelector<HTMLFormElement>("#taskForm");
interface Task {
  id: string;
  title: string;
  description: string;
}
let tasks: Task[] = [];
const taskList = document.querySelector("#tasksList");
//Evento submit
taskForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskForm["title"] as unknown as HTMLInputElement;
  const description = taskForm["description"] as unknown as HTMLTextAreaElement;

  //Insertar tareas
  tasks.push({
    title: title.value,
    description: description.value,
    id: v4()
  });

  //Cargar en localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks(tasks);
  taskForm.reset();
  taskForm.focus();

  //notificaciones
  Toastify({
    text: "Task Added"
  }).showToast();
});

//Evento Actualizar el task con tasks
document.addEventListener("DOMContentLoaded", () => {
  tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  renderTasks(tasks);
});

//Renderizar tasks
function renderTasks(tasks: Task[]) {
  taskList!.innerHTML = "";
  tasks.forEach((task) => {
    //Creacion de elementos
    const taskElement = document.createElement("div");
    const header = document.createElement("header");
    const title = document.createElement("span");
    const description = document.createElement("p");
    const btnDelete = document.createElement("button");

    //Estilos
    taskElement.className =
      "bg-zinc-700 mb-1 rounded-lg p-4 hover:bg-zinc-900 hover:cursor-pointer shadow-lg";
    btnDelete.className =
      "bg-red-500 hover:bg-red-700 px-2 py-1 rounded-md shadow-md";
    header.className = "flex justify-between";
    title.className = "text-lg italic underline";

    //Texto
    description.innerText = task.description;
    title.innerText = task.title;

    btnDelete.innerText = "Delete";

    //Insersion al HTML
    header.append(title);
    taskElement.append(header);

    taskElement.append(description);
    header.append(btnDelete);
    taskList?.append(taskElement);

    //evento btnDelete
    btnDelete.addEventListener("click", (e) => {
      const index = tasks.findIndex((t) => t.id === task.id);
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks(tasks);
      Toastify({
        text: "Task Delete",
        style: {
          background: "#8B0000"
        }
      }).showToast();
    });
  });
}
