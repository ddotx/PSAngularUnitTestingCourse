import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HeroComponent} from "./hero.component";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";

describe('HeroComponent (shallow tests)', () => {
  let fixture: ComponentFixture<HeroComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    fixture = TestBed.createComponent(HeroComponent)

  })
  it('should have the correct hero', () => {
    // * arrange
    fixture.componentInstance.hero = {id: 1, name: 'SuperDude', strength: 3}
    // * act
    // * assert
    expect(fixture.componentInstance.hero.name).toEqual('SuperDude')
  })
  it('should render the hero name in an anchor tag', () => {
    // * arrange
    fixture.componentInstance.hero = {id: 1, name: 'SuperDude', strength: 3}
    // * act
    fixture.detectChanges()
    // * assert
    expect(fixture.debugElement.query(By.css('a'))
      .nativeElement.textContent).toContain('SuperDude')
    expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude')
  })
})
