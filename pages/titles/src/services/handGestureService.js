import { knownGestures, gestureStrings } from "../util/gestures.js"

export default class HandGestureService {
  #gestureStimator
  #handPoseDetection
  #handsVersion
  #detector = null
  constructor({ fingerpose, handPoseDetection, handsVersion }) {
    this.#gestureStimator = new fingerpose.GestureEstimator(knownGestures)
    this.#handPoseDetection = handPoseDetection
    this.#handsVersion = handsVersion
  }

  async estimate(keypoints3D){
    const predictions = await this.#gestureStimator.estimate(
      this.#getLandMarksFromKeyPoints(keypoints3D),
      9 // porcentagem de confiança do gesto (%)
    )

    return predictions.gestures
  }

  async * detectGestures(predictions) {
    for (const hand of predictions) {
      if(!hand.keypoints3D) continue

      const gestures = await this.estimate(hand.keypoints3D)
      if(!gestures.length) continue

      const result = gestures.reduce(
        (previous, current) => (previous.score > current.score) ? previous : current
      )

      const { x, y } = hand.keypoints.find(keypoint => keypoint.name === 'index_finger_tip')

      yield { event: result.name, x, y}

      console.log('detected', gestureStrings[result.name])
    }
  }

  #getLandMarksFromKeyPoints(keypoints3D){
    return keypoints3D.map(({ x, y, z }) => {
      return [ x, y, z]
    })
  }

  async estimateHandes(video){
    return this.#detector.estimateHands(video, {
      flipHorizontal: true, // since images are being fed from a webcam
    })
  }

  async initializeDetector() {
    if(this.#detector) return this.#detector

    const detectorConfig = {
      runtime: 'mediapipe',
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${this.#handsVersion}`,
      modelType: 'lite', 
      maxHands: 2
    }

    this.#detector = await this.#handPoseDetection.createDetector(
      handPoseDetection.SupportedModels.MediaPipeHands,
      detectorConfig
    )

    return this.#detector
  }
}