import { render } from "@testing-library/react";
import DatadogInit, {
  getDatadogEnvironment,
  isDatadogEnabled,
  isProductionEnvironment,
  PROD_HOSTNAMES,
  DEV_HOSTNAMES,
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

  describe("PROD_HOSTNAMES & DEV_HOSTNAMES", () => {
    it("includes jwhiteaker22.com in PROD_HOSTNAMES", () => {
      expect(PROD_HOSTNAMES).toContain("jwhiteaker22.com");
    });

    it("includes jwhiteaker.homelab.kubesoar.com and homelab.kubesoar.com in DEV_HOSTNAMES", () => {
      expect(DEV_HOSTNAMES).toContain("jwhiteaker.homelab.kubesoar.com");
      expect(DEV_HOSTNAMES).toContain("homelab.kubesoar.com");
    });
  });

  describe("getDatadogEnvironment", () => {
    it("returns null for localhost by default", () => {
      expect(getDatadogEnvironment("localhost")).toBeNull();
    });

    it("returns null for 127.0.0.1", () => {
      expect(getDatadogEnvironment("127.0.0.1")).toBeNull();
    });

    it("returns 'development' for dev cluster hostname", () => {
      expect(getDatadogEnvironment("jwhiteaker.homelab.kubesoar.com")).toBe(
        "development",
      );
    });

    it("returns 'development' for any homelab subdomain", () => {
      expect(getDatadogEnvironment("preview.homelab.kubesoar.com")).toBe(
        "development",
      );
    });

    it("returns 'production' for exact production domain", () => {
      expect(getDatadogEnvironment("jwhiteaker22.com")).toBe("production");
    });

    it("returns 'production' for www subdomain of production domain", () => {
      expect(getDatadogEnvironment("www.jwhiteaker22.com")).toBe("production");
    });

    it("returns null if NEXT_PUBLIC_DATADOG_ENABLED is 'false' even on production domain", () => {
      process.env.NEXT_PUBLIC_DATADOG_ENABLED = "false";
      expect(getDatadogEnvironment("jwhiteaker22.com")).toBeNull();
    });

    it("returns null if NEXT_PUBLIC_DATADOG_ENABLED is 'false' even on dev domain", () => {
      process.env.NEXT_PUBLIC_DATADOG_ENABLED = "false";
      expect(
        getDatadogEnvironment("jwhiteaker.homelab.kubesoar.com"),
      ).toBeNull();
    });

    it("returns 'development' if NEXT_PUBLIC_DATADOG_ENABLED is 'true' on localhost", () => {
      process.env.NEXT_PUBLIC_DATADOG_ENABLED = "true";
      expect(getDatadogEnvironment("localhost")).toBe("development");
    });

    it("checks NEXT_PUBLIC_APP_ENV if provided", () => {
      process.env.NEXT_PUBLIC_APP_ENV = "production";
      expect(getDatadogEnvironment("some-staging-domain.com")).toBe(
        "production",
      );

      process.env.NEXT_PUBLIC_APP_ENV = "development";
      expect(getDatadogEnvironment("jwhiteaker22.com")).toBe("development");

      process.env.NEXT_PUBLIC_APP_ENV = "dev";
      expect(getDatadogEnvironment("localhost")).toBe("development");

      process.env.NEXT_PUBLIC_APP_ENV = "prod";
      expect(getDatadogEnvironment("localhost")).toBe("production");

      process.env.NEXT_PUBLIC_APP_ENV = "unknown-env";
      expect(getDatadogEnvironment("localhost")).toBeNull();
    });

    it("falls back to window.location.hostname in browser", () => {
      // In JSDOM test runner, window.location.hostname is localhost
      expect(getDatadogEnvironment()).toBeNull();
    });
  });

  describe("isProductionEnvironment", () => {
    it("returns true for production domain and false for dev domain", () => {
      expect(isProductionEnvironment("jwhiteaker22.com")).toBe(true);
      expect(isProductionEnvironment("jwhiteaker.homelab.kubesoar.com")).toBe(
        false,
      );
      expect(isProductionEnvironment("localhost")).toBe(false);
    });
  });

  describe("isDatadogEnabled", () => {
    it("returns true for prod and dev domains, false for localhost", () => {
      expect(isDatadogEnabled("jwhiteaker22.com")).toBe(true);
      expect(isDatadogEnabled("jwhiteaker.homelab.kubesoar.com")).toBe(true);
      expect(isDatadogEnabled("localhost")).toBe(false);
    });
  });

  describe("DatadogInit component rendering", () => {
    it("does not initialize datadogRum on non-configured domain (e.g. localhost)", () => {
      render(<DatadogInit />);

      expect(datadogRum.init).not.toHaveBeenCalled();
      expect(datadogRum.startSessionReplayRecording).not.toHaveBeenCalled();
    });

    it("initializes datadogRum and starts session replay on dev cluster domain", () => {
      render(<DatadogInit hostname="jwhiteaker.homelab.kubesoar.com" />);

      expect(datadogRum.init).toHaveBeenCalledTimes(1);
      expect(datadogRum.init).toHaveBeenCalledWith(
        expect.objectContaining({
          applicationId: "598f7204-f0eb-4d7c-b368-f4667519c778",
          clientToken: "pub65b5dd43ebefdb14d6de68b1d72d6869",
          site: "us5.datadoghq.com",
          service: "personal-website",
          env: "development",
        }),
      );
      expect(datadogRum.startSessionReplayRecording).toHaveBeenCalledTimes(1);
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
