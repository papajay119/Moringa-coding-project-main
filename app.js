// Your product's interface. It asks the service module (src/service.js)
// for data and shows the answer. It never fetches data itself.
import { getItems } from './src/service.js'
import { webProducts } from './src/web-products.js' // example products from the web

const statusLine = document.querySelector('#items-status')
const list = document.querySelector('#items-list')
const filter = document.querySelector('#category-filter')
const dialog = document.querySelector('#gallery')
const galleryTitle = document.querySelector('#gallery-title')
const galleryGrid = document.querySelector('#gallery-grid')
const galleryClose = document.querySelector('#gallery-close')
const cartDialog = document.querySelector('#cart')
const cartOpen = document.querySelector('#cart-open')
const cartClose = document.querySelector('#cart-close')
const cartList = document.querySelector('#cart-list')
const cartTotal = document.querySelector('#cart-total')
const cartCount = document.querySelector('#cart-count')
const cartCheckout = document.querySelector('#cart-checkout')
const toTop = document.querySelector('#to-top')
const animeStatus = document.querySelector('#anime-status')
const animeReset = document.querySelector('#anime-reset')
// NEW: the single-item viewer
const viewer = document.querySelector('#viewer')
const viewerTitle = document.querySelector('#viewer-title')
const viewerStage = document.querySelector('#viewer-stage')
const viewerFrame = document.querySelector('#viewer-frame')
const viewerImg = document.querySelector('#viewer-img')
const viewerPrice = document.querySelector('#viewer-price')
const viewerActions = document.querySelector('#viewer-actions')
const viewerClose = document.querySelector('#viewer-close')
const zoomInBtn = document.querySelector('#zoom-in')
const zoomOutBtn = document.querySelector('#zoom-out')
const zoomResetBtn = document.querySelector('#zoom-reset')
const zoomLevel = document.querySelector('#zoom-level')

let allItems = []

// What to call each kind of product on its card
const typeLabels = {
  posters: 'Poster',
  standees: 'Acrylic standee',
  pins: 'Enamel pin pack',
  hoodies: 'Oversized hoodie'
}

// Each anime uses the background picture of the item type that matches it
const animeCategory = { jujutsu: 'posters', 'demon-slayer': 'standees', hero: 'pins', bleach: 'hoodies' }
let animeBackgrounds = {}

// Changes the page background to the chosen anime (or back to dark when key is null)
function chooseAnime(key) {
  let name = ''
  document.querySelectorAll('[data-anime]').forEach(card => {
    const on = card.dataset.anime === key
    card.setAttribute('aria-pressed', String(on))
    if (on) name = card.querySelector('h3').textContent
  })
  const image = key ? animeBackgrounds[key] : ''
  document.body.style.setProperty('--anime-bg', image ? `url("${image}")` : 'none')
  document.body.classList.toggle('has-anime', Boolean(image))
  animeReset.hidden = !key
  if (!key) animeStatus.textContent = ''
  else animeStatus.textContent = image ? `Background: ${name}` : `${name}: no background picture found`
}

// Shows a message in the status line. kind is 'loading', 'empty', 'ok' or 'error'
function showStatus(kind, message) {
  statusLine.dataset.kind = kind
  statusLine.textContent = message
}

// ---------- Cart (saved in the browser, so it survives a refresh) ----------
function loadCart() {
  try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
}
let cart = loadCart()

function saveCart() {
  try { localStorage.setItem('cart', JSON.stringify(cart)) } catch { /* storage blocked: cart still works until refresh */ }
  renderCart()
}

const toNumber = text => Number(text.replace(/[^0-9]/g, ''))
const money = number => `KSh ${number.toLocaleString('en-US')}`

function renderCart() {
  cartCount.textContent = cart.length
  cartList.replaceChildren()
  cart.forEach((line, index) => {
    const row = document.createElement('li')
    const label = document.createElement('span')
    label.textContent = `${line.title} - ${line.price}`
    const remove = document.createElement('button')
    remove.type = 'button'
    remove.textContent = 'Remove'
    remove.addEventListener('click', () => {
      cart.splice(index, 1)
      saveCart()
    })
    row.append(label, remove)
    cartList.append(row)
  })

  const total = cart.reduce((sum, line) => sum + toNumber(line.price), 0)
  cartTotal.textContent = cart.length === 0 ? 'Your cart is empty.' : `Total: ${money(total)}`
  cartCheckout.hidden = cart.length === 0

  // The checkout page reads the items and total from the address
  const names = cart.map(line => line.title).join(', ')
  cartCheckout.href = `checkout.html?item=${encodeURIComponent(names)}&price=${encodeURIComponent(`Total ${money(total)}`)}`
}

function addToCart(design, button) {
  cart.push({ title: design.title, price: design.price })
  saveCart()
  button.textContent = 'Added!'
  setTimeout(() => { button.textContent = 'Add to cart' }, 1200)
}

// ---------- Floating preview of the whole set when hovering an item ----------
const preview = document.createElement('div')
preview.className = 'hover-preview'
preview.hidden = true
preview.setAttribute('aria-hidden', 'true')
document.body.append(preview)

function movePreview(event) {
  const gap = 18
  let x = event.clientX + gap
  let y = event.clientY + gap
  if (x + preview.offsetWidth > window.innerWidth - 8) x = event.clientX - preview.offsetWidth - gap
  if (y + preview.offsetHeight > window.innerHeight - 8) y = window.innerHeight - preview.offsetHeight - 8
  preview.style.left = `${Math.max(8, x)}px`
  preview.style.top = `${Math.max(8, y)}px`
}

function showPreview(item, event) {
  preview.replaceChildren()
  for (const design of item.gallery) {
    const picture = document.createElement('img')
    picture.src = design.image
    picture.alt = ''
    preview.append(picture)
  }
  preview.hidden = false
  movePreview(event)
}

function hidePreview() {
  preview.hidden = true
}

// ---------- Pop-up with every design of an item (not used now that every design is its own product) ----------
function openGallery(item) {
  hidePreview()
  galleryTitle.textContent = item.title
  // Each item can have its own background picture behind the pop-up
  dialog.style.setProperty('--gallery-bg', item.background ? `url("${item.background}")` : 'none')
  galleryGrid.replaceChildren()
  for (const design of item.gallery) {
    const figure = document.createElement('figure')

    const picture = document.createElement('img')
    picture.src = design.image
    picture.alt = design.title

    const caption = document.createElement('figcaption')
    const name = document.createElement('strong')
    name.textContent = design.title
    const price = document.createElement('span')
    price.textContent = design.price

    const add = document.createElement('button')
    add.type = 'button'
    add.className = 'button ghost'
    add.textContent = 'Add to cart'
    add.addEventListener('click', () => addToCart(design, add))

    const order = document.createElement('a')
    order.className = 'button'
    order.textContent = 'Order this one'
    // Goes straight to the checkout page, carrying the chosen item and price
    order.href = `checkout.html?item=${encodeURIComponent(design.title)}&price=${encodeURIComponent(design.price)}`

    const actions = document.createElement('div')
    actions.className = 'actions'
    actions.append(add, order)

    caption.append(name, price, actions)
    figure.append(picture, caption)
    galleryGrid.append(figure)
  }
  dialog.showModal()
}

// ---------- NEW: single-item viewer with zoom and a 3D tilt that follows the mouse ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let zoom = 1

function setZoom(value) {
  zoom = Math.min(4, Math.max(0.5, value))
  viewerImg.style.setProperty('--zoom', zoom)
  zoomLevel.textContent = `${Math.round(zoom * 100)}%`
  zoomOutBtn.disabled = zoom <= 0.5
  zoomInBtn.disabled = zoom >= 4
}

function openViewer(item) {
  hidePreview()
  viewerTitle.textContent = item.title
  viewerImg.src = item.image
  viewerImg.alt = item.title
  viewerPrice.textContent = item.price
    ? (item.oldPrice ? `${item.price} (was ${item.oldPrice})` : item.price)
    : ''

  viewerActions.replaceChildren()
  if (item.price) {
    const add = document.createElement('button')
    add.type = 'button'
    add.className = 'button'
    add.textContent = 'Add to cart'
    add.addEventListener('click', () => addToCart(item, add))

    const order = document.createElement('a')
    order.className = 'button ghost'
    order.textContent = 'Order now'
    order.href = `checkout.html?item=${encodeURIComponent(item.title)}&price=${encodeURIComponent(item.price)}`

    viewerActions.append(add, order)
  }

  setZoom(1)
  viewer.showModal()
}

// The picture leans toward the mouse, and when zoomed in it shows the part under the cursor
viewerStage.addEventListener('mousemove', event => {
  const box = viewerStage.getBoundingClientRect()
  const x = (event.clientX - box.left) / box.width - 0.5
  const y = (event.clientY - box.top) / box.height - 0.5
  if (!reduceMotion) {
    viewerFrame.style.setProperty('--rx', `${(-y * 18).toFixed(1)}deg`)
    viewerFrame.style.setProperty('--ry', `${(x * 18).toFixed(1)}deg`)
  }
  viewerImg.style.setProperty('--ox', `${((x + 0.5) * 100).toFixed(0)}%`)
  viewerImg.style.setProperty('--oy', `${((y + 0.5) * 100).toFixed(0)}%`)
})
viewerStage.addEventListener('mouseleave', () => {
  viewerFrame.style.removeProperty('--rx')
  viewerFrame.style.removeProperty('--ry')
})
// Mouse wheel zooms too
viewerStage.addEventListener('wheel', event => {
  event.preventDefault()
  setZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25))
}, { passive: false })

zoomInBtn.addEventListener('click', () => setZoom(zoom + 0.5))
zoomOutBtn.addEventListener('click', () => setZoom(zoom - 0.5))
zoomResetBtn.addEventListener('click', () => setZoom(1))
viewerClose.addEventListener('click', () => viewer.close())
viewer.addEventListener('close', () => {
  viewerFrame.style.removeProperty('--rx')
  viewerFrame.style.removeProperty('--ry')
})

// Draws the given items in the list
function renderItems(items) {
  hidePreview()
  list.replaceChildren()
  for (const item of items) {
    const entry = document.createElement('li')

    // Picture on top of the card, for items that have one
    if (item.image) {
      const picture = document.createElement('img')
      picture.className = 'product-img'
      picture.src = item.image
      picture.alt = item.title
      picture.loading = 'lazy'
      entry.append(picture)
    }

    // Small tag on items that come from the web
    if (item.fromWeb) {
      const tag = document.createElement('small')
      tag.className = 'tag'
      tag.textContent = 'Example from the web'
      entry.append(tag)
    }

    const title = document.createElement('strong')
    title.textContent = item.title
    const detail = document.createElement('span')
    detail.textContent = ` ${item.detail}`
    entry.append(title, detail)

    // Items with a price show it (and the old price) with Add to cart and Order now
    if (item.price) {
      const price = document.createElement('p')
      price.className = 'price'
      price.textContent = item.price
      if (item.oldPrice) {
        const old = document.createElement('span')
        old.className = 'old'
        old.textContent = item.oldPrice
        price.append(old)
      }

      const add = document.createElement('button')
      add.type = 'button'
      add.className = 'button'
      add.textContent = 'Add to cart'
      add.addEventListener('click', () => addToCart(item, add))

      // Order now goes straight to checkout
      const order = document.createElement('a')
      order.className = 'button ghost'
      order.textContent = 'Order now'
      order.href = `checkout.html?item=${encodeURIComponent(item.title)}&price=${encodeURIComponent(item.price)}`

      const actions = document.createElement('div')
      actions.className = 'actions'
      actions.append(add, order)
      entry.append(price, actions)
    }

    // NEW: items with a picture open the viewer from this button, or from a click anywhere on the card
    if (item.image) {
      entry.classList.add('viewable')
      const look = document.createElement('button')
      look.type = 'button'
      look.className = 'view-btn'
      look.textContent = 'View and zoom'
      look.addEventListener('click', () => openViewer(item))
      entry.append(look)

      entry.addEventListener('click', event => {
        if (event.target.closest('button, a')) return
        openViewer(item)
      })
    }

    // Items that still have a gallery get a button that opens the pop-up, and a hover preview
    if (item.gallery) {
      const view = document.createElement('button')
      view.type = 'button'
      view.className = 'view-btn'
      view.textContent = `See the ${item.gallery.length} designs`
      view.addEventListener('click', () => openGallery(item))
      entry.append(view)

      entry.addEventListener('mouseenter', event => showPreview(item, event))
      entry.addEventListener('mousemove', movePreview)
      entry.addEventListener('mouseleave', hidePreview)
    }

    list.append(entry)
  }
  if (items.length === 0) {
    showStatus('empty', 'No items match this filter.')
  } else {
    showStatus('ok', `Showing ${items.length} items.`)
  }
}

// Keeps only the items in the chosen category, then draws them
function applyFilter() {
  const category = filter.value
  const visible = category === 'all'
    ? allItems
    : allItems.filter(item => item.category === category)
  renderItems(visible)
}

async function showItems() {
  // DAY 3: show a loading message here

  const result = await getItems()

  if (result.ok) {
    // Find the background picture for each anime in your item data
    for (const [key, category] of Object.entries(animeCategory)) {
      const match = result.data.find(item => item.category === category && item.background)
      if (match) animeBackgrounds[key] = match.background
    }

    // Every design in a set becomes its own stand-alone product
    const standalone = result.data.flatMap(item => item.gallery
      ? item.gallery.map(design => ({
          title: design.title,
          detail: typeLabels[item.category] || item.title,
          category: item.category,
          price: design.price || item.price,
          image: design.image
        }))
      : [item])
    allItems = [...standalone, ...webProducts]
    applyFilter()
  }

  // DAY 3: add the error state here (result.error.message), as on the practice card.
  // By the Team alpha gate, also add the empty and invalid states.
}

// Menu links, promo buttons and category tiles set the filter, then the page scrolls to the shop
document.addEventListener('click', event => {
  const link = event.target.closest('[data-filter]')
  if (!link) return
  filter.value = link.dataset.filter
  applyFilter()
  link.closest('details')?.removeAttribute('open')
})

// Clicking an anime card changes the background; clicking it again switches it off
document.addEventListener('click', event => {
  const card = event.target.closest('[data-anime]')
  if (!card) return
  chooseAnime(card.getAttribute('aria-pressed') === 'true' ? null : card.dataset.anime)
})
animeReset.addEventListener('click', () => chooseAnime(null))

// Closing the pop-ups: Close button, or a click on the dark area outside
for (const box of [dialog, cartDialog, viewer]) {
  box.addEventListener('click', event => {
    if (event.target === box) box.close()
  })
}
galleryClose.addEventListener('click', () => dialog.close())
cartClose.addEventListener('click', () => cartDialog.close())
cartOpen.addEventListener('click', () => cartDialog.showModal())

// Back-to-top button: shows after scrolling down, then scrolls up when clicked
window.addEventListener('scroll', () => { toTop.hidden = window.scrollY < 400 }, { passive: true })
toTop.addEventListener('click', () => window.scrollTo({ top: 0 }))

// 3D tilt on the product cards. The card leans toward the mouse and a shine follows it
list.addEventListener('mousemove', event => {
  const card = event.target.closest('li')
  if (!card) return
  const box = card.getBoundingClientRect()
  const x = (event.clientX - box.left) / box.width - 0.5
  const y = (event.clientY - box.top) / box.height - 0.5
  card.style.setProperty('--rx', `${(-y * 12).toFixed(1)}deg`)
  card.style.setProperty('--ry', `${(x * 12).toFixed(1)}deg`)
  card.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(0)}%`)
  card.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(0)}%`)
})
list.addEventListener('mouseout', event => {
  const card = event.target.closest('li')
  if (!card || card.contains(event.relatedTarget)) return
  for (const name of ['--rx', '--ry', '--mx', '--my']) card.style.removeProperty(name)
})

filter.addEventListener('change', applyFilter)
renderCart()
showItems()