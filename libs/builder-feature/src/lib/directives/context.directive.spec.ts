import { ContextDirective } from './context.directive';
const elRefStub = {
  nativeElement: {
    parentElement: {
      localName: 'editor'
    }
  }
}

describe('ContextDirective', () => {

  it('should create an instance', () => {
    const directive = new ContextDirective(elRefStub);
    expect(directive).toBeTruthy();
  });
});
