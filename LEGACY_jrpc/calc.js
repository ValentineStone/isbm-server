module.exports = ({
  workWidth,
  workHeight,
  frameWidth,
  framePrice,
  embroideryStretching = false,
  cardboardCount = 0,
  passepartoutWidth = 0,
  passepartoutCount = 0,
  glass = 'regular'
} = {}) => {
  workWidth += 2 * passepartoutWidth
  workHeight += 2 * passepartoutWidth

  let workPerimeter = 2 * (workWidth + workHeight)
  let workArea = workWidth * workHeight

  let montageTotal = 800
    * (workWidth + 2 * frameWidth)
    * (workHeight + 2 * frameWidth)
  montageTotal = montageTotal < 200 ? 200 : montageTotal

  let frameTotal = (workPerimeter + frameWidth * 8 + .1) * framePrice

  let embroideryStretchingTotal = (embroideryStretching ? 1 : 0) * workArea * 1200
  let cardboardTotal = workArea * 1000 * cardboardCount
  let passepartoutTotal = passepartoutCount * workArea * 1200
  let regularGlassTotal = (glass === 'regular' ? 1 : 0) * workArea * 1300
  let antiReflectiveGlassTotal = (glass === 'antiReflective' ? 1 : 0) * workArea * 3300
  let museumGlassTotal = (glass === 'museum' ? 1 : 0) * workArea * 15000

  let extrasTotal =
    embroideryStretchingTotal
    + cardboardTotal
    + passepartoutTotal
    + regularGlassTotal
    + antiReflectiveGlassTotal
    + museumGlassTotal

  let total = montageTotal + frameTotal + extrasTotal

  return total
}