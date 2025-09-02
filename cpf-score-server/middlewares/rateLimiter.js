import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 1,
  duration: 1,
  blockDuration: 2,
});

const rateLimiterMiddleware = (req, res, next) => {
  const set = (rateLimiterRes) =>
    res.set({
      "Retry-After": rateLimiterRes.msBeforeNext / 1000,
      "X-RateLimit-Limit": rateLimiter.points,
      "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
      "X-RateLimit-Reset": Math.ceil(
        (Date.now() + rateLimiterRes.msBeforeNext) / 1000
      ),
      "X-RateLimit-Reset-In": rateLimiterRes.msBeforeNext,
    });

  rateLimiter
    .consume(req.clientId || req.ip)
    .then((rateLimiterRes) => {
      const oldSend = res.send.bind(res);

      res.send = (body) => {
        set(rateLimiterRes);
        return oldSend(body);
      };

      next();
    })
    .catch((rateLimiterRes) => {
      const oldSend = res.send.bind(res);

      res.send = (body) => {
        set(rateLimiterRes);
        return oldSend(body);
      };

      res.status(429).send("Too Many Requests");
    });
};

export default rateLimiterMiddleware;
