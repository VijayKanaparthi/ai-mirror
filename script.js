const video = document.getElementById("video")

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo)

//Access Web Cam
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  )
}

video.addEventListener("play", () => {
  // Create canvas and attach to document
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)

  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  // Run every 100ms
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()

    // Resize results to video size
    const resized = faceapi.resizeResults(detections, displaySize)

    // Clear old drawings
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)

    // Draw face box, landmarks, and expression
    faceapi.draw.drawDetections(canvas, resized)
    faceapi.draw.drawFaceLandmarks(canvas, resized)
    faceapi.draw.drawFaceExpressions(canvas, resized)
  }, 100)
})
