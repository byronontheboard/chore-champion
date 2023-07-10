# Fetch request routes

Note: I only now realized that you would have to do another fetch request to get the logged in user's id.  So now if you want the logged in user's info, in the spot for a user id, just leave it blank, or write in `'me'`.

## Users

1. `method: 'POST'`
    1. Create new user
        - `/api/users/create`
        - `body: JSON.stringify({ name, email, password }),`

    2. Login
        - `/api/users/login`
        - `body: JSON.stringify({ email, password })`

2. `method: 'DELETE'`

    2. Logout
        - `/api/users/logout`
        - No body needed

3. `method: 'PUT'`

    4. Update profile
        - `/api/users/profile`
        - `body: JSON.stringify({ name, email, icon })`

4. `method: 'GET'`
    1. Get all user data, excluding email, password, and user_id
        1. `/api/users`

## Tasks

1. `method: 'POST'`
    1. Create new task
        - `/api/tasks/`
        - `body: JSON.stringify({ title, body, priority, due_date, minutes, points })`

2. `method: 'PUT'`
    1. Update any task data
        - `'/api/tasks/'+task_id`
        - (All of these field are optional)`body: JSON.stringify({ title, body, priority, due_date, minutes, points })`

    3. Toggle 'complete' status
        - `'/api/tasks/complete/'+task_id`
        - No body data necessary.

    4. Snooze task
        - `'/api/tasks/snooze/' + task_id + '?days=' + days + '&hours=' + hours + '&minutes=' + minutes`
        - The query parameters are each optional and take just numbers, with no limit.
        - Right now the default is 
        - No body needed.

3. `method: 'DELETE'`
    1. Delete task
        - `'api/tasks/delete/'+task_id`

4. `method: 'GET'`
    1. Get all tasks
        - `api/tasks/`
        - They will be returned in [an array like this<sup>1</sup>](#1-array-of-tasks)

    2. Get one task by id
        - `'api/tasks/'+task_id`
        - They will be returned as [a single object<sup>1</sup>](#2-single-task)
        - It doesn't include the User object.
    
    3. Get all tasks for a user, with a number of optional query parameters
        - `'api/tasks/user/'+user_id`
        - returned as [an array<sup>1</sup>](#1-array-of-tasks)
        - query parameters are
            1. complete - equals "yes" or "no"
            2. priority - an integer
            3. dueAfter, dueBefore, createdAfter, createdBefore - a date
                - dates are a little annoying since GET requests don't have a body you can put info into, and everything has to be in the URL
                - for best outcome, transform your date object like this `let encodedDate = encodeURIComponent(date.toISOString());`.
                - or just format it like 'YYYY-MM-DD'

        - Examples
            1. `api/tasks/user/1?complete=yes` <br>
            returns all complete tasks for user 1
            2. `api/tasks/user/1?complete=no&dueBefore=2023-07-08` <br>
            returns all incomplete tasks due before Jul 8 for user 1.
            3. `api/tasks/user/1?priority=1&complete=no&dueBefore=2023-07-08` <br>
            returns all incomplete tasks of priority 1 due before Jul 8 for user 1.

    4. Get a count of incomplete tasks for the logged in user
        - `api/task/incompleteCount`
        - returns an integer

    5. Get a count of complete tasks for the logged in user
        - `api/task/completeCount`
        - returns an integer
    
    5. Get a count of complete tasks of a specified priority for the logged in user
        - `'api/task/completeCount/'+priority`
        - returns an integer

## Stats

4. `method: 'GET'`
    1. Get stats data for all users
        - `api/stats/`
        - Returns [an array<sup>3</sup>](#3-stats-array), ordered by number of points, descending

    2. Get stats data for one user
        - `'api/stats/' + user_id`
        - Returns a [single object<sup>4</sup>](#4-single-stats-object)

   5. Get what the user's total values were at a specified date
        - `'api/stats/' + user_id + '/date/' +date`
        - returns as [single object<sup>4</sup>](#4-single-stats-object)
        - As in the GET request for tasks, the date needs to be URI encoded.
            - for best outcome, transform your date object like this `let encodedDate = encodeURIComponent(date.toISOString());`.
            - or just format it like 'YYYY-MM-DD'

    3. Get completed tasks history for a user
        - `'api/stats/completed/' + user_id`
        - returns as [an array<sup>5</sup>](#5-completed-stats-array) in order of complete_date, with the most recent being first.
 
    4. Get completed tasks history for a user, after a specified date
        - `'api/stats/completed/' + user_id + '/date/' + date`
        - returns as [an array<sup>5</sup>](#5-completed-stats-array) in order of complete_date, with the most recent being first.
        



# Example code blocks

### 1. Array of tasks for all users

```
[
	{
		"id": 1,
		"title": "Wash Car",
		"body": "...",
		"due_date": null,
		"priority": 2,
		"points": 200,
		"minutes": 60,
		"complete_date": null,
		"createdAt": "2023-07-09T00:27:59.000Z",
		"updatedAt": "2023-07-09T00:27:59.000Z",
		"user": {
			"name": "User #1",
			"icon": "👤",
			"createdAt": "2023-07-09T00:27:59.000Z",
			"updatedAt": "2023-07-09T00:27:59.000Z"
		}
	},
    ...
]
```

### 2. Single Task

```
{
	"id": 1,
	"title": "Wash Car",
	"body": "...",
	"due_date": null,
	"priority": 2,
	"points": 200,
	"minutes": 60,
	"complete_date": null,
	"user_id": 1,
	"createdAt": "2023-07-09T00:27:59.000Z",
	"updatedAt": "2023-07-09T00:27:59.000Z"
}
```      

### 3. Stats array

```
[
	{
		"id": 3,
		"total_points": 2300,
		"total_minutes": 300,
		"user_id": 3,
		"createdAt": "2023-07-09T00:27:59.000Z",
		"updatedAt": "2023-07-09T00:27:59.000Z",
		"user": {
			"name": "User #3",
			"icon": "👤",
			"createdAt": "2023-07-09T00:27:59.000Z",
			"updatedAt": "2023-07-09T00:27:59.000Z"
		}
	},
    ...
]
```

### 4. Single stats Object

```
{
	"total_points": 2300,
	"total_minutes": 300,

	"updatedAt": "2023-07-09T00:27:59.000Z"
}
```

### 5. Completed stats array

```
[
	{
		"due_date": null,
		"priority": 4,
		"complete_date": "2023-07-07T06:49:17.000Z",
		"cumulative_points": 950,
		"cumulative_minutes": 360,
		"task_id": 50
	},
    ...
]
```