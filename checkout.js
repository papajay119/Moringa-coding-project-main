// Demo checkout. It reads the chosen item from the page address,
// asks how and when the customer will pay, and shows a confirmation.
// No real payment is taken and no card numbers are collected.

const params = new URLSearchParams(location.search)
const itemName = params.get('item') || ''
const itemPrice = params.get('price') || ''

const form = document.querySelector('#checkout-form')
const itemLine = document.querySelector('#order-item')
const priceLine = document.querySelector('#order-price')
const cashOption = document.querySelector('#cash-option')
const cashInput = cashOption.querySelector('input')
const methodNote = document.querySelector('#method-note')
const formError = document.querySelector('#form-error')
const confirmation = document.querySelector('#confirmation')
const confirmTitle = document.querySelector('#confirm-title')
const confirmText = document.querySelector('#confirm-text')

if (itemName) {
  // textContent shows the text safely, even if the address was edited
  itemLine.textContent = itemName
  priceLine.textContent = itemPrice
} else {
  // The page was opened without choosing anything
  form.hidden = true
  priceLine.textContent = 'Choose something from the shop first.'
}

// Returns the value of the chosen radio button in a group
function chosen(groupName) {
  return form.querySelector(`input[name="${groupName}"]:checked`).value
}

// Cash only works on delivery. Also shows a note for the chosen way to pay.
function updateOptions() {
  const timing = chosen('timing')

  cashInput.disabled = timing === 'before'
  cashOption.classList.toggle('is-disabled', timing === 'before')
  if (timing === 'before' && chosen('method') === 'cash') {
    form.querySelector('input[name="method"][value="mobile"]').checked = true
  }

  const notes = {
    mobile: timing === 'before'
      ? 'You will get a payment request on your phone. Pay it with M-Pesa to confirm your order.'
      : 'Pay the rider with M-Pesa when your order arrives.',
    card: timing === 'before'
      ? 'A real shop would send you to a secure card payment page here. This demo does not take card numbers.'
      : 'Pay the rider by card when your order arrives.',
    cash: 'Have the exact amount ready when your order arrives.'
  }
  methodNote.textContent = notes[chosen('method')]
}

// Kenyan mobile numbers: 07.., 01.., +2547.., 2541..
function validPhone(text) {
  const digits = text.replace(/[\s-]/g, '')
  return /^(\+254|254|0)[17]\d{8}$/.test(digits)
}

form.addEventListener('change', updateOptions)

form.addEventListener('submit', event => {
  event.preventDefault()
  const name = document.querySelector('#name').value.trim()
  const phone = document.querySelector('#phone').value.trim()
  const address = document.querySelector('#address').value.trim()

  if (!name || !phone || !address) {
    formError.textContent = 'Please fill in your name, phone number and delivery address.'
    return
  }
  if (!validPhone(phone)) {
    formError.textContent = 'Enter a Kenyan phone number, like 0712 345 678.'
    return
  }
  formError.textContent = ''

  const methodName = { mobile: 'M-Pesa', card: 'card', cash: 'cash' }[chosen('method')]
  const when = chosen('timing') === 'before' ? 'now, before delivery' : 'on delivery'

  confirmText.textContent =
    `Thank you, ${name}. Your order for ${itemName} (${itemPrice}) will be delivered to ${address}. ` +
    `You chose to pay by ${methodName} ${when}. ${methodNote.textContent} ` +
    `We will call ${phone} if we need anything.`

  form.hidden = true
  confirmation.hidden = false
  confirmTitle.focus()
})

updateOptions()