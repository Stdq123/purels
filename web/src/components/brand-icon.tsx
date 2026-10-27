import Image from "next/image";

export function BrandIcon({ size }: { size: number }) {
  return <Image src="/icon.svg" alt="" aria-hidden="true" width={size} height={size} className="shrink-0" unoptimized />;
}
