export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const tracer = (await import("dd-trace")).default;
    tracer.init({
      logInjection: true,
      runtimeMetrics: true,
    });
  }
}
