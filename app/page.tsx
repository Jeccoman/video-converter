import VideoUploaderWithBase64Delay from "./components/video-uploader"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Video Uploader</h1>
        <VideoUploaderWithBase64Delay />
      </div>
    </div>
  )
}

