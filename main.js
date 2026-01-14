
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



// DATA MANAGMENT
function callData(){
	return JSON.parse(localStorage.getItem("to-do")) ?? {
		amount : 0,
		list : []
	};
}
// initial data managment function
function initialLoad(){

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

// INITIAL DATA LOADING AND CREATING TASKS
initialLoad();
 



console.log(localStorage.getItem("to-do"));
