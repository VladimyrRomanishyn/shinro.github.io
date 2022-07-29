import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorComponent } from './editor.component';

const eventStub = {
  x: 200,
  y: 200,
}

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open / close contextmenu', () => {
    jest.spyOn(component.contextPanel.nativeElement, 'getBoundingClientRect').mockReturnValue({width: 100, height: 100} as unknown)
    jest.spyOn(document.body, 'getBoundingClientRect').mockReturnValue({width: 1000, height: 1000} as unknown as DOMRect)
    component.contextEvent(eventStub as PointerEvent);
    expect(component.contextMenuStyles).toStrictEqual({left: '202px', top: '200px', opacity: 1});
    component.contextEvent(null as unknown as PointerEvent);
    expect(component.contextMenuStyles).toStrictEqual({left: '', top: '', opacity: 0})
  })
});
