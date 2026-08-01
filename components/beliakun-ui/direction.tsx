import * as React from "react"

export type Direction = "ltr" | "rtl"

const DirectionContext = React.createContext<Direction>("ltr")

export interface DirectionProviderProps {
  dir?: Direction
  children: React.ReactNode
}

export function DirectionProvider({ dir = "ltr", children }: DirectionProviderProps) {
  return (
    <DirectionContext.Provider value={dir}>
      <div dir={dir}>{children}</div>
    </DirectionContext.Provider>
  )
}

export function useDirection() {
  return React.useContext(DirectionContext)
}
