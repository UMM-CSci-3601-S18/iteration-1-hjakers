import {TestBed, ComponentFixture} from '@angular/core/testing';
import {ResourcesComponent} from './resources.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

describe('Resources', () => {

    let component: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [ResourcesComponent], // declare the test component
            providers: [{provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}],
        });

        fixture = TestBed.createComponent(ResourcesComponent);

        component = fixture.componentInstance; // BannerComponent test instance

        // query for the title <h1> by CSS element selector
        de = fixture.debugElement.query(By.css('#main-thing-title'));
        el = de.nativeElement;
    });

    it('displays a greeting', () => {
        fixture.detectChanges();
        expect(el.textContent).toContain(component.title);
    });
});
