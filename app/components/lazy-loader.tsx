import React from 'react'

interface LazyVideoPlayerProps {
  src: string
}

const LazyVideoPlayer: React.FC<LazyVideoPlayerProps> = ({ src }) => {
  return (
    <div className="aspect-w-16 aspect-h-9">
      <video src={src} controls className="w-full h-full rounded-lg shadow-lg object-cover" />
    </div>
  )
}

export default LazyVideoPlayer

