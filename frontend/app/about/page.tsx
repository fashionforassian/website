import Image from "next/image";

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto w-full max-w-[1200px] px-4 py-14 md:px-8 md:py-20">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">About Fassion 4 Asian</p>
        <h1 className="font-heading text-4xl leading-tight text-[#111111] md:text-6xl">
          Crafted for pace, precision, and contemporary style.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#222222]">
        Fassion 4 Asian is a fast-fashion house dedicated to elevated essentials and directional seasonal
          statements. Our design language blends minimalist structure with editorial influence, creating
          versatile wardrobes for modern city life.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-[1400px] gap-6 px-4 md:grid-cols-2 md:px-8">
        <div className="relative h-[480px]">
          <Image
            src="https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1200&q=80"
            alt="Fashion campaign model"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative h-[480px]">
          <Image
            src="https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Fashion studio campaign"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-14 md:px-8 md:py-20">
        <h2 className="font-heading text-3xl text-[#111111] md:text-4xl">Our Mission</h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#222222]">
          We make premium-inspired fashion accessible with fast, responsible production cycles and a
        strong emphasis on fit, fabrication, and relevance. Fassion 4 Asian exists to deliver collections
          that feel current yet enduring, balancing trend with timeless design discipline.
        </p>
      </section>
    </main>
  );
}
