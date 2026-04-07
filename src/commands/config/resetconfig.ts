import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { resetConfig } from "../../utils/configtools.js";

export default {
	name: "resetconfig",
	aliases: ["cfgreset"],
	description: "Reset this server's bot configuration to defaults.",
	usage: "",
	category: "config",
	guildOnly: true,
	adminOnly: true,

	slash: new SlashCommandBuilder()
		.setName("resetconfig")
		.setDescription("Reset this server's bot configuration to defaults")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute({ message }) {
		return message.reply({
			embeds: [await resetConfig(message.guild.id, message.author.id)],
		});
	},

	async executeSlash({ interaction }) {
		return interaction.reply({
			embeds: [await resetConfig(interaction.guild.id, interaction.user.id)],
			ephemeral: true,
		});
	},
};
