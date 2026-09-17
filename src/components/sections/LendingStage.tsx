import Image from "next/image";
import LendingPaths from "./LendingPaths";
import s from "./LendingStage.module.css";

/**
 * The lending section: a stage photograph over the three ways in.
 *
 * The photo sits on top and the paths underneath, so the section opens with
 * proof the team is real and only then asks the visitor to choose. Leading
 * with three tiles asks for a decision before giving a reason to trust one.
 */
export default function LendingStage() {
  return (
    <div className={s.wrap}>
      <div className={s.shot}>
        <Image
          src="/brand/adc-panel.jpg"
          alt="Chris Waipa and the team on stage at the American Dream Conference"
          width={1600}
          height={1067}
          sizes="(max-width: 900px) 94vw, 1100px"
          priority={false}
        />
      </div>

      <LendingPaths />
    </div>
  );
}
