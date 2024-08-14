var newScript = document.createElement('script')
newScript.type = 'text/javascript'
newScript.src = chrome.runtime.getURL('handle.js')
document.body.appendChild(newScript)
