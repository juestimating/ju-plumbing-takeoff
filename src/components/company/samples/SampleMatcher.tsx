import { ArrowRight } from "lucide-react";
import { PROJECT_TYPE_OPTIONS } from "@/components/forms/quote-config";
import { Rich } from "@/components/ui/Rich";
import { Section } from "@/components/ui/Section";
import { REQUEST_A_SAMPLE } from "./content";
import s from "./slip.module.css";

/** The request slip's "What should it show?" values. /contact prefills its Notes from these exact keys. */
const SAMPLE_KINDS = [
  { value: "takeoff", label: "A takeoff" },
  { value: "material-list", label: "A material list" },
  { value: "estimate", label: "An estimate" },
] as const;

function Choices({ legend, name, options }: { legend: string; name: string; options: readonly { value: string; label: string }[] }) {
  return (
    <fieldset className={s.fs} role="radiogroup">
      <legend>{legend}</legend>
      <div className={s.opts}>
        {options.map((o) => (
          <label key={o.value} className={s.opt}>
            <input type="radio" name={name} value={o.value} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * "Your project, your sample": the request callout as a transmittal slip. A plain GET form (no script) to the quote
 * form with service=sample-request plus the optional type and sample; the action's fragment keeps the visitor
 * landing on the form.
 */
export function SampleMatcher() {
  const b = REQUEST_A_SAMPLE;
  if (b.type !== "callout" || !b.cta) throw new Error("sample request: REQUEST_A_SAMPLE must be a callout with a button");
  return (
    <Section id={b.id} tone="light">
      <div className={s.match}>
        <div className={s.matchCopy}>
          <span className="kicker">Your project, your sample</span>
          <h2 id={`${b.id}-h`}>
            <Rich text={b.h2} />
          </h2>
          <p>
            <Rich text={b.body} />
          </p>
        </div>
        <form method="get" action="/contact#request-a-quote" className={s.slip}>
          <span className={s.stamp} aria-hidden="true">
            Sample request
          </span>
          <input type="hidden" name="service" value="sample-request" />
          <Choices legend="Project type" name="type" options={PROJECT_TYPE_OPTIONS} />
          <Choices legend="What should it show?" name="sample" options={SAMPLE_KINDS} />
          <button type="submit" className="btn btn-primary btn-lg">
            {b.cta.label}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <p className={s.slipFoot}>Both choices are optional. We send the closest match we can share.</p>
        </form>
      </div>
    </Section>
  );
}
