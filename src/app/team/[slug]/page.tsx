import Image from "next/image";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import LoudLead from "@/components/sections/LoudLead";
import s from "@/components/Site.module.css";
import { TEAM, memberBySlug } from "@/lib/team";
import { pageMeta } from "@/lib/meta";

export function generateStaticParams() {
  return TEAM.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = memberBySlug(slug);
  if (!m) {
    return pageMeta({
      title: "The Team",
      description:
        "The lending team behind Mortgage Punk. Real people, real NMLS numbers.",
      path: "/team",
    });
  }
  return pageMeta({
    title: m.name,
    description: m.short,
    path: `/team/${slug}`,
    // pending members are placeholders; keep them out of the index
    index: !m.pending,
  });
}

export default async function MemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = memberBySlug(slug);
  if (!m) notFound();

  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      <PageHead kicker={m.role} title={m.name} lede={m.short} />

      <section className={`${s.sec} ${s.dark}`} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <div className={s.memberGrid}>
            <div>
              <div className={s.memberPhoto}>
                {m.photo ? (
                  <Image
                    src={m.photo}
                    alt={m.name}
                    width={630}
                    height={954}
                    sizes="(max-width: 860px) 90vw, 32vw"
                    priority
                  />
                ) : (
                  <div className={s.teamPhotoEmpty}>
                    <span>Headshot needed</span>
                  </div>
                )}
              </div>

              <dl className={s.memberFacts}>
                <div className={s.memberFact}>
                  <dt>Market</dt>
                  <dd>{m.market}</dd>
                </div>
                {m.nmls && (
                  <div className={s.memberFact}>
                    <dt>NMLS</dt>
                    <dd>#{m.nmls}</dd>
                  </div>
                )}
                <div className={s.memberFact}>
                  <dt>Role</dt>
                  <dd>{m.role}</dd>
                </div>
              </dl>
            </div>

            <div className={s.memberBio}>
              {m.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LoudLead
        kicker="Get started"
        title={`Work with ${m.name.split(" ")[0]}.`}
        accent="Start here."
        lede="Tell us where you are and you'll hear back from a person."
      />
      <SiteFooter />
    </>
  );
}
