// components/admin/SidebarNavigation.tsx - Versión mejorada con Framer Motion
'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChevronRight, HiSparkles } from 'react-icons/hi'
import { MenuItem } from '@/types/dashboard'

interface SidebarNavigationProps {
  menuItems: MenuItem[]
  pathname: string
}

const menuContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const menuItemVariants = {
  initial: { 
    x: -30, 
    opacity: 0,
    scale: 0.95
  },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      mass: 1
    }
  },
  hover: {
    x: 6,
    scale: 1.02,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}

const iconVariants = {
  initial: { scale: 0.8, rotate: -10 },
  animate: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20
    }
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 15
    }
  }
}

const activeIndicatorVariants = {
  initial: { 
    scale: 0,
    opacity: 0
  },
  animate: { 
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20
    }
  },
  pulse: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
}

const backgroundGlowVariants = {
  initial: { 
    opacity: 0,
    scale: 0.8
  },
  hover: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const
    }
  }
}

export function SidebarNavigation({ menuItems, pathname }: SidebarNavigationProps) {
  return (
    <motion.div 
      variants={menuContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-2"
    >
      {menuItems.map((item, index) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        const Icon = item.icon

        return (
          <motion.div
            key={item.href}
            variants={menuItemVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative"
          >
            <Link href={item.href} className="block">
              {/* Background glow effect */}
              <motion.div
                variants={backgroundGlowVariants}
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 blur-sm -z-10"
                initial="initial"
                whileHover="hover"
              />
              
              {/* Main container */}
              <div className={`
                relative group flex items-center gap-x-4 rounded-xl p-4 transition-all duration-300
                ${isActive
                  ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-lg shadow-red-500/30'
                  : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:shadow-md hover:shadow-red-500/20'
                }
              `}>
                {/* Left accent line for active items */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
                      className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full"
                      style={{ originY: 0.5 }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon container */}
                <motion.div 
                  variants={iconVariants}
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                    ${isActive 
                      ? 'bg-white/20 text-white backdrop-blur-sm' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-white/20 group-hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 relative z-10" />
                  
                  {/* Icon background effect */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-white/10 rounded-lg"
                  />
                </motion.div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className={`
                    font-bold text-base transition-all duration-300
                    ${isActive ? 'text-white' : 'group-hover:text-white'}
                  `}>
                    {item.name}
                  </div>
                  {item.description && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className={`
                        text-xs mt-1 transition-all duration-300
                        ${isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-white/80'}
                      `}
                    >
                      {item.description}
                    </motion.div>
                  )}
                </div>

                {/* Right side elements */}
                <div className="flex items-center gap-2">
                  {/* Badge for notifications (if applicable) */}
                  {item.badge && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.3,
                        type: "spring" as const,
                        stiffness: 300,
                        damping: 20 
                      }}
                      className={`
                        px-2 py-1 rounded-full text-xs font-bold
                        ${isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-red-100 text-red-600 group-hover:bg-white/20 group-hover:text-white'
                        }
                      `}
                    >
                      {item.badge}
                    </motion.div>
                  )}

                  {/* Active indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        variants={activeIndicatorVariants}
                        initial="initial"
                        animate={["animate", "pulse"]}
                        exit="initial"
                        className="flex items-center justify-center w-6 h-6"
                      >
                        <HiSparkles className="h-4 w-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Arrow indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0, 
                      x: isActive ? 0 : -5 
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center w-5 h-5"
                  >
                    <HiChevronRight className="h-4 w-4" />
                  </motion.div>
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-white/10 pointer-events-none"
                />
              </div>
            </Link>

            {/* Bottom glow line for active items */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  transition={{ 
                    delay: 0.1,
                    type: "spring" as const, 
                    stiffness: 300, 
                    damping: 30 
                  }}
                  className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"
                  style={{ originX: 0.5 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </motion.div>
  )
}