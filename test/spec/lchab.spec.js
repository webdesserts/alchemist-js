import {expect} from 'vendor/chai/chai'
import LCHab from 'dist/lch'

describe('LCHab', () => {
  describe('lab()', () => {
    it('should convert lch to lab', () => {
      lchab = new LCHab(41, 20, 70)
      lab = lchab.lab()
      expect(lab[0]).to.be.closeTo(41.0000, 0.001)
      expect(lab[1]).to.be.closeTo(6.8404, 0.001)
      expect(lab[2]).to.be.closeTo(18.7939, 0.001)
    })
  })

  xdescribe('rgb()', () => {
    it('should convert lch to rgb', () => {
      lchab = new LCHab(41.9647, 0, 270)
      rgb = lchab.rgb()
      expect(rgb[0]).to.be.closeTo(99, 0.001)
      expect(rgb[1]).to.be.closeTo(99, 0.001)
      expect(rgb[2]).to.be.closeTo(99, 0.001)
    })
  })
})
