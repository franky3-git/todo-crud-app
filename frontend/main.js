const todosDisplay = document.querySelector('.todo-list');
const form = document.getElementById('form')
const userInput = document.getElementById('input-task')

const todosSample = [
	{_id: 1, todo: 'first todo'},
	{_id: 2, todo: 'second todo'},
	{_id: 3, todo: 'third todo'},
]

const gettingTasks = () => {
	fetch('/api/task', {method: 'get'})
		.then(response => response.json())
		.then((tasks) => {
			displayTodos(tasks)
			
		})
		.catch(err => {
			console.log('Something bad when fetching tasks')
		})
}

gettingTasks();

//Create a new task
document.getElementById('form').addEventListener('submit', (e) => {
	e.preventDefault();
	
	const inputValue = document.getElementById('input-task').value;
	if(!inputValue.trim()) {
		alert('You need to enter something before submitting')
	} else {
		const newTask = {todo: inputValue.trim()};
		fetch('/api/task', {method: 'post', body: JSON.stringify(newTask), headers: {'Content-Type': 'application/json; charset=utf-8'}})
		.then(response => {
			if(response.ok) {
				return response.json();
			}
		})
		.then(() => {
			console.log('task added to database')
			resetTodosInput();
			gettingTasks()
		})
		.catch(err => {
			console.log('Something bad when sending task')
		})	
	}
})

const resetTodosInput = () => {
	userInput.value = '';
}

const buildID = (todo) => {
	return {
		listItemID: 'list_' + todo._id
	}
}

const buildTemplate = (todo, ids) => {
	return `<li id=${ids.listItemID}><span class="task">${todo.todo}</span><button class="btn btn-modify"><i class="fas fa-pen"></i></button> <button class="btn btn-delete"><i class="fas fa-times"></i></button></li>`
}

const displayTodos = (todos) => {
	const todosText = todos.map(todo => {
		return buildTemplate(todo, buildID(todo))
	}).join('\n');
	
	todosDisplay.innerHTML = todosText;
}

// adding update and delete functionnalities
document.body.addEventListener('click', (e) => {
	if(e.target.classList.contains('btn-modify')) {
		const modifyTask = prompt('Enter the new modify task');
		const todoID = e.target.parentElement.id.split('_')[1];
		
		fetch('/api/task/' + todoID, {method: 'put', body: JSON.stringify({todo: modifyTask}), headers: {'Content-Type': 'application/json; charset=utf-8'}})
		.then(response => response.json())
		.then(() => {
			console.log('Task updated')
			gettingTasks();
		})
		.catch(err => {
			console.log(err);
		})
	}
	
	if(e.target.classList.contains('btn-delete')) {
		if(confirm('Are you sure you want to delete this task?')) {
			const todoID = e.target.parentElement.id.split('_')[1]
			fetch('/api/task/' + todoID, {method: 'delete'})
			.then(() => {
				console.log('Task deleted')
				gettingTasks()
			})
			.catch(err => console.log(err))	
		}
	}
});
	
