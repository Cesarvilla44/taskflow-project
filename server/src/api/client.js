// Si usas módulos de JS
import axios from 'https://cdn.skypack.dev'; 

const client = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

export default client;
