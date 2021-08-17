import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1000,
  duration: '30s',
};

export default function () {
  http.get('http://localhost:3000/products/892806/styles');
  //http.get('http://localhost:3000/products/ 892808');
  sleep(1);
}
