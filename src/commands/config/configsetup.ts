import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { DEFAULT_PREFIX } from "../../config.js";
import { getGuildConfig } from "../../utils/configtools.js";
import { buildSetupEmbed } from "../../utils/setupmessage.js";

export default {
	name: "configsetup",
	aliases: ["setupguide"],
	description: "Show the setup guide for this server.",
	usage: "",
	category: "config",
	guildOnly: true,
	adminOnly: true,

	slash: new SlashCommandBuilder()
		.setName("configsetup")
		.setDescription("Show the setup guide for this server")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute({ message, prefix, guildData }) {
		const currentGuildData =
			guildData || (await getGuildConfig(message.guild.id));
		return message.reply({
			embeds: [
				buildSetupEmbed(prefix || currentGuildData.prefix || DEFAULT_PREFIX),
			],
		});
	},

	async executeSlash({ interaction, guildData }) {
		const currentGuildData =
			guildData || (await getGuildConfig(interaction.guild.id));
		return interaction.reply({
			embeds: [buildSetupEmbed(currentGuildData.prefix || DEFAULT_PREFIX)],
			ephemeral: true,
		});
	},
};
