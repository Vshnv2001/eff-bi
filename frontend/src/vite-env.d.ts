/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
    readonly VITE_BACKEND_PORT: string;
    readonly VITE_FRONTEND_URL: string;
    readonly VITE_FRONTEND_PORT: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }