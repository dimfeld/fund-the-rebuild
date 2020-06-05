import './utils.css';
import App from './App.svelte';
import { twitter } from './services';

window.twttr.ready(() => twitter.set(window.twttr));

const app = new App({
  target: document.body,
  props: {
    twitter,
  },
});

export default app;
