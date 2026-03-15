'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type CartItem = {
  id: string
  spec: string
  brand: string
  price: number
  quantity: number
  maxStock: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  totalAmount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('b2b-cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) { }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('b2b-cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        if (existing.quantity >= item.maxStock) {
          alert('재고 수량을 초과하여 담을 수 없습니다.')
          return prev
        }
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          if (qty > i.maxStock) {
            alert('재고 수량을 초과할 수 없습니다.')
            return i
          }
          return { ...i, quantity: qty }
        }
        return i
      })
    )
  }

  const clearCart = () => setItems([])

  const totalAmount = items.reduce((acc, i) => acc + (i.price * i.quantity), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
