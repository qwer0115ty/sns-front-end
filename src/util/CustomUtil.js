export default {
  bytesToMb (bytes) {
    if (bytes === 0) return 0
    return bytes / Math.pow(1024, 2)
  }
}
