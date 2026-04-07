import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { DEFAULT_PREFIX } from "../../config.js";
import { buildConfigOverviewEmbed } from "../../utils/configtools.js";

export default {
	name: "config",
	aliases: ["settings"],
	description: "Show the standalone configuration commands for this server.",
	usage: "",
	category: "config",
	guildOnly: true,
	adminOnly: true,

	slash: new SlashCommandBuilder()
		.setName("config")
		.setDescription("View the standalone configuration commands")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute({ message, prefix }) {
		return message.reply({
			embeds: [buildConfigOverviewEmbed(prefix || DEFAULT_PREFIX)],
		});
	},

	async executeSlash({ interaction, guildData }) {
		return interaction.reply({
			embeds: [buildConfigOverviewEmbed(guildData?.prefix || DEFAULT_PREFIX)],
			ephemeral: true,
		});
	},
};
