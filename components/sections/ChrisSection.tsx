import Image from "next/image";
import Link from "next/link";
import s from "./ChrisSection.module.css";

/**
 * Chris, on the homepage.
 *
 * One photograph and about eighty words. The full story, the speaking menu and
 * the press live on /about — this is the trailer, not the film.
 *
 * Restraint is the point: a visitor who wants the biography will click, and a
 * visitor who does not should be able to scroll past having still learned the
 * one thing that matters, which is why the brand is called Mortgage Punk.
 */
export default function ChrisSection() {
  return (
    <div className={s.grid}>
      <div className={s.shot}>
        <Image
          src="/brand/chris-red-blur.jpg"
          alt="Chris Waipa"
          width={1100}
          height={1649}
          sizes="(max-width: 860px) 88vw, 40vw"
        />
      </div>

      <div className={s.copy}>
        <p className={s.lead}>
          Two decades ago Chris and his wife were chasing music. Life put him in
          mortgage lending instead, where he got steadily more frustrated by an
          industry that left people confused and treated like transactions.
        </p>
        <p>
          Then a designer described an idea as looking like{" "}
          <strong>&ldquo;mortgage punk.&rdquo;</strong> The two words were never
          supposed to fit together. That was exactly why they worked.
        </p>

        <div className={s.links}>
          <Link href="/about">
            Chris&rsquo;s story <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link href="/about#speaking">
            Book Chris to speak <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
