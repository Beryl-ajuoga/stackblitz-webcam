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

  @Output()
  removImageEvent = new EventEmitter<any>()

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
  hasCamera: boolean = false;
  isCameraAccessDenied: boolean = false;
  cameraErrorMessage: string= '';

  public ngOnInit(): void {
    // throw new Error('Method not implemented.');
    WebcamUtil.getAvailableVideoInputs().then(
      (MediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcams = MediaDevices && MediaDevices.length > 1;
        this.hasCamera = MediaDevices.length > 0;
        
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
    if(error.mediaStreamError && error.mediaStreamError.name == 'NotAllowedError'){
      this.showWebcam = false;
      this.isCameraAccessDenied = true;
      this.cameraErrorMessage = "Please give access to camera";
    }
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage
    this.pictureTaken.emit(webcamImage);
    this.showWebcam=false;
    this.isImageCaptured = true;
  }

  public removeImage(): void {
    this.showWebcam = true
    this.webcamImage=null;
    this.removImageEvent.emit()
  }

  saveImageLocally(): void {
    if (this.webcamImage) {
      const dataURL = this.webcamImage.imageAsDataUrl;
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'webcam_image.png'; 
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       this.removeImage()
       }
      }

  public cameraWasSwitched(deviceId: string): void {}

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }


  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}

