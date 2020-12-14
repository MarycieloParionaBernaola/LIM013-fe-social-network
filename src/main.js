import { changeView } from './controller/route.js';
import { checkSesionActive } from './controller/controller-route.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCgVtshlRBhKfqF0FI4XO6pBwXDZs3BFio',
  authDomain: 'sn-travelin.firebaseapp.com',
  databaseURL: 'https://sn-travelin.firebaseio.com',
  projectId: 'sn-travelin',
  storageBucket: 'sn-travelin.appspot.com',
  messagingSenderId: '118484904680',
  appId: '1:118484904680:web:799337e9f5893eb8c5375d',
  measurementId: 'G-0S2GSQBDZ9',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const init = () => {
  checkSesionActive(changeView);
};
window.addEventListener('load', init);
window.addEventListener('hashchange', init);
