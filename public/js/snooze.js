async function snooze(task_id, snoozeDays, snoozeHours, snoozeMinutes) {
  var toggleMode;
    const response = await fetch(`/api/tasks/snooze/${task_id}?days=${snoozeDays}&hours=${snoozeHours}&minutes=${snoozeMinutes}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      alert(`Snoozed!`)
    } else {
      alert('Error marking task complete.');
    }
}