<section>

## Contribution Guide

Thank you for helping improve the Enact framework! These documents highlight some of the things you'll need to know before
submitting code or documentation to the project:

*   [Coding Style Guide](./code_style.md) - The Enact code style explained
*   [Documenting Code for the API Reference](./doc_style.md) - How we use jsDoc to document Enact

### Contributors Welcome!

Enact is an open-source project, and is developed in public on Github under the Apache 2.0 license. We have a core team of
developers who work full-time on Enact, and we also welcome outside contributors to join our effort to make native-quality
app development a reality on the web stack.

Here's what you need to know to get started.

*   If you have an idea for a fix or feature you’d like to contribute, we strongly encourage you to float it for discussion
	on the [Enact development mailing list first][devMailList], particularly if it will involve a lot of work to implement.

*   We’ll consider anything, but keep in mind that it's a big responsibility to ensure the Enact core and the official
	libraries stay rock-solid, lightweight, and fully-cross platform, so not all contributions will make sense to pull into
	those libraries. In general, it’s safe to say that smaller changes are more likely to be accepted than larger ones, and
	that contributions to the “outer rings” of Enact are more likely to be accepted than things that affect the Enact core.

*   We maintain a list of tasks in our bug tracker tagged with the starter label, which we think are good issues for new
	developers to tackle to get up to speed with contributing to Enact. If you're interested in becoming a regular contributor
	and are looking for a place to start, try working on one of [these issues][enactIssues] first.

*   If you want to tackle a known bug, check the Enact JIRA issue tracker to make sure no one is already in progress on
	the issue, and leave a comment indicating you are working on a fix.

*   We have also set up the Enact Community Gallery as a place you can freely show off and share any widgets, libraries,
	and add-ons you create, and we encourage you to go crazy there.

### Contribution GuideLines

We have formalized our contribution guidelines a bit to ensure we can safely accept even large contributions to the official
project. Please read this section carefully if you are interested in contributing:

*   All developers (even the core team) do development on git branches or forks. Changes to master are submitted as pull requests
	via Github to the `develop` branch, and our designated "Pull Masters" oversee the code review/signoff process and merge changes
	into master.

*   To contribute a change, fork the repo, push changes to your fork, and submit a pull request to enact to have your change
	reviewed for submission to master. For details on the Github pull request process, see [here](https://help.github.com/articles/using-pull-requests).

*   **IMPORTANT**: All pull requests must now include the following line in the pull request comments (using your full name and email
	address), which indicates your contribution complies to the ***[Enact Developer's Certificate of Origin v1.0](./dco.md)***:

	```Enact-DCO-1.0-Signed-off-by: Joe Smith <joe@myco.com>```

	Below is a layman's description of the five points in the Enact DCO (be sure to read and agree to the full text [here](./dco.md)):

	*   I created this contribution/change and have the right to submit it to the Project; or
	*   I created this contribution/change based on a previous work with a compatible open source license; or
	*   This contribution/change has been provided to me by someone who did (a) or (b) and I am submitting the contribution unchanged.
	*   I understand this contribution is public and may be redistributed as open source software.
	*   I understand that I retain copyright ownership in this contribution and I am granting the Project a copyright license to
		use, modify and distribute my contribution. The Project may relicense my contribution under other OSI-approved licenses.
	
	The Enact DCO and signoff process was heavily influenced by the Linux Foundation's kernel contribution process, and we think
	it strikes a good balace between keeping the lawyers happy while staying lightweight. Just remember to include the one-line
	signoff in all pull requests.

*   Finally, a couple of practical matters to help our Pull Masters stay sane:

	*   Please make sure your contributions follow our Style Guide.
	*   Please squash pull requests down to a single commit to simplify review and keep history clean.
	*   Help keep diffs easy to read by not making unnecessary rearrangements to the source code.
	*   Make sure not to inadvertantly change line ending types from Unix to Windows.
	*   Ensure inline API documentation exists and is up-to-date (minimum: kind summary, published properties, events, and public
		methods). See Documenting Code for the API Reference for more details.
	*   When resolving a bug, include the JIRA issue key in the commit/pull request comments. Here's a good example:
		```
		ENACT-123: Fixed girdle-spring physics on the encabulator scrollbar.
		Enact-DCO-1.0-Signed-off-by: Joe Smith <joe@myco.com>
		```

### Getting More Involved

If you'd like to become more than an occasional contributor, by all means let us know by [email][enactEmail] or the
[development list][devMailList], and we'll figure out how to get you move involved.

And if you share our vision for the web as the universal app platform and you're interested in getting paid for your
contributions to Enact, we're hiring! Check out our [jobs section][jobListings] for details.

[devMailList]: .
[enactEmail]: mailto:contact@enactjs.com
[enactIssues]: .
[jobListings]: http://enactjs.com/about/team#Jobs

</section>