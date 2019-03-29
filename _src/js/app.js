/*!
 * Version: 1.0.0
 * app.js
 * @author: Audi Liew
 */

// import 'core-js';

import { OPTIONS } from './components/config.js';
import terminal from './components/terminal';
//import Cat from './components/cat';

import barba from '@barba/core';
//import { TweenMax, CSSPlugin } from "gsap/all";
import anime from 'animejs/lib/anime.es.js';
import imagesLoaded from 'imagesloaded';

(function () {
  //let itchy = new Cat();
  //terminal(itchy.makeSound());

  imagesLoaded('#container', () => {
    // images have loaded
    //terminal("Images Loaded")
  });

  // defines a global hook
  barba.hooks.afterEnter((data) => {
    //terminal("hook: after enter");
  });

  barba.hooks.enter((data) => {
    // this hook will be called for each transitions
    //terminal("hook: enterz");
    //terminal(data.next.url);
  });

  barba.init({
    debug: true,
    schema: {
      prefix: 'data-bb'
    },
    transitions: [
      {
        name: 'regular',
        leave({ current, next, trigger }) {
          const done = this.async();

          terminal("transitions leave");

          //*
          anime({
            targets: current.container,
            translateX: -50,
            opacity: 0,
            duration: 1000,
            easing: 'easeInOutExpo',
            complete: () => {
              done();
              terminal('anime doned');
            }
          });
          //*/
        },
        enter({ current, next, trigger }) {
          const done = this.async();
          anime({
            targets: next.container,
            translateX: [30, 0],
            opacity: [0, 1],
            duration: 1000,
            complete: () => {
              done();
            } 
          });
        }
      },
      {
        name: 'home',
        //namespace: 'home',
        to: {
          namespace: 'home'
        },
        leave() {
          terminal('homie leave');
        },
        enter() {
          terminal('homie in');
          const done = this.async();
          terminal("transitions enter");
          anime.set('.grid__item', {
            opacity: 0
          });

          imagesLoaded('#container', () => {
            // images have loaded
            terminal("Images Loaded");
            //*
            anime({
              targets: '.grid__item',
              translateX: [80, 0],
              opacity: [0, 1],
              //duration: 500,
              easing: 'easeInOutCirc',
              //delay: anime.stagger(80, {grid: [2, 5], from: 1}),
              delay: anime.stagger(60),
              complete: () => {
                done();
                terminal('anime doned');
              } 
            });
            //*/
          });
        }
      }
    ]
  });
})(); // Fin