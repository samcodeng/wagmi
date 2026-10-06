import Image from "next/image";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Numevia Logo"
          className="lg:w-50 w-[150px] object-contain"
          width={200}
          height={200}
        />
      </Link>
      <ConnectWalletButton />
    </header>
  );
}
