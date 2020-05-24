import { register } from "../actions/register";
import { ToolButton } from "../components/ToolButton";
import { geo } from "../components/icons";
import { t } from "../i18n";
import useIsMobile from "../is-mobile";
import { loadFromTopoJSON } from "../data";
import React from "react";

export const actionLoadGeo = register({
  name: "loadGeo",
  perform: (elements, appState, { elements: loadedElements, error }) => {
    return {
      elements: [...elements, ...loadedElements],
      appState: {
        ...appState,
        errorMessage: error,
      },
      commitToHistory: false,
    };
  },
  PanelComponent: ({ updateData }) => (
    <ToolButton
      type="button"
      icon={geo}
      title={t("buttons.loadGeo")}
      aria-label={t("buttons.loadGeo")}
      showAriaLabel={useIsMobile()}
      onClick={() => {
        loadFromTopoJSON()
          .then(({ elements }) => updateData({ elements }))
          .catch((error) => {
            // if user cancels, ignore the error
            if (error.name === "AbortError") {
              return;
            }
            updateData({ error: error.message });
          });
      }}
    />
  ),
});
