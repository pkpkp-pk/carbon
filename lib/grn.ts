import { nanoid } from 'nanoid'

export function generateGrnId(): string {
  return `GRN-${nanoid(4).toUpperCase()}-${nanoid(4).toUpperCase()}`
}
