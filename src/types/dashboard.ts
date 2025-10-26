// types/admin.ts
import { IconBaseProps } from 'react-icons/lib'

export interface SubMenuItem {
  name: string
  href: string
  badge?: number | string
}

export interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<IconBaseProps>
  description: string
  badge?: number | string
  subItems?: SubMenuItem[]
}