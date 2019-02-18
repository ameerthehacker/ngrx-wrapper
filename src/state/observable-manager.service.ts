import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

export interface IObservableMapper {
  observables: Subscription[];
}

@Injectable()
export class ObservableManagerService {
  private observableMappings: any;

  constructor() {
    this.observableMappings = {};
  }

  public add(key: string, observable: Subscription) {
    if(!this.observableMappings[key]) {
      this.observableMappings[key] = [];
    }
    
    const observableMapping = this.observableMappings[key];
    observableMapping.push(observable);
  }

  public destroy(key: string) {
    const observableMapping = this.observableMappings[key];

    if(observableMapping) {
      observableMapping.forEach((observable) => {
        observable.unsubscribe();
        console.log(`Unsubscribing observable in: ${key}`);
      });
    }
  }
}