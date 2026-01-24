export interface CartItem {
  productId: string
  name: string
  billingPeriod: 'monthly' | 'annual'
  priceMonthly: number
  priceAnnual: number
  selectedPrice: number
}

export interface CartSummary {
  totalMonthly: number
  totalAnnual: number
  totalEstimatedAnnual: number
}

const STORAGE_KEY = 'solwed_cart'
const EVENT_NAME = 'solwedCartChanged'

function notify() {
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(cart: CartItem[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  notify()
}

export function addToCart(item: CartItem) {
  const cart = getCart()
  const existing = cart.findIndex(i => i.productId === item.productId)
  if (existing >= 0) {
    cart[existing] = item
  } else {
    cart.push(item)
  }
  saveCart(cart)
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter(i => i.productId !== productId)
  saveCart(cart)
}

export function clearCart() {
  saveCart([])
}

export function getCartSummary(cart: CartItem[]): CartSummary {
  const totalMonthly = cart
    .filter(i => i.billingPeriod === 'monthly')
    .reduce((sum, i) => sum + i.selectedPrice, 0)

  const totalAnnual = cart
    .filter(i => i.billingPeriod === 'annual')
    .reduce((sum, i) => sum + i.selectedPrice, 0)

  const totalEstimatedAnnual = totalMonthly * 12 + totalAnnual

  return { totalMonthly, totalAnnual, totalEstimatedAnnual }
}

export function isInCart(productId: string): boolean {
  return getCart().some(i => i.productId === productId)
}

export { EVENT_NAME }
