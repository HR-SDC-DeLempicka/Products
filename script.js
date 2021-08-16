import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('http://localhost:3000/products/892806/styles');
  sleep(1);
}
