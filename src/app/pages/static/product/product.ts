import { isPlatformServer } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product implements OnInit, OnDestroy {
  id: string | null = null;
  public random: number = 0;
  public myDate: Date | null = null;
  public isServer: boolean = false;
  hostElement = inject(ElementRef).nativeElement;

  destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.id = params['id'];
    });

    this.myDate = new Date();
    console.log('Product component initialized at:', this.myDate);
    this.random = Math.random();
    console.log('Random number generated:', this.random);
    this.isServer = isPlatformServer(this.platformId);

    if (!this.isServer) {
      const newNode = document.createElement('p');
      newNode.innerHTML = 'Hello';

      this.hostElement.insertBefore(newNode, this.hostElement.firstChild);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
