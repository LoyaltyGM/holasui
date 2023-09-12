import amplitude from "@amplitude/analytics-browser";
import * as process from "process";
import ReactGA from "react-ga4";

ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "");
// export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL || "";

export const enum AnalyticsEvent {
  // header events
  openWallet = "openWallet",
  disconnectWallet = "disconnectWallet",
  clickToStaking = "clickToStaking",
  clickToLogo = "clickToLogo",
  clickToSpace = "clickToSpace",
  clickToDAO = "clickToDAO",
  clickToP2P = "clickToP2P",
  clickToDiscord = "clickToDiscord",
  clickToTwitter = "clickToTwitter",

  // staking events
  claimAllPoints = "claimAllPoints",
  claimPointsOfOneNFT = "claimPointsOfOneNFT",
  clickStakeAll = "clickStakeAll",
  clickUnstakeAll = "clickUnstakeAll",
  clickStakeOne = "clickStakeOne",
  clickUnstakeOne = "clickUnstakeOne",
  clickFAQs = "clickFAQs",
  blueMoveButton = "blueMoveButton",

  // p2p events
  createOffer = "createOffer",
  viewHistory = "viewHistory",

  // DAO events
  createDAO = "createDAO",
  openDetailsDAO = "openDetailsDAO",
}

export const enum AnalyticsCategory {
  main = "/",
  staking = "staking",
  space = "spaces",
  dao = "dao",
  p2p = "swap",
}

// Analytics event data model
interface IAnalyticEvent {
  event: AnalyticsEvent;
  category: AnalyticsCategory;
  label: string | undefined;
  value: string | undefined;
}

// Analytic service interface
interface IAnalyticService {
  sendEvent(event: IAnalyticEvent): Promise<void>;
}

// Analytic services factory
class AnalyticServiceFactory {
  constructor(private readonly services: IAnalyticService[]) {}

  public sendEvent(event: IAnalyticEvent): void {
    this.services.forEach((service) => service.sendEvent(event));
  }
}

class GoogleAnalyticService implements IAnalyticService {
  public constructor(private readonly id: string) {}

  public init(): void {
    ReactGA.initialize(this.id);
  }

  public async sendEvent(event: IAnalyticEvent): Promise<void> {
    ReactGA?.event({
      category: event.category,
      action: event.event,
      label: event.label,
      value: Number(event.value),
    });
  }
}

// class FacebookAnalyticService implements IAnalyticService {
//   public async sendEvent(event: IAnalyticEvent): Promise<void> {
//     import("react-facebook-pixel")
//       .then((x) => x.default)
//       .then((ReactPixel) => {
//         ReactPixel.trackCustom(event.event, {
//           category: event.category,
//           label: event.label,
//           value: event.value,
//         });
//       });
//   }
// }

class AmplitudeAnalyticService implements IAnalyticService {
  public constructor(private readonly id: string) {}

  public init(): void {
    amplitude.init(this.id);
  }

  public async sendEvent(event: IAnalyticEvent): Promise<void> {
    amplitude?.logEvent(event.event, {
      category: event.category,
      label: event.label,
      value: event.value,
    });
  }
}

const AnalyticServices = new AnalyticServiceFactory([
  new GoogleAnalyticService(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""),
  new AmplitudeAnalyticService(process.env.NEXT_PUBLIC_AMPLITUDE_ID || ""),
]);

export const handleAnalyticsClick = async ({
  event_main,
  page = AnalyticsCategory.main,
  label = "",
  value = "",
}: {
  event_main: AnalyticsEvent;
  page?: AnalyticsCategory;
  label?: string;
  value?: string;
}) => {
  AnalyticServices.sendEvent({
    event: event_main,
    category: page,
    label,
    value,
  });
};
