async function completeTask(task_id) {

    const response = await fetch('/api/tasks/complete/'+task_id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      alert('Task complete!')
    } else {
      alert('Error marking task complete.');
    }
}