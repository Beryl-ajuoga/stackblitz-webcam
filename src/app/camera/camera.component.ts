import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
})
export class CameraComponent implements OnInit {
  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();

  // camera turning on and off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcams = false;
  public deviceId!: string;
  public videoOptions: MediaTrackConstraints = {};
  public errors: WebcamInitError[] = [];
  public isImageCaptured = false;

  // webcam camera trigger
  private trigger: Subject<void> = new Subject<void>();

  // switching camera back and forth
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  WebcamImage: any;
  savedImage: any[]=[];
  savedImages: any[]=[];
  webcamImage: any;

  public ngOnInit(): void {
    // throw new Error('Method not implemented.');
    WebcamUtil.getAvailableVideoInputs().then(
      (MediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcams = MediaDevices && MediaDevices.length > 1;
      }
    );
  }

  public triggerCamera(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.pictureTaken.emit(webcamImage);
    this.showWebcam=false;
    this.isImageCaptured = true;
  }

  public saveImage(): void{
    if(this.webcamImage){
      this.savedImage.push(this.webcamImage);
      this.webcamImage=null;
    }

  }

  public removeImage(index: number): void {
    this.savedImages.splice(index, 1);
  }

  public cameraWasSwitched(deviceId: string): void {}

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }


  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
