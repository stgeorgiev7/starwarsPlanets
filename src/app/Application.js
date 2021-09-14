import config from '../config';
import EventEmitter from 'eventemitter3';

const EVENTS = {
  APP_READY: 'app_ready',
};

/**
 * App entry point.
 * All configurations are described in src/config.js
 */
export default class Application extends EventEmitter {
  constructor() {
    super();

    this.config = config;
    this.data = {};

    this.init();
  }

  static get events() {
    return EVENTS;
  }

  /**
   * Initializes the app.
   * Called when the DOM has loaded. You can initiate your custom classes here
   * and manipulate the DOM tree. Task data should be assigned to Application.data.
   * The APP_READY event should be emitted at the end of this method.
   */
   async getData(point) {
    const url = new URL(String(point));
    const planets = await fetch(url, {
      method: "GET",
    });
     return await planets.json();
  }

  async init() {
    // Initiate classes and wait for async operations here.
    let dataFromPromise = await this.getData("https://swapi.boom.dev/api/planets?page/");

    const planetsArray = [];
    this.data.count = 0;

    while (dataFromPromise.next !== null) {
      dataFromPromise.results.forEach(element => {
        planetsArray.push(element);
        this.data.count++;
      });
      let next = dataFromPromise.next;
      dataFromPromise = await this.getData(next);
    }

    dataFromPromise.results.forEach(element => {
      planetsArray.push(element);
      this.data.count++;
    });

    this.data.planets = planetsArray;

    console.log(this.data.planets);
    console.log(this.data.count);
    
    this.emit(Application.events.APP_READY);
  }

  
}

