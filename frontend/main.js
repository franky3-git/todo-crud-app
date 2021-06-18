const todos = document.querySelector('.todo-list');

const gettingTasks = () => {
	fetch('/api/task', {method: 'get'})
		.then(response => response.json())
		.then((tasks) => {
			const content = tasks.map(task => {
				return `<li id=${task._id} class="list-task"><span class="task">${task.todo}</span><button class="btn btn-modify"><i class="fas fa-pen"></i></button> <button class="btn btn-delete"><i class="fas fa-times"></i></button></li>`;
			}).join('\n')
			todos.innerHTML = content;
			
		})
		.catch(err => {
			console.log('Something bad when fetching tasks')
		})
}

document.querySelector('form').addEventListener('submit', (e) => {
	e.preventDefault();
	
	const inputValue = document.getElementById('input-task').value;
	if(!inputValue.trim()) {
		alert('You need to enter something before sending')
	} else {
		const newTask = {todo: inputValue.trim()};
		console.log(newTask)
		fetch('/api/task', {method: 'post', body: JSON.stringify(newTask), headers: {'Content-Type': 'application/json'}})
		.then(() => {
			console.log('task added to database')
			gettingTasks()
		})
		.catch(err => {
			console.log('Something bad when sending task')
		})	
	}
})


document.addEventListener('DOMContentLoaded', () => {
	
	gettingTasks();
})

document.body.addEventListener('click', (e) => {
	if(e.target.classList.contains('btn-modify')) {
		console.log('this is the modify button')
	}
	
	if(e.target.classList.contains('btn-delete')) {
		const todoID = e.target.parentElement.id
		console.log(e.target.parentElement.id)
		fetch('/api/task/' + todoID, {method: 'delete'})
		.then(() => {
			console.log('Task deleted')
			gettingTasks()
		})
		.catch(err => console.log(err))
	}
})