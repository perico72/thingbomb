import {
  Component,
  JSX,
  createEffect,
  createSignal,
  For,
  Show,
} from "solid-js";
import { createStoredSignal } from "../hooks/localStorage";
import {
  generalSettings,
  appearanceSettings,
  backgroundSettings,
  advancedSettings,
  widgetSettings,
  SettingItem as SettingItemType,
} from "../libs/settings";

interface ExtendedSettingItem {
  id: string;
  title: string;
  type: string;
  group?: string;
  icon?: any;
  iconBackground?: string;
  storedValue?: string;
  defaultValue?: any;
  component?: string;
  options?: any[];
  description?: string;
  placeholder?: string;
  inputType?: string;
  min?: number;
  max?: number;
  step?: number;
  displayMultiplier?: number;
  dangerous?: boolean;
  action?: string;
  label?: string;
  actionLabel?: string;
  dependsOn?: {
    setting: string;
    value: any;
  };
  children?: Record<string, ExtendedSettingItem>;
  accept?: string;
  valueWhenOn?: any;
  valueWhenOff?: any;
}
import { TextField, TextFieldLabel, TextFieldRoot } from "./ui/textfield";
import { Button } from "./ui/button";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemLabel,
} from "./ui/radio-group";
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from "./ui/switch";
import { cn } from "../libs/cn";
import { actuallyBoolean } from "../libs/boolean";
import { Dynamic } from "solid-js/web";
import BookmarkPicker from "./settings/BookmarkPicker";
import { createStoredSignal as createBookmarksSignal } from "../hooks/localStorage";

function findSettingById(id: string): ExtendedSettingItem | null {
  const allSections = {
    ...generalSettings,
    ...appearanceSettings,
    ...backgroundSettings,
    ...advancedSettings,
    ...widgetSettings,
  } as unknown as Record<string, ExtendedSettingItem>;

  if (allSections[id]) {
    return allSections[id];
  }

  for (const sectionKey in allSections) {
    const section = allSections[sectionKey];
    if (section.children) {
      if (section.children[id]) {
        return section.children[id];
      }

      for (const childKey in section.children) {
        const child = section.children[childKey];
        if (child.children && child.children[id]) {
          return child.children[id];
        }
      }
    }
  }

  return null;
}

function findDependentSettings(
  settingId: string,
  settingValue: any
): ExtendedSettingItem[] {
  const dependentSettings: ExtendedSettingItem[] = [];
  const allSections = {
    ...generalSettings,
    ...appearanceSettings,
    ...backgroundSettings,
    ...advancedSettings,
    ...widgetSettings,
  } as unknown as Record<string, ExtendedSettingItem>;

  const checkDependency = (setting: any) => {
    if (
      setting.dependsOn &&
      setting.dependsOn.setting === settingId &&
      setting.dependsOn.value === settingValue
    ) {
      dependentSettings.push(setting);
    }

    if (setting.children) {
      Object.values(setting.children).forEach((child) => {
        checkDependency(child);
      });
    }
  };

  Object.values(allSections).forEach((setting) => {
    checkDependency(setting);
  });

  return dependentSettings;
}

interface SettingItemProps {
  id: string;
  class?: string;
  onChange?: (value: any) => void;
}

export const SettingItem: Component<SettingItemProps> = (props) => {
  const setting = findSettingById(props.id);

  if (!setting) {
    console.error(`Setting with ID "${props.id}" not found`);
    return null;
  }

  if (!setting.id || !setting.title || !setting.type) {
    console.error(
      `Setting with ID "${props.id}" is missing required properties`
    );
    return null;
  }

  const [storedValue, setStoredValue] = createStoredSignal(
    setting.storedValue || props.id,
    setting.defaultValue
  );
  const [inputValue, setInputValue] = createSignal(storedValue());

  createEffect(() => {
    if (props.onChange) {
      props.onChange(storedValue());
    }
  });

  const renderToggle = () => (
    <div class="mb-4">
      <h3 class="text-lg font-[600] mb-2">
        {chrome.i18n.getMessage(setting.title as any)}
      </h3>
      <Switch
        class="flex items-center space-x-2"
        checked={
          setting.valueWhenOn
            ? storedValue() === setting.valueWhenOn
            : actuallyBoolean(storedValue())
        }
        onChange={(value: boolean) => {
          setStoredValue(
            setting.valueWhenOn
              ? value
                ? setting.valueWhenOn
                : setting.valueWhenOff
              : setting.valueWhenOff
                ? value
                  ? setting.valueWhenOff
                  : false
                : value
          );
          if (props.onChange) props.onChange(value);
        }}
      >
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel
          class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
            data-[disabled]:opacity-70"
        >
          {chrome.i18n.getMessage(
            (setting.label ? setting.label : "enabled") as any
          )}
        </SwitchLabel>
      </Switch>
    </div>
  );

  const renderInput = () => (
    <div class="mb-4">
      <TextFieldRoot class="flex-1 w-full">
        <TextFieldLabel class="text-lg font-[600] mb-2">
          {chrome.i18n.getMessage(setting.title as any)}
        </TextFieldLabel>
        <TextField
          placeholder={chrome.i18n.getMessage(
            (setting.placeholder || setting.title) as any
          )}
          value={inputValue()}
          type={setting.inputType || "text"}
          class="w-full h-[30.6px] text-sm"
          onInput={(e: InputEvent) =>
            setInputValue((e.currentTarget as HTMLInputElement)?.value)
          }
          onkeydown={(e: KeyboardEvent) => {
            if (e.key === "Enter") {
              setStoredValue(inputValue());
              if (props.onChange) props.onChange(inputValue());
            }
          }}
        />
        {setting.description && (
          <span class="text-sm text-muted-foreground">
            {chrome.i18n.getMessage(setting.description as any)}
          </span>
        )}
      </TextFieldRoot>
      <Button
        class="mt-2"
        onmousedown={() => {
          setStoredValue(inputValue());
          if (props.onChange) props.onChange(inputValue());
        }}
        onclick={() => {
          setStoredValue(inputValue());
          if (props.onChange) props.onChange(inputValue());
        }}
        disabled={storedValue() === inputValue()}
      >
        {storedValue() === inputValue()
          ? chrome.i18n.getMessage("saved" as any)
          : chrome.i18n.getMessage("save" as any)}
      </Button>
    </div>
  );

  const renderRange = () => (
    <div class="mb-4">
      <h3 class="text-lg font-[600] mb-2">
        {chrome.i18n.getMessage(setting.title as any)}
      </h3>
      <div class="flex items-start gap-2">
        <input
          type="range"
          class="h-2 w-full appearance-none rounded-lg bg-zinc-100 dark:bg-zinc-600"
          min={setting.min || 0}
          max={setting.max || 100}
          step={setting.step || 1}
          value={Number(storedValue()) * (setting.displayMultiplier || 1)}
          onInput={(e) => {
            const newValue =
              Number(e.currentTarget.value) / (setting.displayMultiplier || 1);
            setStoredValue(newValue);
            if (props.onChange) props.onChange(newValue);
          }}
        />
      </div>
      {setting.description && (
        <span class="text-sm text-muted-foreground">
          {chrome.i18n.getMessage(setting.description as any)}
        </span>
      )}
    </div>
  );

  const renderRadio = () => (
    <div class="mb-4">
      <span class="text-sm">
        {chrome.i18n.getMessage(setting.title as any)}
      </span>
      <RadioGroup
        defaultValue={storedValue()}
        onChange={(value: string) => {
          setStoredValue(value);
          if (props.onChange) props.onChange(value);
        }}
      >
        <For each={setting.options || []}>
          {(option) => (
            <RadioGroupItem
              value={option.value}
              class="flex items-center gap-2"
            >
              <RadioGroupItemControl />
              <RadioGroupItemLabel class="text-sm">
                {chrome.i18n.getMessage((option.title || option.value) as any)}
              </RadioGroupItemLabel>
            </RadioGroupItem>
          )}
        </For>
      </RadioGroup>
      {setting.description && (
        <span class="text-sm text-muted-foreground">
          {chrome.i18n.getMessage(setting.description as any)}
        </span>
      )}
    </div>
  );

  const renderSelect = () => (
    <div class="mb-4">
      <h3 class="text-lg font-[600] mb-2">
        {chrome.i18n.getMessage(setting.title as any)}
      </h3>
      <div
        class={cn("card-group", {
          "grid-cols-2 grid-rows-2":
            setting.options && setting.options.length === 4,
          "grid-cols-3 grid-rows-1":
            setting.options && setting.options.length === 3,
          "grid-cols-2 grid-rows-1":
            setting.options && setting.options.length === 2,
          "grid-cols-3 grid-rows-2":
            setting.options && setting.options.length === 6,
        })}
      >
        <For each={setting.options || []}>
          {(option) => (
            <button
              class="card-style"
              data-selected={
                (Number(storedValue())
                  ? Number(storedValue())
                  : storedValue()) === option.value
              }
              onmousedown={() => {
                setStoredValue(option.value);
                if (props.onChange) props.onChange(option.value);
              }}
              onclick={() => {
                setStoredValue(option.value);
                if (props.onChange) props.onChange(option.value);
              }}
            >
              <div class="icon">
                {option.icon ? (
                  <Dynamic
                    component={option.icon}
                    class="size-[64px]"
                    fill={option.fill || "currentColor"}
                  />
                ) : (
                  <span class={cn("!text-5xl font-bold")}>
                    {option.preview}
                  </span>
                )}
              </div>
              <span class="text-xl">
                {chrome.i18n.getMessage(option.title)}
              </span>
            </button>
          )}
        </For>
      </div>
    </div>
  );

  const renderColor = () => (
    <div class="mb-4">
      <h3 class="text-lg font-[600] mb-2">
        {chrome.i18n.getMessage(setting.title as any)}
      </h3>
      <input
        type="color"
        class="block h-10 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1
          disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700
          dark:bg-neutral-900"
        id={`color-input-${props.id}`}
        value={storedValue()}
        onInput={(e) => {
          setStoredValue(e.currentTarget.value);
          if (props.onChange) props.onChange(e.currentTarget.value);
        }}
        title={chrome.i18n.getMessage(setting.title as any)}
      />
    </div>
  );

  const renderFile = () => (
    <div class="mb-4">
      <h3 class="text-lg font-[600] mb-2">
        {chrome.i18n.getMessage(setting.title as any)}
      </h3>
      <form class="max-w-sm">
        <label for={`file-input-${props.id}`} class="sr-only">
          {chrome.i18n.getMessage("choose_file" as any)}
        </label>
        <input
          type="file"
          accept={setting.accept || "*"}
          name={`file-input-${props.id}`}
          id={`file-input-${props.id}`}
          onChange={(e) => {
            const files: FileList | null = e.target?.files;
            if (files && files[0]) {
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target && e.target.result) {
                  setStoredValue(e.target.result.toString());
                  if (props.onChange)
                    props.onChange(e.target.result.toString());
                }
              };
              reader.readAsDataURL(files[0]);
            }
          }}
          class="block w-full rounded-lg border-none bg-neutral-500 text-sm text-white
            backdrop-blur-3xl file:me-4 file:border-0 file:bg-neutral-600 file:px-4
            file:py-3 file:text-white focus:z-10 focus:border-blue-500 focus:ring-blue-500
            disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700
            dark:bg-black/5 dark:text-neutral-400 dark:file:bg-white/10
            dark:file:text-neutral-400"
        />
      </form>
    </div>
  );

  const renderButton = () => (
    <div class="mb-4">
      <h3 class="text-lg font-[600] mb-2">
        {chrome.i18n.getMessage(setting.title as any)}
      </h3>
      {setting.description && (
        <p class="text-sm text-muted-foreground mb-2">
          {chrome.i18n.getMessage(setting.description as any)}
        </p>
      )}
      <Button
        variant={setting.dangerous ? "destructive" : "default"}
        onclick={() => {
          if (setting.action === "clearData") {
            if (
              confirm(chrome.i18n.getMessage("clear_data_confirmation" as any))
            ) {
              localStorage.clear();
              if (chrome.storage) {
                chrome.storage.local.clear();
                chrome.storage.sync.clear();
              }
              window.location.reload();
            }
          }

          if (props.onChange) props.onChange(true);
        }}
      >
        {chrome.i18n.getMessage(setting.actionLabel || (setting.title as any))}
      </Button>
    </div>
  );

  // Get bookmarks for the bookmark picker
  const [bookmarks] = createBookmarksSignal("bookmarks", []);

  const renderBookmarkPicker = () => (
    <div class="mb-4">
      <BookmarkPicker
        value={storedValue()}
        onChange={(value) => {
          setStoredValue(value);
          if (props.onChange) props.onChange(value);
        }}
        bookmarks={bookmarks()}
      />
    </div>
  );

  let settingComponent: JSX.Element;

  const settingType = setting.type as
    | "toggle"
    | "input"
    | "range"
    | "radio"
    | "select"
    | "color"
    | "file"
    | "button"
    | "bookmark-picker";

  switch (settingType) {
    case "toggle":
      settingComponent = renderToggle();
      break;
    case "input":
      settingComponent = renderInput();
      break;
    case "range":
      settingComponent = renderRange();
      break;
    case "radio":
      settingComponent = renderRadio();
      break;
    case "select":
      settingComponent = renderSelect();
      break;
    case "color":
      settingComponent = renderColor();
      break;
    case "file":
      settingComponent = renderFile();
      break;
    case "button":
      settingComponent = renderButton();
      break;
    case "bookmark-picker":
      settingComponent = renderBookmarkPicker();
      break;
    default:
      settingComponent = <div>Unknown setting type: {setting.type}</div>;
  }

  const renderDependencies = () => {
    if (
      setting.children &&
      settingType === "toggle" &&
      actuallyBoolean(storedValue())
    ) {
      return (
        <div class="pl-4 mt-2 border-l border-gray-200 dark:border-gray-700">
          <For each={Object.keys(setting.children)}>
            {(childId) => (
              <SettingItem
                id={childId}
                onChange={(val) => {
                  if (props.onChange) props.onChange({ [childId]: val });
                }}
              />
            )}
          </For>
        </div>
      );
    }

    const dependentSettings = findDependentSettings(props.id, storedValue());
    if (dependentSettings.length > 0) {
      return (
        <div class="mt-2">
          <For each={dependentSettings}>
            {(depSetting) => (
              <SettingItem
                id={depSetting.id}
                onChange={(val) => {
                  if (props.onChange) props.onChange({ [depSetting.id]: val });
                }}
              />
            )}
          </For>
        </div>
      );
    }

    return null;
  };

  return (
    <div class={props.class || ""}>
      {settingComponent}
      {renderDependencies()}
    </div>
  );
};

export default SettingItem;
