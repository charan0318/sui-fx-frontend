"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  containerClassName,
  colors = [[0, 255, 255]],
  showGradient = true,
}: {
  animationSpeed?: number;
  containerClassName?: string;
  colors?: number[][];
  showGradient?: boolean;
}) => {
  const primaryColor = colors[0] || [0, 255, 255];
  const colorString = `rgb(${primaryColor[0]}, ${primaryColor[1]}, ${primaryColor[2]})`;
  
  return (
    <div className={cn("h-full relative w-full overflow-hidden", containerClassName)}>
      <div className="absolute inset-0">
        {/* Animated dots matrix using CSS */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${colorString} 1px, transparent 0)`,
            backgroundSize: '20px 20px',
            animation: `matrix-flow ${2 / animationSpeed}s linear infinite`,
          }}
        />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${colorString} 0.5px, transparent 0)`,
            backgroundSize: '15px 15px',
            animation: `matrix-flow ${3 / animationSpeed}s linear infinite reverse`,
          }}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" />
      )}
    </div>
  );
};
