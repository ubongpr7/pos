"use client"

import { useState, useRef, useEffect } from "react"
import { X, ScanBarcode } from "lucide-react"
import { Card } from "@/components/ui/card"

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [permission, setPermission] = useState<boolean | "loading">("loading")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  // Handle escape key and click outside
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  useEffect(() => {
    let stream: MediaStream | null = null

    const setupCamera = async () => {
      try {
        setPermission("loading")

        // Check if navigator.mediaDevices is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API is not available in your browser")
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
            setPermission(true)
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        setError(err instanceof Error ? err.message : "Camera access denied. Please check your browser permissions.")
        setPermission(false)
      }
    }

    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Actual barcode scanning (in a real app, would use a library like quagga.js)
  const scanBarcode = () => {
    if (!canvasRef.current || !videoRef.current) return

    setScanning(true)

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Capture frame from video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // In a real implementation, we would process the image to detect barcodes
    // For now, simulate a scan with a random barcode after a short delay
    setTimeout(() => {
      const mockBarcodes = ["5901234123457", "4001234567890", "9781234567897"]
      const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)]

      setScanning(false)
      onScan(randomBarcode)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card ref={modalRef} className="w-full max-w-md overflow-hidden shadow-xl">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <ScanBarcode className="mr-2" size={20} />
            <h3 className="text-lg font-medium">Scan Barcode</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200  transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {permission === "loading" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Requesting camera access...</p>
            </div>
          )}

          {permission === false && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error || "Camera access is required to scan barcodes."}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          )}

          {permission === true && (
            <>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-1/2 border-2 border-red-500 rounded-lg opacity-70 pointer-events-none"></div>
                </div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <p className="text-sm text-gray-500 mb-4 text-center">Position the barcode within the frame to scan</p>
              <div className="flex justify-center">
                <button
                  className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                    scanning ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={scanBarcode}
                  disabled={scanning}
                >
                  {scanning ? (
                    <>
                      <span className="inline-block mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Scanning...
                    </>
                  ) : (
                    "Scan"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
