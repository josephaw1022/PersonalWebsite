jest.mock("dd-trace", () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
  },
}));

describe("instrumentation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("initializes dd-trace when NEXT_RUNTIME is nodejs", async () => {
    process.env.NEXT_RUNTIME = "nodejs";
    const { register: freshRegister } = await import("@/instrumentation");
    const freshTracer = (await import("dd-trace")).default;

    await freshRegister();

    expect(freshTracer.init).toHaveBeenCalledTimes(1);
    expect(freshTracer.init).toHaveBeenCalledWith({
      logInjection: true,
      runtimeMetrics: true,
    });
  });

  it("does not initialize dd-trace when NEXT_RUNTIME is not nodejs", async () => {
    process.env.NEXT_RUNTIME = "edge";
    const { register: freshRegister } = await import("@/instrumentation");
    const freshTracer = (await import("dd-trace")).default;

    await freshRegister();

    expect(freshTracer.init).not.toHaveBeenCalled();
  });
});
