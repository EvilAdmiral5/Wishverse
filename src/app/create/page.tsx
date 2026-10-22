import WishForm from "@/components/create/WishForm";

export default function CreatePage() {
  return (
    <main className="wv-page-shell">
      <div className="mx-auto max-w-5xl px-6 py-8 sm:py-12">
        <div className="mb-12">
          <div className="mb-8 flex items-center gap-4">
            <p className="wv-page-kicker text-sm uppercase tracking-[0.3em] text-white/40">
              WishVerse Creator
            </p>

          </div>

          <h1 className="wv-page-title text-4xl font-semibold sm:text-6xl">
            Create their
            <br />
            <span className="wv-page-title-muted text-white/50">
              experience.
            </span>
          </h1>

          <p className="wv-page-description mt-5 max-w-2xl leading-7 text-white/50">
            Everything you enter here becomes part of the interactive
            experience they will receive.
          </p>
        </div>


        <WishForm />
      </div>
    </main>
  );
}
