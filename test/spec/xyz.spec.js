import {expect} from 'vendor/chai/chai'
import XYZ from 'dist/xyz'

describe('XYZ', () => {
  describe('lab()', () => {
    it('should convert xyz to lab', () => {
      xyz = new XYZ(0.1, 0.1, 0.1)
      lab = xyz.lab()
      expect(lab[0]).to.be.closeTo(37.8424, 0.001)
      expect(lab[1]).to.be.closeTo(3.9632, 0.001)
      expect(lab[2]).to.be.closeTo(2.5964, 0.001)
    })
  })
})
