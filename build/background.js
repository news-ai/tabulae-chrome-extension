// const TABULAE_API_BASE = `https://tabulae.newsai.org/api`;

// function get(endpoint) {
//   return fetch(`${TABULAE_API_BASE}${endpoint}`, {
//     method: 'GET',
//     credentials: 'include'
//   })
//     .then(response => response.status === 200 ? response.text() : Promise.reject(response))
//     .then(text => JSON.parse(text));
// }

// setInterval(_ => {
//   // DO AUTH
//   get('/users/me')
//   .then(response => response.data)
//   .then(person => {
//     // GET NOTIFICATIONS
//     return get('/notifications')
//     .then(response => response.data)
//   })
//   .then(notifications => {
//     const numUnread = notifications.reduce((acc, notification) => !notification.Read ? acc += 1 : acc += 0, 0);
//     console.log(numUnread);
//     if (numUnread > 0) {
//       chrome.browserAction.setBadgeBackgroundColor({ color: [196, 0, 0, 255] });
//       chrome.browserAction.setBadgeText({text: JSON.stringify(numUnread)});
//     } else {
//       chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
//       chrome.browserAction.setBadgeText({text: ''});
//     }
//   });
// }, 1000 * 60 * 10);
