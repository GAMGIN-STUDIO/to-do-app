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
});