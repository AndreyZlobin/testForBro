import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Created with ♥ by <b><a href="http://neosound.eu" target="_blank">NeoSound</a></b> </span>
    <div class="socials">

      <a href="/terms" class="text-link" target="_blank" style="font-size: 12px;">Terms and Conditions</a>
      <a href="https://neosound.eu/" class="text-link" target="_blank" style="font-size: 12px;">About</a>
      <!-- <a href="#"  target="_blank" class="ion ion-social-facebook"></a>
      <a href="#" target="_blank" class="ion ion-social-twitter"></a>
      <a href="#" target="_blank" class="ion ion-social-linkedin"></a> -->
    </div>
  `,
})
export class FooterComponent {
}
