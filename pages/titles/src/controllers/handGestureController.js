import { prepareRunChecker } from "../../../../lib/shared/util.js"

const { shouldRun: scrollShouldRun } = prepareRunChecker({timerDelay: 200 })
const { shouldRun: clickShouldRun } = prepareRunChecker({timerDelay: 500 })

export default class HandGestureController {
  #view
  #service
  #camera
  #lastdirection = {
    direction: '',
    y: 0
  }
  constructor ({ view, service, camera }) {
    this.#view = view
    this.#service = service
    this.#camera = camera
  }

  async init() {
    return this.#loop()
  }

  #scrollPage(direction){
    const pixelsPerScroll = 100

    // Rever
    // const maxHeigth = globalThis.screen.availHeight
    // const minHeigth = 0

    // const toDown = this.#lastdirection.y + pixelsPerScroll
    // const toUp = this.#lastdirection.y - pixelsPerScroll

    if(this.#lastdirection.direction === direction){
      this.#lastdirection.y = (
        direction === 'scroll-down' ?
          this.#lastdirection.y + pixelsPerScroll :
          this.#lastdirection.y - pixelsPerScroll
      )
    } else {
      this.#lastdirection.direction = direction
    }

    this.#view.scrollPage(this.#lastdirection.y)
  }

  async #estimateHands(){
    try {
      const hands = await this.#service.estimateHandes(this.#camera.video)
      this.#view.clearCanvas()

      if(hands?.length > 0) this.#view.drawResults(hands)

      for await (const { event, x, y } of this.#service.detectGestures(hands)) {
        if(event === 'click'){
          if(!clickShouldRun()) continue

          this.#view.clickOnElement(x, y)
          continue
        }
        if(event.includes('scroll')){
          if(!scrollShouldRun()) continue

          this.#scrollPage(event)
        }
      }

    } catch (error) {
      console.error('Deu ruim em estimar as hands', error)
    }
  }

  async #loop(){
    await this.#service.initializeDetector()
    await this.#estimateHands()
    this.#view.loop(this.#loop.bind(this))
  }

  static async initialize(deps) {
    const controller = new HandGestureController(deps)
    return controller.init()
  }
}