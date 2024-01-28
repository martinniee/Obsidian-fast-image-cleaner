import { fileContentsProcess } from "./fileContentsProcess";
import { escapeRegex } from "./util";

export const removeReferenceLink = new fileContentsProcess(
	(lines, plugin, params) => {
		let imgPath = params?.imgPath as string;
		const MDLinkRegex = /!\[.*?\]\((?<imgLinkPath>.*?)\)/g;
		const WIKILinkRegex = /!\[\[(?<imgLinkPath>[^\|\n\[\]]+)?.*?\]\]/g;

		for (const i in lines) {
			if (lines[i].match(MDLinkRegex)) {
				// Consider the situation that multiple reference links exists in one line together.
				const allMatches = [...lines[i].matchAll(MDLinkRegex)];

				for (const match of allMatches) {
					let imgLinkPath = match.groups?.imgLinkPath as string;
					/**
					 * Note that the reference link in markdown format containing space
					 * character will convert the space to %20 while link path gotten from DOM still is space.
					 */
					imgLinkPath = imgLinkPath.replace(/%20/g, " ");
					if (imgLinkPath === imgPath) {
						// [^!\[\]\n] Do not use '[',']','\n','!' in the alt text for properly operation of the plugin.
						const targetRegex = new RegExp(
							`!\\[[^!\\[\\]\n]*?\\]\\(${escapeRegex(
								imgPath
							)}\\)`,
							"g"
						);
						const replaced = lines[i]
							.replace(/%20/g, " ")
							.replace(targetRegex, "")
							.replace(/ /g, "%20");
						lines[i] = replaced;
					}
				}
			} else if (lines[i].match(WIKILinkRegex)) {
				const allMatches = [...lines[i].matchAll(WIKILinkRegex)];

				for (const match of allMatches) {
					let imgLinkPath = match.groups?.imgLinkPath as string;

					imgLinkPath = imgLinkPath.trim();
					if (imgLinkPath === imgPath) {
						let text = escapeRegex("![[]]");
						const replaced = lines[i].replace(
							new RegExp(
								`!\\[\\[(?<imgLinkPath>${escapeRegex(
									imgPath
								)}).*?\\]\\]`,
								"g"
							),
							""
						);
						lines[i] = replaced;
					}
				}
			}
		}
		return lines;
	}
);
