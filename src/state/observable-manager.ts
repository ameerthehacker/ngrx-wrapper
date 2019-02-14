import { OnDestroy, Injector } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Stateful } from './state';
import { ObservableManagerService } from './observable-manager.service';

export abstract class ObservableManager implements OnDestroy {
  protected readonly uid = UUID.UUID();
  private statefulService: Stateful;
  private observableManagerService: ObservableManagerService;

  constructor(private injector: Injector) {
    this.statefulService = injector.get(Stateful);
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
        console.log(response);
        //response.observable.unsubsribe();
      })
    });
  }

  public ngOnDestroy() {
    this.observableManagerService.destroy(this.uid)
  }
}