import { Field, ErrorMessage } from "formik";
import * as HIcons from "@heroicons/react/solid";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { useState } from "react";

const DynamicHeroIcon = (props) => {
  const { ...icons } = HIcons;
  const TheIcon = icons[props.icon];

  return <TheIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />;
};
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TextArea(props) {
  return (
    <div
      className={
        props.inline
          ? "sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5"
          : ""
      }
    >
      {props.label && (
        <label
          htmlFor={props.name}
          className={
            props.inline
              ? "block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              : "text-sm font-medium text-gray-700"
          }
        >
          {props.label}{" "}
          {props.required && <span className="text-red-500 text-xs">*</span>}
        </label>
      )}

      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <div className="relative">
          {props.icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DynamicHeroIcon icon={props.icon} />
            </div>
          )}
          <Field
            type="textarea"
            name={props.name}
            id={props.name}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder={props.placeholder}
            disabled={props.disabled}
            autoComplete="off"
            onBlur={props.onBlur}
            maxLength={props.maxLength}
            rows={props.rows}
          />
        </div>
        <div className="mt-2 text-xs text-red-600">
          <ErrorMessage name={props.name} />
        </div>
      </div>
    </div>
  );
}

TextArea.defaultProps = {
  inline: false,
  type: "text",
  placeholder: "",
  width: "max-w-lg",
  required: false,
  showTogglePasswordButton: false,
  rows: 4,
};
