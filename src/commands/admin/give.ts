import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { handleGive, parseMentionTarget } from "../../utils/adminTools.js";
import embed from "../../utils/embed.js";

export default {
	name: "give",
	aliases: [],
	description: "Give wallet money to a user.",
	usage: "<@user> <amount>",
	category: "admin",
	guildOnly: true,
	adminOnly: true,

	slash: new SlashCommandBuilder()
		.setName("give")
		.setDescription("Give wallet money to a user")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addUserOption((option) =>
			option.setName("user").setDescription("User").setRequired(true),
		)
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setDescription("Amount")
				.setRequired(true)
				.setMinValue(1),
		),

	async execute({ message, args }) {
		const target = parseMentionTarget(message);
		const amount = parseInt(args[1], 10);
		if (!target || Number.isNaN(amount)) {
			return message.reply({
				embeds: [embed.error("Usage: `.give @user <amount>`")],
			});
		}
		return message.reply({
			embeds: [
				await handleGive(message.guild.id, message.author.id, target, amount),
			],
		});
	},

	async executeSlash({ interaction }) {
		return interaction.reply({
			embeds: [
				await handleGive(
					interaction.guild.id,
					interaction.user.id,
					interaction.options.getUser("user"),
					interaction.options.getInteger("amount"),
				),
			],
			ephemeral: true,
		});
	},
};
