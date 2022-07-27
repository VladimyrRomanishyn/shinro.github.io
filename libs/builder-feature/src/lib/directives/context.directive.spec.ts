import { ContextDirective } from './context.directive';
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
  let directive: ContextDirective;

  beforeEach(() => {
     directive = new ContextDirective(elRefStub);
  })

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
    expect(directive.localName === elRefStub.nativeElement.parentElement.localName);
  });

  it( 'should call contextEvent', () => {
    const spy = jest.spyOn(directive.contextEvent, 'emit');
    directive.context(eventStub as unknown as PointerEvent);
    expect(spy).toHaveBeenCalledWith(eventStub);
  });
});
