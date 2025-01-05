import React from 'react'

interface LazyVideoPlayerProps {
  src: string
}

const LazyVideoPlayer: React.FC<LazyVideoPlayerProps> = ({ src }) => {
  return (
    <div className="relative w-full h-[150px]">
      <video 
        src={src} 
        controls 
        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg object-contain"
      />
    </div>
  )
}

export default LazyVideoPlayer


