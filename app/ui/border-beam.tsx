import React from "react";

export const BorderBeam: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-border-beam-top" />
        <div className="absolute bottom-0 right-0 top-0 w-[2px] bg-gradient-to-b from-pink-500 via-red-500 to-yellow-500 animate-border-beam-right" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 animate-border-beam-bottom" />
        <div className="absolute bottom-0 left-0 top-0 w-[2px] bg-gradient-to-t from-yellow-500 via-red-500 to-pink-500 animate-border-beam-left" />
      </div>
    </div>
  );
};