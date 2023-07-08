# Fetch request routes

## Users

1. `method: 'POST'`
    1. Create new user
        - `/api/users/create`
        - `body: JSON.stringify({ name, email, password }),`
    2. Login
        - `/api/users/login`
        - `body: JSON.stringify({ email, password })`
2. `method: 'DELETE'`
    3. Logout
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
        1. `/api/tasks/`
        2. `body: JSON.stringify({ title, body, priority, due_date, minutes, points })`
2. `method: 'PUT'`
    2. Update any task data
        1. `'/api/tasks/'+task_id`
        2. (All of these field are optional)`body: JSON.stringify({ title, body, priority, due_date, minutes, points })`
    3. Toggle 'complete' status
        1. `'/api/tasks/complete/'+task_id`
        2. No body data necessary.
    4. Snooze task
        1. `'/api/tasks/snooze/' + task_id + '?days=' + days + '&hours=' + hours + '&minutes=' + minutes`
        2. The query parameters are each optional and take just numbers, with no limit.
        3. Right now the default is 
        3. No body needed.
3. `method: 'DELETE'`
    1. Delete task
        1. `'api/tasks/delete/'+task_id`
4. `method: 'GET'`
    1. Get all tasks
        