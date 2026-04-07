import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { buildAdminOverviewEmbed } from "../../utils/admintools.js";

export default {
	name: "admin",
	aliases: ["adm"],
	description: "Show the standalone admin commands available in this server.",
	usage: "",
	category: "admin",
	guildOnly: true,
	adminOnly: true,

	slash: new SlashCommandBuilder()
		.setName("admin")
		.setDescription("View the standalone admin commands")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute({ message, prefix }) {
		return message.reply({ embeds: [buildAdminOverviewEmbed(prefix)] });
	},

	async executeSlash({ interaction, guildData }) {
		const prefix = guildData?.prefix || ".";
		return interaction.reply({
			embeds: [buildAdminOverviewEmbed(prefix)],
			ephemeral: true,
		});
	},
};
