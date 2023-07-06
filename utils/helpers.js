const fs = require('fs');

module.exports = {
  get_priority: (priority) => {
    var priority_icon;
    switch (priority) {
      case 1:
         priority_icon = "🥇";
        break;
      case 2:
         priority_icon = "🥈";
         break;
      // …
      case 3:
        priority_icon = "🥉";
        break;
      default:
        priority_icon = "🎖️";
       break;
    }
    return `<span for="img" aria-label="medal">${priority_icon} ${priority}</span>`;
  },
  svg : function(iconName) {
      // points to my icons folder
      let path = '/public/images/' + iconName + '.svg';
      return path;
    }
};


