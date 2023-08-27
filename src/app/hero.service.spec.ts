import {inject, TestBed} from "@angular/core/testing";
import {HeroService} from "./hero.service";
import {MessageService} from "./message.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('HeroService', () => {
  let mockMessageService
  let httpTestingController: HttpTestingController
  let heroService: HeroService

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add'])

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        {provide: MessageService, useValue: mockMessageService}
      ]
    })

    // * access the dependency injection registry with TestBed.inject
    // httpTestingController = TestBed.inject(HttpTestingController)
    // let msgSvc = TestBed.inject(MessageService)
    // heroService = TestBed.inject(HeroService)
  })

  describe('getHero', () => {
    it('should call get with the correct URL',
      inject([HeroService, HttpTestingController],
        (service: HeroService, controller: HttpTestingController) => {
          // let heroService = TestBed.inject(HeroService)
          // * 1---call getHero
          service.getHero(4).subscribe(hero => {
              // expect(hero.id).toBe(4)
          })
          // * 2---test that the URL is correct
          // * expectOne returns a TestRequest object
          // * expectOne throws an error if there are multiple requests that match the criteria
          // * expectOne throws an error if there are no requests that match the criteria
          const req = controller.expectOne('api/heroes/4')
          // * flush returns the mock data as the response
          req.flush({id: 4, name: 'SuperDude', strength: 100})
          expect(req.request.method).toBe('GET')
          // * 3---verify that it was only the request we expected
         controller.verify()
        }))
  })
})
