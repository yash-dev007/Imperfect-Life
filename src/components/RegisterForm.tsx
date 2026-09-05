import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode, ChangeEvent } from 'react';
import Reveal from './Reveal';
import { ArrowUpRight, CheckIcon } from './icons';

const stages = ['Idea', 'MVP / Prototype', 'Early Revenue', 'Scaling'];

type Values = {
  startup: string;
  founder: string;
  email: string;
  org: string;
  stage: string;
  pitch: string;
};

const empty: Values = {
  startup: '',
  founder: '',
  email: '',
  org: '',
  stage: '',
  pitch: '',
};

function validate(values: Values) {
  const errors: Partial<Record<keyof Values, string>> = {};
  if (!values.startup.trim()) errors.startup = 'Startup name is required.';
  if (!values.founder.trim()) errors.founder = 'Founder name is required.';
  if (!values.email.trim()) errors.email = 'Email is required.';
  else if (!/^\S+@\S+\.\S+$/.test(values.email.trim()))
    errors.email = 'Enter a valid email address.';
  if (!values.org.trim())
    errors.org = 'College / organisation is required.';
  if (!values.stage) errors.stage = 'Select your current stage.';
  if (values.pitch.trim().length < 20)
    errors.pitch = 'Give us at least a sentence or two (20+ characters).';
  return errors;
}

const inputClass =
  'w-full liquid-glass rounded-xl px-4 py-3 text-sm text-white font-body placeholder:text-white/35 bg-transparent outline-none transition-colors duration-200';

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium font-body text-white/70 mb-2"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-2 text-xs font-body text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export default function RegisterForm() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const set = (key: keyof Values) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    // TODO: wire up — POST `values` to your backend / form service here.
    setSubmitting(true);
    timer.current = window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  if (submitted) {
    return (
      <Reveal delay={0.05}>
        <div className="liquid-glass-strong rounded-[1.25rem] p-8 md:p-10 text-center">
        <div className="liquid-glass h-12 w-12 rounded-full flex items-center justify-center mx-auto">
          <CheckIcon className="h-6 w-6 text-white" />
        </div>
        <h3 className="mt-5 font-heading italic text-3xl md:text-4xl tracking-[-1px] text-white">
          Application received
        </h3>
        <p className="mt-3 text-sm text-white/80 font-body font-light leading-relaxed max-w-[38ch] mx-auto">
          Thanks, {values.founder.split(' ')[0] || 'founder'} —{' '}
          {values.startup || 'your startup'} is in the pipeline. Our team
          reviews every application and reaches out for the screening call.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(empty);
            setErrors({});
            setSubmitted(false);
          }}
          className="mt-6 text-sm font-medium font-body text-white/80 transition-colors duration-300 hover:text-white"
        >
          Register another startup
        </button>
        </div>
      </Reveal>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="liquid-glass rounded-[1.25rem] p-6 md:p-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id="startup" label="Startup name" error={errors.startup}>
          <input
            id="startup"
            type="text"
            autoComplete="organization"
            placeholder="e.g. AgriSense"
            value={values.startup}
            onChange={set('startup')}
            className={inputClass}
          />
        </Field>
        <Field id="founder" label="Founder name" error={errors.founder}>
          <input
            id="founder"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={values.founder}
            onChange={set('founder')}
            className={inputClass}
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@college.edu"
            value={values.email}
            onChange={set('email')}
            className={inputClass}
          />
        </Field>
        <Field id="org" label="College / organisation" error={errors.org}>
          <input
            id="org"
            type="text"
            autoComplete="organization-title"
            placeholder="Your campus or company"
            value={values.org}
            onChange={set('org')}
            className={inputClass}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id="stage" label="Current stage" error={errors.stage}>
            <select
              id="stage"
              value={values.stage}
              onChange={set('stage')}
              className={`${inputClass} ${values.stage ? '' : 'text-white/35'}`}
            >
              <option value="" disabled>
                Select a stage
              </option>
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field
            id="pitch"
            label="What are you building? (one-line pitch)"
            error={errors.pitch}
          >
            <textarea
              id="pitch"
              rows={4}
              placeholder="What problem, for whom, and what have you built so far?"
              value={values.pitch}
              onChange={set('pitch')}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="mt-7 w-full sm:w-auto liquid-glass-strong rounded-full px-7 py-3 flex items-center justify-center gap-2 text-sm font-medium font-body text-white lift disabled:opacity-60 disabled:cursor-wait"
      >
        {submitting ? 'Submitting…' : 'Submit application'}
        <ArrowUpRight className="h-4 w-4" />
      </button>
      <p className="mt-4 text-xs font-body font-light text-white/50">
        Demo form — connect a backend to go live. We review every application
        personally.
      </p>
    </form>
  );
}
