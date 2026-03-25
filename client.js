// Usamos el axios que acabamos de cargar en el HTML
const client = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

export default client;
