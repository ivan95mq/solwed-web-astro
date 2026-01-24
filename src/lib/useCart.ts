import { useState, useEffect, useCallback } from 'react'
import {
  getCart,
  addToCart as addItem,
  removeFromCart as removeItem,
  clearCart as clearItems,
  getCartSummary,
  isInCart,
  EVENT_NAME,
  type CartItem,
  type CartSummary,
} from './cart'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  const sync = useCallback(() => {
    setCart(getCart())
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener(EVENT_NAME, sync)
    return () => window.removeEventListener(EVENT_NAME, sync)
  }, [sync])

  const add = useCallback((item: CartItem) => {
    addItem(item)
  }, [])

  const remove = useCallback((productId: string) => {
    removeItem(productId)
  }, [])

  const clear = useCallback(() => {
    clearItems()
  }, [])

  const summary: CartSummary = getCartSummary(cart)

  return {
    cart,
    add,
    remove,
    clear,
    isInCart,
    itemCount: cart.length,
    summary,
  }
}
