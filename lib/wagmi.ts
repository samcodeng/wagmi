import { createAppKit } from "@reown/appkit/react";
import { arbitrum, mainnet } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

export const metadata = {
  name: "Numevia",
  description: "Pick your number. Own your chance.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  icons: ["/favicon.jpg"],
};

export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, arbitrum],
  projectId,
});

if (typeof window !== "undefined") {
  createAppKit({
    adapters: [wagmiAdapter],
    networks: [mainnet, arbitrum],
    metadata: metadata,
    projectId,
    features: {
      analytics: true,
      email: false,
      socials: false,
    },
  });
}
