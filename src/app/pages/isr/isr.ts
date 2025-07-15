import { isPlatformServer } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-isr",
  imports: [],
  templateUrl: "./isr.html",
  styleUrl: "./isr.scss",
})
export class Isr {
  public myDate: Date | null = null;

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      console.log("This is running on the server");
      this.myDate = new Date();
      console.log("ISR component initialized at:", this.myDate);
    }
  }
}
