export function replaceTripleSlash(url: string): string {
  return url.replace(/\/\/\//g, "/");
}

// Function to convert IPFS URL to normal URL
export const convertIPFSUrl = (ipfsUrl: string): string => {
  const ipfsPrefix: string = "ipfs://";
  const normalUrlPrefix: string = "https://ipfs.io/ipfs/";

  if (ipfsUrl?.includes(ipfsPrefix)) {
    const hash = ipfsUrl.slice(ipfsPrefix.length);
    return normalUrlPrefix + hash;
  } else {
    return ipfsUrl;
    // console.log(ipfsUrl)
    // throw new Error("Invalid IPFS URL");
  }
};

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(num: number) {
  const suffixes = ["", "K", "M", "B", "T"];
  let count = 0;

  while (num >= 1000) {
    num /= 1000;
    count++;
  }

  // we use toFixed(2) to always have two decimal places
  // parseFloat() is used to remove trailing zeroes
  num = parseFloat(num.toFixed(2));

  return num + suffixes[count];
}

export function formatSuiAddress(address: string, startLength = 3, endLength = 4): string {
  if (address.length <= startLength + endLength) {
    return address;
  }
  const start = address.slice(0, startLength + 2); // Include the "0x" prefix
  const end = address.slice(-endLength);
  return `${start}...${end}`;
}

export function formatSuiNumber(num: any): number {
  return num / 1000000000;
}

export const convertDateToTimestamp = (date: string): number => {
  const dateObject = new Date(date);
  return dateObject.getTime();
};

export const formatTimestampToDate = (timestamp: number): string => {
  const dateObject = new Date(timestamp);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedDate = `${monthNames[dateObject.getMonth()]} ${dateObject.getDate()}`;
  return formattedDate;
};
