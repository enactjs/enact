---
title: Contribution Guide
---

Thank you for helping improve the Enact framework! These documents highlight some of the things you'll need to know before
submitting code or documentation to the project:

<!-- *   [Coding Style Guide](./code-style.md) - The Enact code style explained -->
*   [Building Enact Locally](./building-enact-locally.md) - How to install and use the Enact source
*   [Documentation Style Guide](./documentation.md) - How we use jsDoc comments to document Enact
*   [Documenting Changes](./changelogs.md) -  The Enact `CHANGELOG.md` guidelines

The source for Enact is located in the [enactjs GitHub repository](https://github.com/enactjs/enact). Our [issue tracker](https://github.com/enactjs/enact/issues) is also located on GitHub, where you can find our [roadmap](https://github.com/enactjs/enact/issues/1504).

### Contributors Welcome!

Enact is an open-source project, and is developed in public under the Apache 2.0 license. We have a core team of
developers who work full-time on Enact, and we also welcome outside contributors to join our effort to make native-quality
app development a reality on the web stack.

Here's what you need to know to get started.

*   We’ll consider anything, but keep in mind that it's a big responsibility to ensure the Enact core and the official
	libraries stay rock-solid, lightweight, and fully-cross platform, so not all contributions will make sense to pull into
	those libraries. In general, it’s safe to say that smaller changes are more likely to be accepted than larger ones, and
	that contributions to the “outer rings” of Enact are more likely to be accepted than things that affect the Enact core.

### Contribution Guidelines

We have formalized our contribution guidelines a bit to ensure we can safely accept even large contributions to the official
project. Please read this section carefully if you are interested in contributing:

*   All developers (even the core team) do development on git branches or forks. Changes to master are submitted as pull requests
	via GitHub to the `develop` branch, and our designated "Pull Masters" oversee the code review/signoff process and merge changes
	into `develop`.

*   To contribute a change, fork the repo, push changes to your fork, and submit a pull request to enact to have your change
	reviewed for submission to master. For details on the GitHub pull request process, see [here](https://help.github.com/articles/using-pull-requests).

*   **IMPORTANT**: All pull requests must now include the following line in the pull request comments (using your full name and email
	address), which indicates your contribution complies to the ***[Enact Developer's Certificate of Origin v1.0](./dco.md)***:

	`Enact-DCO-1.0-Signed-off-by: Joe Smith <joe@myco.com>`

	Below is a layman's description of the five points in the Enact DCO (be sure to read and agree to the full text [here](./dco.md)):

	*   I created this contribution/change and have the right to submit it to the Project; or
	*   I created this contribution/change based on a previous work with a compatible open source license; or
	*   This contribution/change has been provided to me by someone who did (a) or (b) and I am submitting the contribution unchanged.
	*   I understand this contribution is public and may be redistributed as open source software.
	*   I understand that I retain copyright ownership in this contribution and I am granting the Project a copyright license to
		use, modify and distribute my contribution. The Project may relicense my contribution under other OSI-approved licenses.
	
	The Enact DCO and signoff process was heavily influenced by the Linux Foundation's kernel contribution process, and we think
	it strikes a good balance between keeping the lawyers happy while staying lightweight. Just remember to include the one-line
	signoff in all pull requests.

*   Finally, a couple of practical matters to help our Pull Masters stay sane:

	*   Please make sure your contributions follow our Style Guide.  At a minimum, ensure your source passes through
	`npm run lint` with no warnings.
	*   Please squash pull requests down to a single commit to simplify review and keep history clean.
	*   Ensure all new features have unit tests that pass and any bug fixes include tests that
	fail without the fix applied
	*   Help keep diffs easy to read by not making unnecessary rearrangements to the source code.
	*   Make sure not to inadvertently change line ending types from Unix to Windows.
	*   Ensure inline API documentation exists and is up-to-date (minimum: component summary and descriptions of all
	properties). See the [Documentation Style Guide](./documentation.md) for more details.
	*   When resolving a bug, include the issue key in the commit/pull request comments. Here's a good example:
		```
		ENACT-123: Fixed girdle-spring physics on the encabulator scrollbar.
		Enact-DCO-1.0-Signed-off-by: Joe Smith <joe@myco.com>
		```
	*   Make sure you include a CHANGELOG that follows [these](./changelogs.md) guidelines.

### Getting More Involved

If you'd like to become more than an occasional contributor, by all means let us know by dropping by
our [gitter channel](https://gitter.im/EnactJS/Lobby/~chat#share) and we'll figure out how to get
you more involved.
