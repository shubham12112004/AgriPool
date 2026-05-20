import React from 'react'
import { Sprout, Tractor } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function AgriPoolLogo({ className = "w-9 h-9", iconSizeMultiplier = 1 }) {
  return (
    <div className={cn("relative rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-950 border border-emerald-500/20 flex items-center justify-center overflow-visible shadow-lg shrink-0", className)}>
      <div className="relative w-7 h-7 flex items-center justify-center">
        {/* Main Plant Icon (shifted slightly right) */}
        <Sprout size={18 * iconSizeMultiplier} className="text-emerald-300 translate-x-[2.5px] translate-y-[-1px]" />
        
        {/* Small Tractor Icon just touching the bottom-left of the plant */}
        <Tractor 
          size={10 * iconSizeMultiplier} 
          className="text-amber-400 absolute bottom-[2px] left-[2px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" 
        />
      </div>
    </div>
  )
}
