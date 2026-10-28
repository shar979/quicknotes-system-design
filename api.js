const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.querySelector("#load-btn");
const submitBtn = document.querySelector("#submit-btn");
const statusPara = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");
const noteForm = document.querySelector("#note-form");
const titleInput = document.querySelector("#title-input");
const bodyInput = document.querySelector("#body-input");

let notesArray = [];

async function request(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return null;
  } catch (error) {
    throw error;
  }
}

function setStatus(message, type) {
  statusPara.textContent = message;
  statusPara.className = type;
}

function renderNotes() {
  notesList.textContent = "";

  if (notesArray.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.textContent = "No notes available.";
    notesList.appendChild(emptyLi);
    return;
  }

  notesArray.forEach((note) => {
    const li = document.createElement("li");

    const h3 = document.createElement("h3");
    h3.textContent = note.title;

    const p = document.createElement("p");
    p.textContent = note.body;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", () => deleteNote(note.id, li));

    li.appendChild(h3);
    li.appendChild(p);
    li.appendChild(delBtn);
    notesList.appendChild(li);
  });
}

async function loadNotes() {
  loadBtn.disabled = true;
  setStatus("Loading notes...", "loading");
  notesList.textContent = "";

  try {
    const data = await request(`${API_URL}?_limit=10`);
    notesArray = data;
    setStatus(`Loaded ${notesArray.length} notes from the server.`, "success");
    renderNotes();
  } catch (error) {
    setStatus("Failed to load notes. Please check your network connection.", "error");
  } finally {
    loadBtn.disabled = false;
  }
}

// create notes (POST)
async function createNote(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    setStatus("Error: Title is required.", "error");
    return;
  }
  if (title.length > 100) {
    setStatus("Error: Title cannot exceed 100 characters.", "error");
    return;
  }

  submitBtn.disabled = true;
  setStatus("Creating note...", "loading");

  try {
    const payload = { title, body, userId: 1 };
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const createdNote = await response.json();
    notesArray.unshift(createdNote);
    renderNotes();

    setStatus(`Note created (status ${response.status}, id ${createdNote.id}).`, "success");
    noteForm.reset();
  } catch (error) {
    setStatus("Failed to create note. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
  }
}


async function deleteNote(id, listItemElement) {
  const deleteBtn = listItemElement.querySelector(".delete-btn");
  deleteBtn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`Failed to delete (status ${response.status})`);
    }

    notesArray = notesArray.filter(note => note.id !== id);
    renderNotes();
    setStatus(`Note ID ${id} deleted successfully.`, "success");
  } catch (error) {
    setStatus(`Error deleting note ID ${id}: ${error.message}`, "error");
    deleteBtn.disabled = false;
  }
}

loadBtn.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);