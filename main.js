
// BUTTONS

// button for adding new to-dos
const addBut = document.getElementById("add-but");
addBut.addEventListener("click", () => {
	const contentBox = document.getElementById("input-content");
	if(contentBox.value === ""){
		// if don't have empty class, add it and after timer delete it
		contentBox.classList.add("empty");
		setTimeout(() => {
			contentBox.classList.remove("empty");
		}, 250);
		// exit
		return
	}else{
		addElem(contentBox.value);
	}
});

// button for deleting existing to-dos
const delBut = document.getElementById("del-but");
delBut.addEventListener("click", () => {

});

// button for editing existing to-dos
const editBut = document.getElementById("edit-but");
editBut.addEventListener("click", () => {

});

// button for completing editing procces
const saveBut = document.getElementById("save-but");
saveBut.addEventListener("click", () => {

});


// ELEMENTS MANAGMENT

function addElem(data){
	// data managment phase
	objectID = generateID();
	dataObject = {
		id : objectID,
		value : data,
		isDone : false,
		order : Number
	}
	fullData = callData();
	fullData.list.push(dataObject);
	fullData.amount++;
	saveData(fullData);
	const amount = document.getElementById('amount');
	amount.innerText = fullData.amount;
	// creating elements phase
	const taskDiv = document.createElement('div'); taskDiv.id = objectID;
	const taskSpan = document.createElement('span'); taskSpan.innerText = data; taskSpan.classList.add('task');
	const checkbox = document.createElement('input'); checkbox.type = 'checkbox';
	checkbox.addEventListener("click", () => {
		taskSpan.classList.toggle('done');
		taskSpan.classList.contains('done') ? doneState(true, objectID) : doneState(false, objectID);
	});
	// injection of elements phase
	const main = document.querySelector('main');
	taskDiv.appendChild(checkbox); taskDiv.appendChild(taskSpan);
	main.prepend(taskDiv);
}



// DATA MANAGMENT

function callData(){
	return JSON.parse(localStorage.getItem("to-do")) ?? {
		new : true,
		amount : 0,
		list : []
	};
}
// initial data managment function
function initialLoad(){
	const fullData = callData();
	if(fullData.new){
		dataObject = {
			id : "example",
			value : "example",
			isDone : false,
			order : Number
		}
		fullData.list.push(dataObject);
		fullData.amount++;
		fullData.new = false;
		saveData(fullData);
		const amount = document.getElementById('amount');
		amount.innerText = fullData.amount;
		console.log("Data not exist - example was created!");
	}else{
		// initial loading of list if we have existing data in LStorage
		
		const amount = document.getElementById('amount');
		amount.innerText = fullData.amount;
		console.log("Data exist!");
	}
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
// done state func
function doneState(isDone, id){
	const fullData = callData();
	for(dataObject of fullData.list){
		if(dataObject.id === id){
			if(isDone){
				dataObject.isDone = isDone;
			}else{
				dataObject.isDone = isDone;
			}
		}
	}
	saveData(fullData);
	const actualE = document.getElementById(`${id}`);
	console.log(actualE);
	console.log(localStorage.getItem("to-do"));
};

// INITIAL DATA LOADING AND CREATING TASKS
initialLoad();
 



console.log(localStorage.getItem("to-do"));
