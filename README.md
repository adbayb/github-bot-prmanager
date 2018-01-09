# github-bot-prmanager

## Why ?

This bot allows to manage more efficiently your github pull requests by setting a set of automatic behaviors.

These behaviors are defined thanks to a plugin system.

Basically, `github-bot-prmanager` listens to github bot events and responds by a set of actions that can be defined via those plugins.

## Installation

**Manual:**

* [x] Clone the repository: `git clone https://github.com/adbayb/github-bot-prmanager.git`
* [x] `cd github-bot-prmanager`
* [x] Creates a `.env` file by following the `.env.example` template to add your github user token (which will act as a user bot)/configure the bot. _Please, note:_ `repo token scope` is the minimal rights requirements to give to the user bot.
* [x] `npm install`
* [x] `npm start`
* [x] You're all done, the bot is now lauched and listens to port 3000.
* [x] You can now enable your bot into your github repository by adding your bot server as a github webhook (@see [Github documentation: Setting up a Webhook](https://developer.github.com/webhooks/creating/#setting-up-a-webhook)).

**Docker:**

* [x] Clone the repository: `git clone https://github.com/adbayb/github-bot-prmanager.git`
* [x] `cd github-bot-prmanager`
* [x] Creates a `.env` file by following the `.env.example` template to add your github user token (which will act as a user bot)/configure the bot. _Please, note:_ `repo token scope` is the minimal rights requirements to give to the user bot.
* [x] `docker build -t github/bot .`
* [x] `docker run -p 3000:3000 github/bot`
* [x] You're all done, the bot is now lauched and listens to port 3000.
* [x] You can now enable your bot into your github repository by adding your bot server as a github webhook (@see [Github documentation: Setting up a Webhook](https://developer.github.com/webhooks/creating/#setting-up-a-webhook)).

## List of plugins

**Related to label management:**

* [x] **[Approval](./src/plugins/approvedLabel.js)**: For each review, it checks if the targetted lowest required approval is reached. If yes, it adds the label `LGTM` to the PR.
* [x] **[Title](./src/plugins/titleLabel.js)**: For each created pull request, it checks the title format and extracts the scope from it. Basically, a pull request must follow the angular commit message convention ([Angular's commit convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines): `<type>(<scope>): <subject>`) to be trated by this plugin. It will extract the scope and add associated label to the pull request (creates one if not).
