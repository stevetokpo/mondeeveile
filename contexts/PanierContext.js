"use client"

import { createContext, useContext, useState, useEffect } from "react"

const PanierContext = createContext()

export function PanierProvider({ children }) {
  const [items, setItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("panier")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("panier", JSON.stringify(items))
  }, [items])

  const addItem = (item) => {
    // Check if item already exists
    const exists = items.find((i) => i.id === item.id && i.type === item.type)

    if (exists) {
      return { success: false, message: "Cet article est déjà dans votre panier" }
    }

    setItems([...items, item])
    return { success: true, message: "Article ajouté au panier" }
  }

  const removeItem = (id, type) => {
    setItems(items.filter((item) => !(item.id === id && item.type === type)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.prix, 0)
  }

  const getItemCount = () => {
    return items.length
  }

  return (
    <PanierContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </PanierContext.Provider>
  )
}

export function usePanier() {
  const context = useContext(PanierContext)
  if (!context) {
    throw new Error("usePanier must be used within PanierProvider")
  }
  return context
}
