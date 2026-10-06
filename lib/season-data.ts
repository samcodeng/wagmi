export type DrawStatus = "open" | "drawing" | "completed";

export interface PrizeTier {
  place: string;
  description: string;
  amountUsdc: number;
}

export interface SeasonInfo {
  seasonNumber: number;
  name: string;
  ticketSupply: number;
  ticketsSold: number;
  ticketPriceUsdc: number;
  openingTime: string;
  deadline: string; // ISO date
  status: DrawStatus;
}

// TODO: replace with data read from the ticket draw contract.
export const currentSeason: SeasonInfo = {
  seasonNumber: 3,
  name: "Autumn Draw",
  ticketSupply: 1000,
  ticketsSold: 214,
  ticketPriceUsdc: 0.18,
  openingTime: "2026-09-01T00:00:00Z",
  deadline: "2026-11-30T23:59:59Z",
  status: "open",
};

export const prizeStructure: PrizeTier[] = [
  { place: "1st", description: "Major prize", amountUsdc: 10000 },
  { place: "2nd", description: "Major prize", amountUsdc: 5000 },
  { place: "3rd", description: "Major prize", amountUsdc: 1000 },
  { place: "10 winners", description: "Additional winners", amountUsdc: 250 },
  { place: "894 winners", description: "Additional winners", amountUsdc: 18 },
];
