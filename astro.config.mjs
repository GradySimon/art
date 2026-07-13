import {defineConfig} from 'astro/config';
import artGallery from './src/integration';

export default defineConfig({
  output: 'static',
  integrations: [artGallery()],
});
