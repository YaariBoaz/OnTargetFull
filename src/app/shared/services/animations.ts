import {
    trigger, transition, state, style, animate
} from '@angular/animations';
import {animation, useAnimation} from '@angular/animations';

export enum States {
    FadeIn = 'fadeIn',
    FadeOut = 'fadeOut',
    Void = 'void',
}

const hasAttribute = (attribute: string) => (
    fromState: string,
    toState: string,
    element: any,
    params: { [key: string]: any }
): boolean => element.hasAttribute(attribute) || (params && params.type === attribute);

export const fade = trigger('fade', [
    state(States.FadeIn, style({opacity: 1})),
    state(States.FadeOut, style({opacity: 0.1})),
    transition(hasAttribute('fast'), animate('1000ms linear')),
    transition(`${States.FadeIn} <=> ${States.FadeOut}`, animate('4000ms linear')),
]);
