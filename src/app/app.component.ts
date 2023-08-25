import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'webcam-app';
  public webcamImage!:WebcamImage;

  handleImage(webcamImage:WebcamImage){
    this.webcamImage = webcamImage;
  }

}
