import * as React from "react"
import { Bubble, BubbleProps } from "./bubble"

export interface MessageProps extends BubbleProps {
  id: string
}

export function Message(props: MessageProps) {
  return <Bubble {...props} />
}
