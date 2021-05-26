import { Directive, HostListener } from "@angular/core";

@Directive()
export abstract class CanComponentDeactivate {
    abstract canDeactivate(): boolean;

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canDeactivate()) {
            $event.returnValue = true;
        }
    }
}
