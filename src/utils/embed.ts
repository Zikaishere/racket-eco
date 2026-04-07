import { EmbedBuilder } from "discord.js";

import {
	COLOR_ECONOMY,
	COLOR_ERROR,
	COLOR_INFO,
	COLOR_PRIMARY,
	COLOR_SUCCESS,
	COLOR_WARNING,
	FOOTER,
} from "../config.js";

const footer = (embed) => embed.setFooter({ text: FOOTER });

export const primary = (title, desc) =>
	footer(
		new EmbedBuilder()
			.setColor(COLOR_PRIMARY)
			.setTitle(title)
			.setDescription(desc),
	);
export const success = (title, desc) =>
	footer(
		new EmbedBuilder()
			.setColor(COLOR_SUCCESS)
			.setTitle(title)
			.setDescription(desc),
	);
export const error = (desc) =>
	footer(
		new EmbedBuilder()
			.setColor(COLOR_ERROR)
			.setTitle("❌ Error")
			.setDescription(desc),
	);
export const warning = (title, desc) =>
	footer(
		new EmbedBuilder()
			.setColor(COLOR_WARNING)
			.setTitle(title)
			.setDescription(desc),
	);
export const info = (title, desc) =>
	footer(
		new EmbedBuilder()
			.setColor(COLOR_INFO)
			.setTitle(title)
			.setDescription(desc),
	);
export const economy = (title, desc) =>
	footer(
		new EmbedBuilder()
			.setColor(COLOR_ECONOMY)
			.setTitle(title)
			.setDescription(desc),
	);
export const raw = (color) => footer(new EmbedBuilder().setColor(color));
