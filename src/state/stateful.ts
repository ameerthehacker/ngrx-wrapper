import { OnDestroy, Injector } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { StatefulService } from './state.service';
import { ObservableManagerService } from './observable-manager.service';

export abstract class Stateful implements OnDestroy {
  protected readonly uid = UUID.UUID();
  private statefulService: StatefulService;
  private observableManagerService: ObservableManagerService;

  constructor(private injector: Injector) {
    this.statefulService = injector.get(StatefulService);
    this.observableManagerService = injector.get(ObservableManagerService);
  }

  public set(key: string, value: any) {
    this.statefulService.set(key, value);
  }

  public listen(key: string, callback) {
    const observable = this.statefulService.listen(key, callback);
    this.observableManagerService.add(this.uid, observable);
  }

  public get(key: string) {
    return new Promise((resolve ,reject) => {
      this.statefulService.get(key).then((response: any) => {
        resolve(response.result);
        //response.observable.unsubsribe();
      })
    });
  }

  public ngOnDestroy() {
    this.observableManagerService.destroy(this.uid)
  }
}