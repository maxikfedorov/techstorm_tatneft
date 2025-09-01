const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  APP_NAME: 'Mermaid AI Editor',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
};

export default config;
