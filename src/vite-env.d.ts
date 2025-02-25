/// <reference types="vite/client" />
/// <reference types="@arcgis/map-components/types/react" />

interface ImportMetaEnv {
  readonly VITE_BASE_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
