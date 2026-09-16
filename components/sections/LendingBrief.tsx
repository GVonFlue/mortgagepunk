import s from "../Site.module.css";

/**
 * Chris was explicit: the movement branding must never obscure the fact that a
 * serious lending operation sits behind Mortgage Punk. This section is that
 * guardrail, and it is why the page goes light here — the tonal shift signals
 * "this part is the business."
 */
export default function LendingBrief() {
  const items = [
    { n: "01", h: "Buy a home", p: "First home or fifth. Pre-approval that means something, and a team that answers the phone." },
    { n: "02", h: "Refinance", p: "A straight answer on whether it actually makes sense for you, including when the answer is no." },
    { n: "03", h: "Invest", p: "Financing built for people buying their second, fifth, or twentieth property." },
  ];

  return (
    <section className={`${s.sec} ${s.bone}`} aria-label="The lending team">
      <div className={s.wrap}>
        <div className={s.kick}>The Lending Team</div>
        <h2 className={s.h2}>
          A movement out front.
          <br />
          <em>A serious operation behind it.</em>
        </h2>
        <p className={s.lede}>
          Mortgage Punk is loud on purpose. The lending underneath it is not a
          side project — it is a full team, closing real loans, every day.
        </p>
        <div className={s.lend} style={{ marginTop: 44 }}>
          {items.map((i) => (
            <div key={i.n} className={s.c}>
              <div className={s.n}>{i.n}</div>
              <h3>{i.h}</h3>
              <p>{i.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
