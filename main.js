// GLOBALS
const globalObject = {
	strictMode : false,
	listSelected : []
};

const allSelected = {
	all : false
};

// BUTTONS

// button for adding new to-dos
const addBut = document.getElementById("add-but");
addBut.addEventListener("click", () => {
	addBut.classList.add("touch");
	setTimeout(()=> {
		addBut.classList.remove("touch"); // better than :hover on touch screens
	}, 100);
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
		addElem(contentBox.value, undefined);
		contentBox.value = "";
	}
});

// button for deleting existing to-dos
const delBut = document.getElementById("del-but");
delBut.addEventListener("click", () => {
	delBut.classList.add("touch");
	setTimeout(()=> {
		delBut.classList.remove("touch"); // better than :hover on touch screens
	}, 100);
	// just delete all selected from UI and data as well - for the first data part
	const fullData = callData();
	fullData.list = fullData.list.filter((dataObject) => {
		let flag = true;
		for(const taskDiv of globalObject.listSelected){
			if(taskDiv.id === dataObject.id){
				flag = false;
				break;
			}
		}
		if(flag === false){
			fullData.amount--;
			return false;
		}else{
			return true;
		}
	});
	saveData(fullData);
	// for the second remove all selected from DOM
	for(const taskDiv of globalObject.listSelected){
		taskDiv.remove();
	}
	const amount = document.getElementById('amount');
	amount.innerText = fullData.amount; // don't forget about amount DOM managment
	globalObject.listSelected = []; // don't forget clean the array after removing all selected from DOM
	countSelected(); // and also delBut, editBut allowing managment

});

// button for editing existing to-dos
const editBut = document.getElementById("edit-but");
editBut.addEventListener("click", () => {
	editBut.classList.add("touch");
	setTimeout(()=> {
		editBut.classList.remove("touch"); // better than :hover on touch screens
	}, 100);
	// prepare for editing
	const contentBox = document.getElementById("input-content");
	const editedTask = globalObject.listSelected[0].children[1];
	contentBox.value = editedTask.innerText;
	strictMode(true);
});

// button for completing editing procces
const saveBut = document.getElementById("save-but");
saveBut.addEventListener("click", () => {
	saveBut.classList.add("touch");
	setTimeout(()=> {
		saveBut.classList.remove("touch"); // better than :hover on touch screens
	}, 100);
	const contentBox = document.getElementById("input-content");
	// becareful
	if(contentBox.value !== ''){
		// finish editing - elements part
		const id = globalObject.listSelected[0].id;
		const editedTask = globalObject.listSelected[0].children[1];
		editedTask.innerText = contentBox.value;
		// finish editing - data part
		const fullData = callData();
		for(const dataObject of fullData.list){
			if(dataObject.id === id){
				dataObject.value = contentBox.value;
			}
		}
		saveData(fullData);
	}
	// end of editing
	contentBox.value = '';
	strictMode(false);
});


// ELEMENTS MANAGMENT

function addElem(data, initDataObject){
	// data managment phase
	const objectID = initDataObject ? initDataObject.id : generateID();
	if(!initDataObject){
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
	}
	// creating elements phase
	const taskDiv = document.createElement('div'); taskDiv.id = objectID;
	const taskSpan = document.createElement('span'); taskSpan.innerText = initDataObject ? initDataObject.value : data; taskSpan.classList.add('task');
	const checkbox = document.createElement('input'); checkbox.type = 'checkbox';
	checkbox.addEventListener("click", () => {
		taskSpan.classList.toggle('done');
		taskSpan.classList.contains('done') ? doneState(true, objectID) : doneState(false, objectID);
	});
	taskSpan.addEventListener("click", () => {
		if(!globalObject.strictMode){
			if(taskDiv.classList.contains("selected")){
				taskDiv.classList.remove("selected");
				globalObject.listSelected = globalObject.listSelected.filter(element => element !== taskDiv);
				countSelected();
			}else{
				taskDiv.classList.add("selected");
				globalObject.listSelected.push(taskDiv);
				countSelected();
			}
		}
	});
	if(initDataObject){
		if(initDataObject.isDone === true){
			taskSpan.classList.add("done");
			checkbox.checked = true;
		}
	}
	// injection of elements phase
	const main = document.querySelector('main');
	taskDiv.appendChild(checkbox); taskDiv.appendChild(taskSpan);
	main.prepend(taskDiv);
}

function countSelected(){
	const allowNumber = globalObject.listSelected.length;
	const fullData = callData();
	const amount = fullData.amount;
	if(amount == allowNumber && amount > 1){
		editBut.classList.remove("active");
		delBut.classList.add("active");
	}else if(allowNumber > 0){
		if(allowNumber > 1){
			editBut.classList.remove("active");
		}else if(allowNumber == 1 && amount > 0){
			delBut.classList.add("active");
			editBut.classList.add("active");
		}
	}else{
		delBut.classList.remove("active");
		editBut.classList.remove("active");
	}
}

function strictMode(isOn){
	const amountSelect = document.getElementById("amount");
	const taskDiv = globalObject.listSelected[0];
	if(isOn){
		globalObject.strictMode = true;
		taskDiv.classList.add('strict');
		addBut.classList.remove("active");
		delBut.classList.remove("active");
		editBut.classList.remove("active");
		saveBut.classList.add("active");
		amountSelect.classList.add("inactive");
	}else{
		globalObject.strictMode = false;
		taskDiv.classList.remove('strict');
		taskDiv.classList.remove('selected');
		globalObject.listSelected = []; // don't forget clean the array after removing selected from the one item
		saveBut.classList.remove("active");
		addBut.classList.add("active");
		amountSelect.classList.remove("inactive");
	}
}



// DATA MANAGMENT

// getting data function
function callData(){
	return JSON.parse(localStorage.getItem("to-do")) ?? {
		new : true,
		amount : 0,
		list : []
	};
}

// data save function
function saveData(fullData){
	localStorage.setItem("to-do", JSON.stringify(fullData))
}

// id function
function generateID(length = 8){
	const time = new Date().toLocaleTimeString('cs-CZ', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	}).replace(/\:/g, "s");
	const date = new Date().toLocaleDateString('cs-CZ', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	}).replace(/\s/g, "").replace(/\./g, "s");
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';	
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return  date + "s" + time + "s" + result;
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
};

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
		// initial creating of example and amount
		for(const dataObject of fullData.list){
			addElem(undefined, dataObject);
		}
		const amount = document.getElementById('amount');
		amount.innerText = fullData.amount;
		// initial report
		console.log("LStorage doesn't exist - Lstorage and example was created!");
	}else{
		// initial creating of list (and others), if we have existing data in LStorage
		for(const dataObject of fullData.list){
			addElem(undefined, dataObject);
		}
		const amount = document.getElementById('amount');
		amount.innerText = fullData.amount;
		// initial report
		console.log("Local Storage exists!");
	}
}



// INITIAL DATA LOADING AND CREATING TASKS

initialLoad();



// OTHER FUNCTIONTALITIES
 
$("#sortable").sortable({
	stop : function (event, ui) {
		const userSortedArray = [];
		const main = document.querySelector("main");
		// fill array with ids by user sorting preferencies
		for (const taskDiv of main.children) {
			if (taskDiv.id) {
				userSortedArray.push(taskDiv.id);
			}
		}
		const fullData = callData();
		// iterate user array
		for(const [key, id] of Object.entries(userSortedArray)){
			for(const dataObject of fullData.list){
				if(id === dataObject.id){
					dataObject.order = key;
				}
			}
		}
		// sort the data list depend on how we will be creating list after refresh
		fullData.list.sort((a,b) => b.order - a.order);
		saveData(fullData);
   }
});

const amountSelect = document.querySelector("#amount");
const selectText = document.querySelector(".select-text");
amountSelect.addEventListener("click", () => {
	amountSelect.classList.add("touch");
	setTimeout(()=> {
		amountSelect.classList.remove("touch"); // better than :hover on touch screens
	}, 100);
	const fullData = callData();
	for(const dataObject of fullData.list){
		const taskDiv = document.getElementById(`${dataObject.id}`);
		if(allSelected.all === true){
			taskDiv.classList.remove("selected");
		}else{
			taskDiv.classList.add("selected");
			globalObject.listSelected.push(taskDiv);
		}
	}
	if(allSelected.all === true){
		globalObject.listSelected = [];
		allSelected.all = false;
		selectText.innerHTML = "Select<br>All"
	}else{
		allSelected.all = true;
		selectText.innerHTML = "Unselect<br>All"
	}
	countSelected();
});

const refresh = document.getElementById("refresh");
refresh.addEventListener("click", () => {
	location.reload();
});

const downloadBut = document.getElementById("download");
downloadBut.addEventListener("click", () => {
	downloadBut.classList.add("touch");
	setTimeout(()=> {
		downloadBut.classList.remove("touch"); // better than :hover on touch screens
	}, 100);
  html2canvas(document.querySelector("main")).then(canvas => {
    const link = document.createElement("a");
    link.download = "to-dos.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

const themeBut = document.getElementById("theme");
themeBut.addEventListener("click", () => {
	setTheme(true);
});

function setTheme(isToggle){
	const body = document.querySelector("body");
	const asideControls = document.querySelector("aside.controls")
	const asideContentt = document.querySelector("aside.content");
	const main = document.querySelector("main");
	const download = document.getElementById("download");
	const theme = getThemeCookie("to-do-theme");
	if(isToggle){
			if(body.classList.contains("dark")){
				setThemeCookie("to-do-theme=light");
			}else{
				setThemeCookie("to-do-theme=dark");
			}
			themeBut.classList.toggle("light");
			body.classList.toggle("dark");
			amountSelect.classList.toggle("dark");
			asideControls.classList.toggle("dark");
			asideContentt.classList.toggle("dark");
			main.classList.toggle("dark");
			download.classList.toggle("dark");
	}else{
		if(theme === "dark"){
			themeBut.classList.add("light");
			body.classList.add("dark");
			amountSelect.classList.add("dark");
			asideControls.classList.add("dark");
			asideContentt.classList.add("dark");
			main.classList.add("dark");
			download.classList.add("dark");
			setThemeCookie("to-do-theme=dark");
		}else if(theme === "light" || theme === null){
			themeBut.classList.remove("light");
			body.classList.remove("dark");
			amountSelect.classList.remove("dark");
			asideControls.classList.remove("dark");
			asideContentt.classList.remove("dark");
			main.classList.remove("dark");
			download.classList.remove("dark");
			setThemeCookie("to-do-theme=light");
		}
	}
};

function getThemeCookie(name){
	const cookies = document.cookie.split("; ");
	const rawTheme = cookies.find(cookie => cookie.startsWith(name + "="));
	return rawTheme ? rawTheme.split("=")[1] : null;
};

function setThemeCookie(nameValue){
	document.cookie = nameValue + "; path=/; max-age=604800"; // expires in 7 days
};



// INITIAL THEME LOAD

setTheme(false);



console.log(localStorage.getItem("to-do"));
console.log("Theme " + getThemeCookie("to-do-theme"));