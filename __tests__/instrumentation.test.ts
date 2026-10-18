import { register } from "@/instrumentation";
import tracer from "dd-trace";

jest.mock("dd-trace", () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
  },
}));

describe("instrumentation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("initializes dd-trace when NEXT_RUNTIME is nodejs", async () => {
    process.env.NEXT_RUNTIME = "nodejs";

    await register();

    expect(tracer.init).toHaveBeenCalledTimes(1);
    expect(tracer.init).toHaveBeenCalledWith({
      logInjection: true,
      runtimeMetrics: true,
    });
  });

  it("does not initialize dd-trace when NEXT_RUNTIME is not nodejs", async () => {
    process.env.NEXT_RUNTIME = "edge";

    await register();

    expect(tracer.init).not.toHaveBeenCalled();
  });
});
