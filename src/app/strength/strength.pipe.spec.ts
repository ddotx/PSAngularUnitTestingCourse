import {StrengthPipe} from "./strength.pipe";

describe('strength pipe', () => {
  it('should display weak if strength is 5', () => {
    // * arrange
    let pipe = new StrengthPipe()

    // * act
    let val = pipe.transform(5)

    // * assert
    expect(val).toEqual('5 (weak)')
  })

  it('should display strong if strength is 10', () => {
    // * arrange
    let pipe = new StrengthPipe()

    // * act
    let val = pipe.transform(10)

    // * assert
    expect(val).toEqual('10 (strong)')
  })

  it('should display unbelievable if strength is 20', () => {
    // * arrange
    let pipe = new StrengthPipe()

    // * act
    let val = pipe.transform(20)

    // * assert
    expect(val).toEqual('20 (unbelievable)')
  })
})
