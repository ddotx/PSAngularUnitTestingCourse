import {HeroesComponent} from "./heroes.component";
import {of} from "rxjs";

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let HEROES: { id: number; name: string; strength: number; }[];
  let mockHeroService;

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful Woman', strength: 24},
      {id: 3, name: 'SuperDude', strength: 55}
    ]

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero'])

    component = new HeroesComponent(mockHeroService)
  })

  describe('delete', () => {
    it('should remove the indicated hero from the heroes list', () => {
      mockHeroService.deleteHero.and.returnValue(of(true))
      component.heroes = HEROES

      component.deleteHandler(HEROES[2]) // ? tested that the state of the component changes

      expect(component.heroes.length).toBe(2)
    })

    // ? interaction test
    it('should call deleteHero', () => {
      mockHeroService.deleteHero.and.returnValue(of(true))
      component.heroes = HEROES

      component.deleteHandler(HEROES[2])

      expect(mockHeroService.deleteHero).toHaveBeenCalled()
      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2])
    })
  })
})
