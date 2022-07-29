import { mouseEventsDirective } from './mouseEvents.directive';
const elRefStub = {
  nativeElement: {
    parentElement: {
      localName: 'editor'
    }
  }
};
const eventStub = {
  preventDefault: () => {},
  target: {
    localName: 'div',
    parentElement: {
      localName: 'editor'
    }
  }
}

describe('ContextDirective', () => {
  let directive: mouseEventsDirective;

  beforeEach(() => {
     directive = new mouseEventsDirective(elRefStub);
  })

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
    expect(directive.localName === elRefStub.nativeElement.parentElement.localName);
  });

  it( 'should call contextEvent with stub', () => {
    const spy = jest.spyOn(directive.contextEvent, 'emit');
    directive.context(eventStub as unknown as PointerEvent);
    expect(spy).toHaveBeenCalledWith(eventStub);
  });
});
