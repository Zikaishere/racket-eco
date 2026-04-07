import { SlashCommandBuilder } from "discord.js";
import BlackMarket from "../../models/BlackMarket.js";
import { logAudit } from "../../utils/audit.js";
import embed from "../../utils/embed.js";

const run = async ({ userId, guildId, listingId, reply }) => {
	if (!listingId) {
		return reply({
			embeds: [
				embed.error(
					"Please provide a listing ID from `bm-mine` or `bm-browse`.",
				),
			],
			ephemeral: true,
		});
	}

	const listings = await BlackMarket.find({
		guildId,
		sellerId: userId,
		sold: false,
		quantity: { $gt: 0 },
		expiresAt: { $gt: new Date() },
	});

	const listing = listings.find(
		(entry) =>
			entry._id.toString().slice(-6).toLowerCase() === listingId.toLowerCase(),
	);
	if (!listing) {
		return reply({
			embeds: [
				embed.error("That active listing was not found under your account."),
			],
			ephemeral: true,
		});
	}

	listing.sold = true;
	listing.quantity = 0;
	await listing.save();

	await logAudit({
		guildId,
		actorId: userId,
		targetId: userId,
		action: "blackmarket_cancel",
		metadata: {
			listingId: listing._id.toString(),
			itemName: listing.itemName,
		},
	});

	return reply({
		embeds: [
			embed.success(
				"Listing Cancelled",
				`Cancelled **${listing.itemName}** listing \`${listing._id.toString().slice(-6)}\``,
			),
		],
	});
};

export default {
	name: "bm-cancel",
	aliases: ["bmcancel"],
	description: "Cancel one of your active black market listings.",
	usage: "<listing-id>",
	category: "blackmarket",
	guildOnly: true,

	slash: new SlashCommandBuilder()
		.setName("bm-cancel")
		.setDescription("Cancel one of your active black market listings")
		.addStringOption((o) =>
			o.setName("id").setDescription("Listing ID").setRequired(true),
		),

	async execute({ message, args }) {
		return run({
			userId: message.author.id,
			guildId: message.guild.id,
			listingId: args[0],
			reply: (data) => message.reply(data),
		});
	},

	async executeSlash({ interaction }) {
		return run({
			userId: interaction.user.id,
			guildId: interaction.guild.id,
			listingId: interaction.options.getString("id"),
			reply: (data) => interaction.reply(data),
		});
	},
};
