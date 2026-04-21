import Image from "next/image";
import Hero from "./_components/Hero";
import FlashSale from "./_components/FlashSale";
import ProductSection from "./_components/ProductSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <FlashSale />
      <ProductSection />
    </div>
  );
}
