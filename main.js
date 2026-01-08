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
		}, 1000);
		// exit
		return;
	};
	// create new task element and add to main
	const newTask = document.createElement("div");
	newTask.classList.add("task");
	newTask.innerText =  contentBox.value;
	document.querySelector("main").prepend(newTask);
});