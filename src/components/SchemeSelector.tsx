import { ODSGlobalHeaderFlyoutMenu, ODSGlobalHeaderIconButton } from "@telekom-ods/react-ui-kit";
import { useTheme } from "../contexts/ThemeProvider";

export function SchemeSelector() {
  const { scheme, setScheme } = useTheme();

  const schemes = [
    { value: "neutral", label: "Neutral" },
    { value: "inverted", label: "Inverted" },
    { value: "white", label: "White" },
    { value: "black", label: "Black" },
    { value: "magenta", label: "Magenta" }
  ] as const;

  return (
    <ODSGlobalHeaderFlyoutMenu 
      trigger={
        <ODSGlobalHeaderIconButton
          icon="color-selection-type-standard"
          label={`${scheme.charAt(0).toUpperCase() + scheme.slice(1)}`}
        />
      }
      items={schemes.map((schemeOption) => ({
        label: schemeOption.label,
        onClick: () => setScheme(schemeOption.value),
        selected: scheme === schemeOption.value
      }))}
    />
  );
}