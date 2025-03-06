# Blooft

<div 
<a href="https://chromewebstore.google.com/detail/blooft/fpdjjjmglibdjocjpcchgkbakeelaghm"><img alt="Chrome Web Store Users" src="https://img.shields.io/chrome-web-store/users/fpdjjjmglibdjocjpcchgkbakeelaghm?color=red"></a> <a href="https://crowdin.com/project/blooft"><img src="https://badges.crowdin.net/blooft/localized.svg" alt="Crowdin"></a><br />
Blooft is a heavily customizable, beautiful, and modular New Tab page. Blooft lets you build your New Tab page, customizing it every step of the way, using a simple drag-and-drop widget system. Get stuff done with todos and the pomodoro technique, relax with soundscapes, and move faster with Magic Search.

Features:

- Widget-based system for max customizability
- Use it as a speed dial or a nightstand-style clock
- Listen to relaxing soundscapes
- Focus with the pomodoro technique
- Beautiful background images, solid colors, gradients, all up to you
- Change the font, layout, theme, and more
- Be greeted on every New Tab
- Install CSS mods with one-click at [blooft.com/plugins](https://blooft.com/plugins/) and even make your own [here](https://github.com/blooft-app/plugins).

<img src="https://storage.blooft.com/hero.jpg" style="border-radius: 24px;">

## Install for your browser

- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/blooft-new-tab/)
- [Chrome](https://chromewebstore.google.com/detail/blooft/fpdjjjmglibdjocjpcchgkbakeelaghm)
- [Vivaldi](https://help.blooft.com/help/articles/0376600-use-flowtide-as-your-new-tab-page-in-vivaldi)

## Developing the extension

First, install the dependencies:

```bash
pnpm install
```

Then, start the development server:

```bash
pnpm dev
```

Go to the port shown for the development server.

## Building from source

First, install the dependencies:

```bash
pnpm install
```

Then, build the extension:

**Chrome compatible:**

```bash
pnpm build:chrome
```

**Firefox compatible:**

```bash
pnpm build:firefox
```

The extension's source code will be inside the `apps/new-tab/dist` folder.

## Community

[Join the Discord server here!](https://discord.gg/hhPuurkvua)

## Localization

If you know Spanish, French, Korean, Chinese (simplified or traditional), German, or Portugese, I'd very much appreciate you helping proofread existing translations or adding new ones. With your help, Blooft can be enjoyed by more people.

## Contributions

We welcome contributions! If you have suggestions or improvements, please:

- **Create a feature request**: [Post a feature request](https://feedback.blooft.com/feature-requests)
- **Open an Issue**: [Create an issue](https://github.com/Thingbomb/Blooft/issues).
- **Submit a Pull Request**: [Submit a pull request](https://github.com/Thingbomb/Blooft/pulls).<br/><br />

Or, you can discuss in our [discussions page](https://github.com/blooft-app/blooft/discussions).

## License

This project is licensed under the GPLv3 license.
