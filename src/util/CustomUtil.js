export default {
  bytesToMb (bytes) {
    if (bytes === 0) return 0
    return bytes / Math.pow(1024, 2)
  },
  setImgPreview (file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    let tempImage = new Image()
    reader.onload = _ => {
      tempImage.src = reader.result
    }
    let shiftX = 0
    let shiftY = 0
    let orgshort = 0
    return new Promise((resolve, reject) => {
      tempImage.onload = function () {
        if (this.width > this.height) {
          orgshort = this.height
          shiftX = (this.width - this.height) / 2
        } else {
          orgshort = this.width
          shiftY = (this.height - this.width) / 2
        }
        let canvas = document.createElement('canvas')
        let canvasContext = canvas.getContext('2d')
        canvas.width = orgshort
        canvas.height = orgshort
        canvasContext.drawImage(this, shiftX, shiftY, orgshort, orgshort, 0, 0, orgshort, orgshort)
        resolve(canvas.toDataURL('image/png'))
      }
    })
  }
}
