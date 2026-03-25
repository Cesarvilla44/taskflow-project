// Usamos el axios que acabamos de cargar en el HTML
const client = axios.create({
  baseURL: 'https://taskflow-project-orpin.vercel.app/api',
});

export default client;
