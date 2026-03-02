"use client";

import { Select } from "@/components/ui/select";
import { type EvidencePolicy } from "@/lib/api/cases";

type Props = {
  value: EvidencePolicy;
  onChange: (v: EvidencePolicy) => void;
  readOnly?: boolean;
};

const OPTIONS = [
  { value: "always", label: "Always" },
  { value: "onFail", label: "On Fail" },
  { value: "never", label: "Never" },
];

export function EvidencePolicyForm({ value, onChange, readOnly }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-slate-700">
        Evidence Collection
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Screenshots */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">
            Screenshots
          </label>
          <Select
            value={value.screenshots ?? "onFail"}
            onChange={(e) =>
              onChange({
                ...value,
                screenshots: e.target.value as EvidencePolicy["screenshots"],
              })
            }
            disabled={readOnly}
          >
            {OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Video */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Video</label>
          <Select
            value={value.video ?? "onFail"}
            onChange={(e) =>
              onChange({
                ...value,
                video: e.target.value as EvidencePolicy["video"],
              })
            }
            disabled={readOnly}
          >
            {OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Trace */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Trace</label>
          <Select
            value={value.trace ?? "onFail"}
            onChange={(e) =>
              onChange({
                ...value,
                trace: e.target.value as EvidencePolicy["trace"],
              })
            }
            disabled={readOnly}
          >
            {OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
