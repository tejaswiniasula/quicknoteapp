// Backend API URL
const API_URL = "http://127.0.0.1:8000";

// DOM Elements
const noteInput = document.getElementById("noteInput");
const saveBtn = document.getElementById("saveBtn");
const notesContainer = document.getElementById("notesContainer");
const search = document.getElementById("search");
const count = document.getElementById("count");
const themeToggle = document.getElementById("themeToggle");

// Character Counter
noteInput.addEventListener("input", () => {
    count.innerText = noteInput.value.length + " Characters";
});

// Dark Mode Toggle
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeToggle.innerHTML="☀️";
    }
    else{
        themeToggle.innerHTML="🌙";
    }

});

// Save Note
saveBtn.addEventListener("click", async () => {

    const text = noteInput.value.trim();

    if(text===""){
        alert("Please write something!");
        return;
    }

    await fetch(API_URL+"/notes",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            text:text
        })

    });

    noteInput.value="";

    count.innerText="0 Characters";

    loadNotes();

});

// Load Notes
async function loadNotes(){

    const response=await fetch(API_URL+"/notes");

    const notes=await response.json();

    displayNotes(notes);

}

// Display Notes
function displayNotes(notes){

    notesContainer.innerHTML="";

    notes.reverse().forEach(note=>{

        const card=document.createElement("div");

        card.className="card";

        card.innerHTML=`

        <h3>📝 Note</h3>

        <p>${note.text}</p>

        <small>${new Date().toLocaleDateString()}</small>

        <div class="buttons">

        <button class="edit" onclick="editNote(${note.id},'${note.text}')">

        ✏ Edit

        </button>

        <button class="delete" onclick="deleteNote(${note.id})">

        🗑 Delete

        </button>

        </div>

        `;

        notesContainer.appendChild(card);

    });

}

// Delete Note
async function deleteNote(id){

    await fetch(API_URL+"/notes/"+id,{
        method:"DELETE"
    });

    loadNotes();

}

// Edit Note
async function editNote(id,text){

    const newText=prompt("Edit your note",text);

    if(newText==null)return;

    await fetch(API_URL+"/notes/"+id,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            text:newText
        })

    });

    loadNotes();

}

// Search Notes
search.addEventListener("keyup",()=>{

    const keyword=search.value.toLowerCase();

    const cards=document.querySelectorAll(".card");

    cards.forEach(card=>{

        const text=card.innerText.toLowerCase();

        if(text.includes(keyword)){
            card.style.display="block";
        }
        else{
            card.style.display="none";
        }

    });

});

// Initial Load
loadNotes();