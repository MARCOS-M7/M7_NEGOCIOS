
const requests = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_REQUESTS = 100;

export default (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  // Limpar entradas antigas
  if (!requests.has(ip)) {
    requests.set(ip, { count: 0, resetTime: now + WINDOW_MS });
  } else {
    const data = requests.get(ip);
    if (data.resetTime < now) {
      data.count = 0;
      data.resetTime = now + WINDOW_MS;
    }
  }
  
  // Verificar limite
  const data = requests.get(ip);
  data.count++;
  
  if (data.count > MAX_REQUESTS) {
    return res.status(429).json({
      error: "Muitas requisições, tente novamente em breve."
    });
  }
  
  next();
};
