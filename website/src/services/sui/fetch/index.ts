import { SUIFREN_CAPY_TYPE, replaceTripleSlash, STAKING_TICKET_TYPE, SWAP_TYPES_LIST } from "utils";
import { SuiNFT } from "ethos-connect";
import { ICapy, IStakingTicket, LocalStorageStaking } from "types";

export function fetchCapyStaking(nftObjects: SuiNFT[]): ICapy[] | null {
  if (!nftObjects) return null;

  const capy = nftObjects
    .filter((object) => object.type === SUIFREN_CAPY_TYPE)
    .map((suifrenNftObject) => initializeSuifren(suifrenNftObject));

  const storedCapy = localStorage.getItem(LocalStorageStaking.capyObject);

  // Compare the current capy with the stored capy
  if (storedCapy && JSON.stringify(capy) === storedCapy) {
    // If they are the same, return the stored capy
    return JSON.parse(storedCapy);
  } else {
    // If they are different or there is no stored capy, update localStorage
    localStorage.setItem(LocalStorageStaking.capyObject, JSON.stringify(capy));
    return capy;
  }
}

export function fetchStakingTickets(objects: SuiNFT[]): IStakingTicket[] | null {
  if (!objects) return null;

  const stakingTickets = objects
    .filter((object) => object.type === STAKING_TICKET_TYPE)
    .map((sleepTicketNftObject) => initializeStakingTicket(sleepTicketNftObject));

  // Check for existing stored staking tickets
  const storedStakingTickets = localStorage.getItem(LocalStorageStaking.stakingTicketObject);

  // Compare the current stakingTickets with the stored staking tickets
  if (storedStakingTickets && JSON.stringify(stakingTickets) === storedStakingTickets) {
    // If they are the same, return the stored staking tickets
    return JSON.parse(storedStakingTickets);
  } else {
    // If they are different or there is no stored staking tickets, update localStorage
    localStorage.setItem(LocalStorageStaking.stakingTicketObject, JSON.stringify(stakingTickets));
    return stakingTickets;
  }
}

export function fetchNFTObjects(nftObjects: SuiNFT[]): ICapy[] | null {
  if (!nftObjects) return null;
  return nftObjects
    .filter((object) => SWAP_TYPES_LIST.includes(object.type))
    .map((suifrenNftObject) => initializeSuifren(suifrenNftObject));
}

export function fetchSuifren(nftObjects: SuiNFT[], id: string): ICapy | null {
  if (!nftObjects) return null;

  const suifrenNftObject = nftObjects.find(
    (object) => object.objectId === id && object.type === SUIFREN_CAPY_TYPE,
  );

  return initializeSuifren(suifrenNftObject!);
}

export function fetchStakingTicket(objects: SuiNFT[], id: string): IStakingTicket | null {
  if (!objects) return null;

  const tripTicketNftObject = objects.find(
    (object) => object.objectId === id && object.type === STAKING_TICKET_TYPE,
  );

  return initializeStakingTicket(tripTicketNftObject!);
}

function initializeSuifren(nftObject: SuiNFT): ICapy {
  return {
    id: nftObject?.objectId,
    description: nftObject?.name!,
    url: nftObject?.imageUrl!,
    link: nftObject?.link!,
    type: nftObject?.type!,
    birth_location: nftObject?.fields?.birth_location!,
  };
}

function initializeStakingTicket(object: SuiNFT): IStakingTicket {
  return {
    id: object?.objectId,
    name: object?.name!,
    url: replaceTripleSlash(object?.imageUrl!),
    nft_id: object?.fields?.nft_id!,
    start_time: +object?.fields?.start_time!,
  };
}
