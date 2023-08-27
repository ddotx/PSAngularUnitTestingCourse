import {Component, Directive, Input, NO_ERRORS_SCHEMA} from "@angular/core";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HeroesComponent} from "./heroes.component";
import {HeroService} from "../hero.service";
import {of} from "rxjs";
import {Hero} from "../hero";
import {By} from "@angular/platform-browser";
import {HeroComponent} from "../hero/hero.component";

/** Child Component
 * <a routerLink="/detail/{{hero.id}}">
 *   <span class="badge">{{hero.id}}</span> {{hero.name}}
 * </a>
 */
@Directive({
  selector: '[routerLink]',
  host: {'(click)': 'onClick()'}  // * listen for the click event and call the onClick method
})
class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any
  navigatedTo: any = null

  onClick() {
    this.navigatedTo = this.linkParams
  }
}

describe('HeroesComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>
  let mockHeroService
  let HEROES

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful Woman', strength: 24},
      {id: 3, name: 'SuperDude', strength: 55}
    ]
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero'])
    TestBed.configureTestingModule({
      declarations: [HeroesComponent, HeroComponent, RouterLinkDirectiveStub],
      providers: [
        {provide: HeroService, useValue: mockHeroService}
      ],
      // schemas: [NO_ERRORS_SCHEMA]
    })
    fixture = TestBed.createComponent(HeroesComponent)
  })

  //  * Finding Elements by Directive
  it('should render each hero as a HeroComponent', () => {

    mockHeroService.getHeroes.and.returnValue(of(HEROES))

    fixture.detectChanges() // * run ngOnInit

    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent))
    expect(heroComponentDEs.length).toEqual(3)
    for (let i = 0; i < heroComponentDEs.length; i++) {
      expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i])
    }
  })

  /**
   * === Testing DOM Interaction and Routing Components ===
   * Emitting Events from Children
   */
  it('should call heroService.deleteHero when the Hero Component\'s delete button is clicked', () => {
    spyOn(fixture.componentInstance, 'deleteHandler')
    mockHeroService.getHeroes.and.returnValue(of(HEROES))
    fixture.detectChanges() // * run ngOnInit
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent))

    heroComponents[0].query(By.css('button'))
      .triggerEventHandler('click', {stopPropagation: () => {}})

    /**
     * if we know that we've wired up that button correctly,
     * we can actually just tell the child component to raise its delete event
     * and not trigger it through the DOM
     */
    // heroComponents[1].componentInstance.delete.emit(undefined)
    heroComponents[1].triggerEventHandler('delete', null)

    expect(fixture.componentInstance.deleteHandler).toHaveBeenCalledWith(HEROES[0])
    expect(fixture.componentInstance.deleteHandler).toHaveBeenCalledTimes(2)
    // * .emit(null)
    // * (<HeroComponent>heroComponents[0].component
  })

  /**
   * === Testing DOM Interaction and Routing Components ===
   * Interacting with Input Boxes
   */
  it('should add a new hero to the hero list when the add button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES))
    fixture.detectChanges() // * run ngOnInit

    const name = 'Mr. Ice'
    mockHeroService.addHero.and.returnValue(of({id: 5, name, strength: 4}))

    // * 1---get and simulate the input element
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement
    inputElement.value = name

    // * 2---do the same thing for the button
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0]
    addButton.triggerEventHandler('click', null)

    fixture.detectChanges()
    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent

    expect(heroText).toContain(name)
  })

  /**
   * Testing the RouterLink
   */
  it('should have the correct route for the first hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES))
    fixture.detectChanges() // * run ngOnInit

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent))
    let routerLink = heroComponents[0].query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub)

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null)

    expect(routerLink.navigatedTo).toBe('/detail/1')
  })
})
