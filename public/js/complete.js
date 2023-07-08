async function completeTask(task_id, toggle_status) {
  var toggleMode;
    const response = await fetch('/api/tasks/complete/'+task_id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      if (document.getElementById("complete-" + task_id).classList.contains('btn-secondary')) {
        document.getElementById("complete-" + task_id).classList.remove('btn-secondary');
        document.getElementById("complete-" + task_id).classList.add('btn-success');
        document.getElementById("complete-" + task_id).innerText = 'Complete'
        toggleMode = 'incomplete';
        
      } else {
        document.getElementById("complete-" + task_id).classList.remove('btn-success');
        document.getElementById("complete-" + task_id).classList.add('btn-secondary');
        document.getElementById("complete-" + task_id).innerText = 'Completed'
        toggleMode = 'complete';
      }
      alert(`Task marked as ${toggleMode}!`)
    } else {
      alert('Error marking task complete.');
    }
}