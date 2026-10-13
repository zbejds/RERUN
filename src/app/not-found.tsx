import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto mt-16 max-w-lg text-center">
      <div className="crt mx-auto aspect-[4/3] w-64 bg-black" aria-hidden="true">
        <div className="absolute inset-0 bg-signal" />
        <div className="absolute inset-0 grid place-items-center font-mono text-sm font-semibold uppercase tracking-[0.2em] text-white">
          No signal
        </div>
      </div>
      <h1 className="mt-8 font-display text-5xl uppercase">Off the air</h1>
      <p className="mt-2 text-bone-dim">
        That page, or that mint address, isn&apos;t in the RERUN registry. Tokens are listed by mint only, so look-alikes won&apos;t resolve.
      </p>
      <Link href="/discover" className="btn-pulse mt-6">Browse the tape library</Link>
    </div>
  );
}
