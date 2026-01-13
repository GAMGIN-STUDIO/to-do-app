// BASIC FUNCTIONALITY
const addBut = document.getElementById("add-but");
addBut.addEventListener("click", () => {
	// adding from textarea
	const elements = addElement();
	// scenario for deleting or editing tasks
	if(elements){
		remElement(elements);
	}
});
// add element to list
function addElement(value, id){
	const contentBox = document.getElementById("task-content");
	let objectID;
	// prevent adding empty tasks
	if(!value){
		if(contentBox.value === ""){
			// if don't have empty class, add it and after timer delete it
			contentBox.classList.add("empty");
			setTimeout(() => {
				contentBox.classList.remove("empty");
			}, 250);
			// exit
			return;
		};

		objectID = generateID();
		dataObject = {
			id : objectID,
			value : contentBox.value,
			isDone : false,
			order : Number
		}
		fullData = callData();
		fullData.list.push(dataObject);
		fullData.amount++;
		saveData(fullData);
		const amount = document.getElementById('amount');
		amount.innerText = fullData.amount;
	}
	// create new task element with checkbox and add to main
	const newTaskBox = document.createElement("div");
	newTaskBox.id = id;
	const newTask = document.createElement("span");
	const newCheckbox = document.createElement("input");
	newCheckbox.type = "checkbox";
	newTask.classList.add("task");
	newTask.innerText =  value ?? contentBox.value;
	newTaskBox.appendChild(newCheckbox);
	newTaskBox.appendChild(newTask);
	document.querySelector("main").prepend(newTaskBox);
	// connect checkbox to task crossing = task is done
	newCheckbox.addEventListener("change", () => {
		newTask.classList.toggle("done");
	})
	// clear content box
	if(!value){
		contentBox.value = "";
	}
	// return some tags for other relations
	return {
		taskBox : newTaskBox,
		task : newTask,
		checkbox : newCheckbox,
		content : contentBox
	}
}
// remove or edit element from list
function remElement(elements){
	elements.task.addEventListener("click", (e) => {
		// toogle selected class
		e.target.classList.toggle("selected");
		// make sure about amount of selected tasks
		checkSelectedTasks();
		// wait for click on delete or edit button
		const delBut = document.getElementById("del-but");
		const editBut = document.getElementById("edit-but");
		// delete button functionality
		delBut.addEventListener("click", () => {
			if(elements.task.classList.contains("selected")){
				elements.taskBox.remove();
				remData(elements.taskBox.id);
				editBut.classList.remove("active");
				delBut.classList.remove("active");
			}
		});
		// edit button functionality
		editBut.addEventListener("click", () => {
			// put task content to content box and call edit function
			if(e.target.classList.contains("selected")){
				elements.content.value = e.target.innerText;
				editBut.classList.remove("active");
				delBut.classList.remove("active");
				addBut.classList.remove("active");
				e.target.classList.remove("selected");
				editData(elements.taskBox.id, e.target, elements.content);
			}
		});
	});
}
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


// DATA MANAGMENT
function callData(){
	return JSON.parse(localStorage.getItem("to-do")) ?? {
		amount : 0,
		list : []
	};
}
// initial data managment function
function initialLoad(){
	const initialData = callData();
	initialData.list.forEach((dataObject) => {
		const elements = addElement(dataObject.value, dataObject.id);
		remElement(elements);
	})
	const amount = document.getElementById('amount');
	amount.innerText = initialData.amount;
}
// data save
function saveData(fullData){
	localStorage.setItem("to-do", JSON.stringify(fullData))
}
// id function
function generateID(length = 8){
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}
// data remove
function remData(id){
	const fullData = callData();
	const newList = fullData.list.filter((dataObject) => {
		if(dataObject.id === id){
			fullData.amount--;
			const amount = document.getElementById('amount');
			amount.innerText = fullData.amount;
			return false
		}else{
			return true
		}
	});
	fullData.list = newList;
	saveData(fullData);
}
// data edit
function editData(id, task, contentBox){
	saveBut.classList.add("active");
	const fullData = callData();
	for(const dataObject of fullData.list){
		if(dataObject.id === id){
			dataObject.value = contentBox.value;
			console.log(task.innerText, contentBox.value);
			task.innerText = contentBox.value;
		}
	}
	saveData(fullData);
	contentBox.value = '';
	saveBut.classList.remove("active");
	addBut.classList.add("active");
}

const saveBut = document.getElementById('save-but');
saveBut.addEventListener("click", () => {

});


// INITIAL DATA LOADING AND CREATING TASKS
initialLoad();
 



console.log(localStorage.getItem("to-do"));
