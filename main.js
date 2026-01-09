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
		// wait for click on delete or edit button
		const delBut = document.getElementById("del-but");
		const editBut = document.getElementById("edit-but");
		// delete button functionality
		delBut.addEventListener("click", () => {
			if(newTask.classList.contains("selected")){
				newTaskBox.remove();
			}
		});
		// edit button functionality
		editBut.addEventListener("click", () => {
			// make sure only one task is selected
			const allTasks = document.querySelectorAll(".task");
			let selectedCound = 0;
			allTasks.forEach((task) => {
				if(task.classList.contains("selected")){
					selectedCound++;
				}
			});
			// if more than one selected, exit
			if(selectedCound > 1) return;
			// put task content to content box and remove old task
			if(newTask.classList.contains("selected")){
				contentBox.value = newTask.innerText;
				newTaskBox.remove();
			}
		});
	});
});