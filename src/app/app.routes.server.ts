import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
      path: '',
      renderMode: RenderMode.Client,
  },
  
  {
      path: 'home',
      renderMode: RenderMode.Client
  },
  {
      path: 'client',
      renderMode: RenderMode.Client,
  },
  {
      path: 'static',
      renderMode: RenderMode.Prerender,
  },
  {
    path: 'static/:id',
    renderMode: RenderMode.Server

  },
  {
      path: 'ssr',
      renderMode: RenderMode.Server
  }
];
