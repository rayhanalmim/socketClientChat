/* eslint-disable react/prop-types */
import { IconLoader } from "@tabler/icons-react";
import React from "react";

export default function DataLoader({
  className: css,
  loaderClass,
  showError = false,
  errorMsg = "Unexpected Error Ocurred",
}) {
  return (
    <div className={`flex justify-center items-center ${css}`}>
      {showError ? (
        <h1 className="text-red-600 text-3xl lg:text-6xl">{errorMsg}</h1>
      ) : (
        <IconLoader className={`animate-spin size-12 ${loaderClass}`} />
      )}
    </div>
  );
}
