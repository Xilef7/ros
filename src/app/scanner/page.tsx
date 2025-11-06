'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import jsQR from 'jsqr'

export default function ScannerPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string>('')
  const [scanning, setScanning] = useState(false)

  function scanQRCode() {
    if (!canvasRef.current || !videoRef.current || !scanning) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight
      canvas.width = video.videoWidth
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        setScanning(false)
        router.push(code.data)
        return
      }
    }

    requestAnimationFrame(() => scanQRCode())
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setScanning(true)
        scanQRCode()
      }
    } catch (err) {
      setError('Unable to access camera')
      console.error(err)
    }
  }

  useEffect(() => {
    startCamera()
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        if (!canvas || !context) return

        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0)

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        )
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          router.push(code.data)
        } else {
          setError('No QR code found in image')
        }
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-sm aspect-square object-cover rounded-lg"
      />
      <canvas ref={canvasRef} className="hidden" />

      <div className="w-full max-w-sm">
        <label className="block w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 text-center cursor-pointer">
          Upload QR Code Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
