import WishForm from "@/components/create/WishForm";

export default function CreatePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070609] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-[#6A0C1F]/20 blur-[120px]" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-[#5D4FA3]/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#C8A24A]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-[9px] uppercase tracking-[.4em] text-white/30">WishVerse Creator</p>
          <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] font-light leading-[.9] tracking-[-.055em]">
            Create their
            <span className="block text-white/35">experience.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/35">
            Seven little steps. One beautiful interactive wish. Everything you enter becomes part of their experience.
          </p>
        </div>

        <WishForm />
      </div>
    </main>
  );
}
