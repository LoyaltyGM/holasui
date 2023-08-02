import amplitude from "@amplitude/analytics-browser";
import * as process from "process";
import ReactGA from "react-ga4";

ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "");
amplitude?.init(process.env.NEXT_PUBLIC_AMPLITUDE_ID || "");
// export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL || "";

export const enum AnalyticsEvent {
  // header events
  openWallet = "openWallet",
  clickToStaking = "clickToStaking",
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
  main = "mainPage",
  staking = "stakingPage",
  space = "spacePage",
  dao = "daoPage",
  p2p = "p2pPage",
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
  // eslint-disable-next-line class-methods-use-this
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
//   /* eslint-disable class-methods-use-this */
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
  public async sendEvent(event: IAnalyticEvent): Promise<void> {
    amplitude?.logEvent(event.event, {
      category: event.category,
      label: event.label,
      value: event.value,
    });
  }
}

export const analyticServices = new AnalyticServiceFactory([
  new GoogleAnalyticService(),
  new AmplitudeAnalyticService(),
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
  analyticServices.sendEvent({
    event: event_main,
    category: page,
    label,
    value,
  });
};
