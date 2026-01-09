// basic functionality
const addBut = document.getElementById("add-but");

addBut.addEventListener("click", () => {
	const contentBox = document.getElementById("task-content");
	// prevent adding empty tasks
	if(contentBox.value === ""){
		// if don't have empty class, add it and after timer delete it
		contentBox.classList.add("empty");
		setTimeout(() => {
			contentBox.classList.remove("empty");
		}, 250);
		// exit
		return;
	};
	// create new task element with checkbox and add to main
	const newTaskBox = document.createElement("div");
	const newTask = document.createElement("span");
	const newCheckbox = document.createElement("input");
	newCheckbox.type = "checkbox";
	newTask.classList.add("task");
	newTask.innerText =  contentBox.value;
	newTaskBox.appendChild(newCheckbox);
	newTaskBox.appendChild(newTask);
	document.querySelector("main").prepend(newTaskBox);
	// connect checkbox to task crossing = task is done
	newCheckbox.addEventListener("change", () => {
		newTask.classList.toggle("done");
	})
	// clear content box
	contentBox.value = "";
	// scenario for for deleting or editing tasks
	newTask.addEventListener("click", () => {
		// toogle selected class
		newTask.classList.toggle("selected");
		// make sure about amount of selected tasks
		checkSelectedTasks();
		// wait for click on delete or edit button
		const delBut = document.getElementById("del-but");
		const editBut = document.getElementById("edit-but");
		// delete button functionality
		delBut.addEventListener("click", () => {
			if(newTask.classList.contains("selected")){
				newTaskBox.remove();
				editBut.classList.remove("active");
				delBut.classList.remove("active");
			}
		});
		// edit button functionality
		editBut.addEventListener("click", () => {
			// put task content to content box and remove old task
			if(newTask.classList.contains("selected")){
				contentBox.value = newTask.innerText;
				newTaskBox.remove();
				editBut.classList.remove("active");
				delBut.classList.remove("active");
			}
		});
	});
});

// function for finding out selected tasks
function checkSelectedTasks(){
	const allTasks = document.querySelectorAll(".task");
	let selectedCount = 0;
	allTasks.forEach((task) => {
		if(task.classList.contains("selected")){
			selectedCount++;
		}
	});
	const delBut = document.getElementById("del-but");
	const editBut = document.getElementById("edit-but");
	// if one selected, allow edit and delete
	if(selectedCount === 1){
		delBut.classList.add("active");
		editBut.classList.add("active");
	}else if(selectedCount > 1){
		delBut.classList.add("active");
		editBut.classList.remove("active");
	}else{
		delBut.classList.remove("active");
		editBut.classList.remove("active");
	}
}