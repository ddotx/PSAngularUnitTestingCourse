import {HeroService} from "../hero.service";
import {HeroDetailComponent} from "./hero-detail.component";
import {ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync} from "@angular/core/testing";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {of} from "rxjs";
import {FormsModule} from "@angular/forms";

describe('HeroDetailComponent', () => {
  let mockActivatedRoute, mockHeroService, mockLocation
  let fixture: ComponentFixture<HeroDetailComponent>

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {paramMap: {get: () => '3'}}
    }
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero'])
    mockLocation = jasmine.createSpyObj(['back'])

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: HeroService, useValue: mockHeroService},
        {provide: Location, useValue: mockLocation}
      ]
    })

    fixture = TestBed.createComponent(HeroDetailComponent)
  })

  it('should render hero name in a h2 tag', () => {
    mockHeroService.getHero.and.returnValue(of({id: 3, name: 'SuperDude', strength: 100}))
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE')
  })

  xit('should call updateHero when save is called', (done) => {
    mockHeroService.updateHero.and.returnValue(of({}))
    fixture.detectChanges()

    fixture.componentInstance.save()
    // ! not work on debounce (debounce is asynchronous) -> use the done function

    setTimeout(() => {
      expect(mockHeroService.updateHero).toHaveBeenCalled()
      done()
    }, 300)
    // expect(mockHeroService.updateHero).toHaveBeenCalled()
  })

  /**
   * Using the fakeAsync helper function
   * * can be used with Observables and Promises
   */
  it('should call updateHero when save is called (async)', fakeAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}))
    // fixture.detectChanges()

    fixture.componentInstance.save()
    // tick(250)
    flush()
    expect(mockHeroService.updateHero).toHaveBeenCalled()
  }))

  /**
   * PROMISES
   * Using the waitForAsync helper function
   */
  it('should call updateHero when save is called (promise)', waitForAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}))

    fixture.componentInstance.savePromise()
    fixture.whenStable().then(() => {
      expect(mockHeroService.updateHero).toHaveBeenCalled()
    })
  }))
})
