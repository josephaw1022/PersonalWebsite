import { render } from "@testing-library/react";
import DatadogInit, {
  isProductionEnvironment,
  PROD_HOSTNAMES,
} from "@/components/DatadogInit";
import { datadogRum } from "@datadog/browser-rum";

jest.mock("@datadog/browser-rum", () => ({
  datadogRum: {
    init: jest.fn(),
    startSessionReplayRecording: jest.fn(),
    getInitConfiguration: jest.fn(),
  },
}));

describe("DatadogInit", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_DATADOG_ENABLED;
    delete process.env.NEXT_PUBLIC_APP_ENV;

    (datadogRum.getInitConfiguration as jest.Mock).mockReturnValue(undefined);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("PROD_HOSTNAMES", () => {
    it("includes jwhiteaker22.com", () => {
      expect(PROD_HOSTNAMES).toContain("jwhiteaker22.com");
    });
  });

  describe("isProductionEnvironment", () => {
    it("returns false for localhost by default", () => {
      expect(isProductionEnvironment("localhost")).toBe(false);
    });

    it("returns false for 127.0.0.1", () => {
      expect(isProductionEnvironment("127.0.0.1")).toBe(false);
    });

    it("returns false for dev cluster hostname", () => {
      expect(isProductionEnvironment("jwhiteaker.homelab.kubesoar.com")).toBe(
        false,
      );
    });

    it("returns true for exact production domain", () => {
      expect(isProductionEnvironment("jwhiteaker22.com")).toBe(true);
    });

    it("returns true for www subdomain of production domain", () => {
      expect(isProductionEnvironment("www.jwhiteaker22.com")).toBe(true);
    });

    it("returns false if NEXT_PUBLIC_DATADOG_ENABLED is 'false' even on production domain", () => {
      process.env.NEXT_PUBLIC_DATADOG_ENABLED = "false";
      expect(isProductionEnvironment("jwhiteaker22.com")).toBe(false);
    });

    it("returns true if NEXT_PUBLIC_DATADOG_ENABLED is 'true' even on localhost", () => {
      process.env.NEXT_PUBLIC_DATADOG_ENABLED = "true";
      expect(isProductionEnvironment("localhost")).toBe(true);
    });

    it("checks NEXT_PUBLIC_APP_ENV if provided", () => {
      process.env.NEXT_PUBLIC_APP_ENV = "production";
      expect(isProductionEnvironment("some-staging-domain.com")).toBe(true);

      process.env.NEXT_PUBLIC_APP_ENV = "development";
      expect(isProductionEnvironment("jwhiteaker22.com")).toBe(false);
    });

    it("falls back to window.location.hostname in browser", () => {
      // In JSDOM test runner, window.location.hostname is localhost
      expect(isProductionEnvironment()).toBe(false);
    });
  });

  describe("DatadogInit component rendering", () => {
    it("does not initialize datadogRum on non-production domain (e.g. localhost)", () => {
      render(<DatadogInit />);

      expect(datadogRum.init).not.toHaveBeenCalled();
      expect(datadogRum.startSessionReplayRecording).not.toHaveBeenCalled();
    });

    it("does not initialize datadogRum on dev cluster domain", () => {
      render(<DatadogInit hostname="jwhiteaker.homelab.kubesoar.com" />);

      expect(datadogRum.init).not.toHaveBeenCalled();
      expect(datadogRum.startSessionReplayRecording).not.toHaveBeenCalled();
    });

    it("initializes datadogRum and starts session replay on production domain", () => {
      render(<DatadogInit hostname="jwhiteaker22.com" />);

      expect(datadogRum.init).toHaveBeenCalledTimes(1);
      expect(datadogRum.init).toHaveBeenCalledWith(
        expect.objectContaining({
          applicationId: "598f7204-f0eb-4d7c-b368-f4667519c778",
          clientToken: "pub65b5dd43ebefdb14d6de68b1d72d6869",
          site: "us5.datadoghq.com",
          service: "personal-website",
          env: "production",
        }),
      );
      expect(datadogRum.startSessionReplayRecording).toHaveBeenCalledTimes(1);
    });

    it("does not re-initialize if already initialized", () => {
      (datadogRum.getInitConfiguration as jest.Mock).mockReturnValue({
        applicationId: "598f7204-f0eb-4d7c-b368-f4667519c778",
      });

      render(<DatadogInit hostname="jwhiteaker22.com" />);

      expect(datadogRum.init).not.toHaveBeenCalled();
      expect(datadogRum.startSessionReplayRecording).not.toHaveBeenCalled();
    });
  });
});
