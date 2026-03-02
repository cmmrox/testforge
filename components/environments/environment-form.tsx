"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import type { EnvironmentCreateRequest } from "@/lib/api/environments";

export type EnvironmentFormValues = {
  name: string;
  baseUrl: string;
  loginUrl: string;
  locatorUsername: string;
  locatorPassword: string;
  locatorSubmit: string;
  locatorPostLoginAssert: string;
  username: string;
  password: string;
  totpEnabled: boolean;
  locatorTotp: string;
  locatorTotpSubmit: string;
  totpSecret: string;
};

export type EnvironmentFormProps = {
  values: EnvironmentFormValues;
  onChange: (v: EnvironmentFormValues) => void;
  error?: string;
};

export const defaultEnvironmentFormValues: EnvironmentFormValues = {
  name: "",
  baseUrl: "",
  loginUrl: "",
  locatorUsername: "",
  locatorPassword: "",
  locatorSubmit: "",
  locatorPostLoginAssert: "",
  username: "",
  password: "",
  totpEnabled: false,
  locatorTotp: "",
  locatorTotpSubmit: "",
  totpSecret: "",
};

export function formValuesToCreateRequest(v: EnvironmentFormValues): EnvironmentCreateRequest {
  const hasRecipe =
    v.loginUrl.trim() !== "" ||
    v.locatorUsername.trim() !== "" ||
    v.locatorPassword.trim() !== "" ||
    v.locatorSubmit.trim() !== "" ||
    v.locatorPostLoginAssert.trim() !== "" ||
    v.username.trim() !== "" ||
    v.password.trim() !== "" ||
    v.totpEnabled ||
    v.locatorTotp.trim() !== "" ||
    v.locatorTotpSubmit.trim() !== "" ||
    v.totpSecret.trim() !== "";

  return {
    name: v.name.trim(),
    baseUrl: v.baseUrl.trim(),
    loginRecipe: hasRecipe
      ? {
          loginUrl: v.loginUrl.trim() || undefined,
          locatorUsername: v.locatorUsername.trim() || undefined,
          locatorPassword: v.locatorPassword.trim() || undefined,
          locatorSubmit: v.locatorSubmit.trim() || undefined,
          locatorPostLoginAssert: v.locatorPostLoginAssert.trim() || undefined,
          totpEnabled: v.totpEnabled || undefined,
          locatorTotp: v.locatorTotp.trim() || undefined,
          locatorTotpSubmit: v.locatorTotpSubmit.trim() || undefined,
          username: v.username.trim() || undefined,
          password: v.password.trim() || undefined,
          totpSecret: v.totpSecret.trim() || undefined,
        }
      : undefined,
  };
}

export function EnvironmentForm({ values, onChange, error }: EnvironmentFormProps) {
  const [showRecipe, setShowRecipe] = React.useState(false);

  const set =
    (field: keyof EnvironmentFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      onChange({ ...values, [field]: val });
    };

  return (
    <div className="flex flex-col gap-4">
      {/* Basic section */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="ef-name">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="ef-name"
          required
          value={values.name}
          onChange={set("name")}
          placeholder="staging"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="ef-baseUrl">
          Base URL <span className="text-red-500">*</span>
        </label>
        <Input
          id="ef-baseUrl"
          type="url"
          required
          value={values.baseUrl}
          onChange={set("baseUrl")}
          placeholder="https://staging.example.com"
        />
      </div>

      {/* Login Recipe toggle */}
      <button
        type="button"
        onClick={() => setShowRecipe((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors w-fit"
      >
        Configure Login Recipe {showRecipe ? "▴" : "▾"}
      </button>

      {showRecipe && (
        <div className="flex flex-col gap-4 rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="ef-loginUrl">
              Login URL
            </label>
            <Input
              id="ef-loginUrl"
              value={values.loginUrl}
              onChange={set("loginUrl")}
              placeholder="leave blank to use Base URL + /login"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="ef-locatorUsername">
              Username locator
            </label>
            <Input
              id="ef-locatorUsername"
              value={values.locatorUsername}
              onChange={set("locatorUsername")}
              placeholder="input[name=username]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="ef-locatorPassword">
              Password locator
            </label>
            <Input
              id="ef-locatorPassword"
              value={values.locatorPassword}
              onChange={set("locatorPassword")}
              placeholder="input[name=password]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="ef-locatorSubmit">
              Submit locator
            </label>
            <Input
              id="ef-locatorSubmit"
              value={values.locatorSubmit}
              onChange={set("locatorSubmit")}
              placeholder="button[type=submit]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="ef-locatorPostLoginAssert"
            >
              Post-login assertion locator
            </label>
            <Input
              id="ef-locatorPostLoginAssert"
              value={values.locatorPostLoginAssert}
              onChange={set("locatorPostLoginAssert")}
              placeholder="selector visible after login"
            />
          </div>

          <div className="border-t border-slate-200 pt-3">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Credentials
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="ef-username">
                  Username
                </label>
                <Input
                  id="ef-username"
                  value={values.username}
                  onChange={set("username")}
                  placeholder="user@example.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="ef-password">
                  Password
                </label>
                <Input
                  id="ef-password"
                  type="password"
                  value={values.password}
                  onChange={set("password")}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="ef-totpEnabled"
              type="checkbox"
              checked={values.totpEnabled}
              onChange={set("totpEnabled")}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            />
            <label className="text-sm font-medium text-slate-700" htmlFor="ef-totpEnabled">
              TOTP enabled
            </label>
          </div>

          {values.totpEnabled && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="ef-locatorTotp">
                  TOTP locator
                </label>
                <Input
                  id="ef-locatorTotp"
                  value={values.locatorTotp}
                  onChange={set("locatorTotp")}
                  placeholder="input[name=totp]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="ef-locatorTotpSubmit"
                >
                  TOTP submit locator
                </label>
                <Input
                  id="ef-locatorTotpSubmit"
                  value={values.locatorTotpSubmit}
                  onChange={set("locatorTotpSubmit")}
                  placeholder="button[type=submit]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="ef-totpSecret">
                  TOTP secret
                </label>
                <Input
                  id="ef-totpSecret"
                  type="password"
                  value={values.totpSecret}
                  onChange={set("totpSecret")}
                  placeholder="JBSWY3DPEHPK3PXP"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
