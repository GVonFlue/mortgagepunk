import s from "../Site.module.css";

/** Standard inner-page masthead so every page opens the same way. */
export default function PageHead({
  kicker,
  title,
  accent,
  lede,
}: {
  kicker: string;
  title: string;
  accent?: string;
  lede?: string;
}) {
  return (
    <section className={`${s.sec} ${s.dark}`}>
      <div className={s.wrap}>
        <div className={s.kick}>{kicker}</div>
        <h1 className={s.h2}>
          {title}
          {accent && (
            <>
              <br />
              <em>{accent}</em>
            </>
          )}
        </h1>
        {lede && <p className={s.lede}>{lede}</p>}
      </div>
    </section>
  );
}
