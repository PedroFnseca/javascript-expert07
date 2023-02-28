export default class View {
  #btnInit = document.querySelector('#init')
  #statusElement = document.querySelector('#status')
  #videoElement = document.querySelector('#video')
  #videoFrameCanvas = document.createElement('canvas');
  #canvasContext = this.#videoFrameCanvas.getContext('2d', { willReadFrequently: true })

  getVideoFrame(video){
    const canvas = this.#videoFrameCanvas
    const [ width, height ] = [ video.videoWidth, video.videoHeight ]
    canvas.width = width
    canvas.height = height

    this.#canvasContext.drawImage(video, 0, 0, width, height)
    return this.#canvasContext.getImageData(0, 0, width, height)
  }

  togglePlayVideo(){
    if(this.#videoElement.paused){
      this.#videoElement.play()
      return
    }
    this.#videoElement.pause()
  }

  enableButton(){
    this.#btnInit.disabled = false
  }

  configureOnButtonInitClick(fn){
    this.#btnInit.addEventListener('click', fn)
  }

  log(text){
    this.#statusElement.innerHTML = text
  }

}