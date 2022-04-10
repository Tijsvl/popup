/**
 * @param {string} button Provide Unique ID of popup button
 * @param {string} popup Provide unique ID of popup container
 * @param {boolean} state false | true for open on default, false for closed on default
 * @details This function does not apply any styles, only functionality. Use CSS with .open and .closed
 */
export const popup = (button, popup, state = false, actions = ['click']) => {
  // Find the elements and remove possible ID in given parameters
  button = document.getElementById(button.replace('#', ''))
  popup = document.getElementById(popup.replace('#', ''))

  // Set error object
  const error = {
    found: false,
    messages: [],
    tips: []
  }

  // Check to see if a button element has been found
  if (typeof button === 'undefined' || !button) (error.found = true), error.messages.push('No popup button found')

  // Chheck to see if a popup element has been found
  if (typeof button === 'undefined' || !popup) (error.found = true), error.messages.push('No popup found')

  // Check for errors
  if (error.found) {
    console.error(`${error.messages.length} error${error.messages.length > 1 ? 's' : ''} found:`)
    error.messages.forEach((message) => console.log('-', message))
    return
  }

  // Check button node type
  const buttonNode = button.nodeName.toLowerCase()
  buttonNode !== 'button' && error.tips.push(`Consider using a button to hide/show popup instead of <${buttonNode}>...</${buttonNode}>`)

  // Check for data attributes
  // (add data-open='Show' and data-close='Hide' to your button element)
  let toggleText = false
  const openText = button.dataset.open
  const closeText = button.dataset.close
  if (openText && closeText) toggleText = true
  // Check if just one exists
  if (openText && !closeText) error.tips.push('You have set data-open but not data-close')
  if (!openText && closeText) error.tips.push('You have set data-close but not data-open')

  // Check for tips
  if (error.tips.length > 0) {
    console.info(`${error.tips.length} tip${error.tips.length > 1 ? 's' : ''}:`)
    error.tips.forEach((message) => console.log('-', message))
  }

  // No errors found, continue

  // Set initial state
  let isOpen
  const init = () => {
    isOpen = false
    button.setAttribute('aria-controls', button.id)
    button.setAttribute('aria-popup', true)
    button.classList.add('closed')
    button.classList.remove('open')
    button.style.cursor = 'pointer'
    button.style.userSelect = 'none'
    popup.setAttribute('aria-expanded', false)
    popup.classList.add('closed')
    popup.classList.remove('open')
  }

  // Toggle the classes and aria-labels
  const toggleState = (e) => {
    e && e.preventDefault()
    isOpen = !isOpen
    button.classList.toggle('closed')
    button.classList.toggle('open')
    popup.setAttribute('aria-expanded', isOpen)
    popup.classList.toggle('closed')
    popup.classList.toggle('open')
    toggleText && (button.innerText = isOpen ? closeText : openText)
  }

  // Add the event listener to the button
  button.addEventListener('click', (e) => toggleState(e))

  // Initialize
  init()

  // Set the starting state
  state && toggleState()
}
