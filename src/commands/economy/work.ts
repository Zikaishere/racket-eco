import { SlashCommandBuilder } from "discord.js";
import {
	WANTED_WORK_MULTIPLIER,
	WORK_COOLDOWN,
	WORK_MAX,
	WORK_MIN,
} from "../../config.js";
import User from "../../models/User.js";
import { logAudit } from "../../utils/audit.js";
import { fmt } from "../../utils/economy.js";
import embed from "../../utils/embed.js";

const JOBS = [
	"dealt cards at the casino",
	"ran a street hustle",
	"fenced some stolen goods",
	"drove getaway for a crew",
	"worked security at a nightclub",
	"sold bootleg merchandise",
	"collected debts for a boss",
	"ran numbers for the syndicate",
	"cooked books for a shady accountant",
	"picked pockets at a busy market",
];

const run = async ({ userId, guildId, reply }) => {
	const currentUser = await User.findOrCreate(userId, guildId);

	const earned =
		Math.floor(Math.random() * (WORK_MAX - WORK_MIN + 1)) + WORK_MIN;
	const wantedActive =
		currentUser.wantedUntil &&
		new Date(currentUser.wantedUntil).getTime() > Date.now();
	const finalEarned = wantedActive
		? Math.max(1, Math.floor(earned * WANTED_WORK_MULTIPLIER))
		: earned;
	const updated = await User.findOneAndUpdate(
		{
			userId,
			guildId,
			$or: [
				{ lastWork: null },
				{ lastWork: { $lte: new Date(Date.now() - WORK_COOLDOWN) } },
			],
		},
		{
			$set: { lastWork: new Date() },
			$inc: { balance: finalEarned, totalEarned: finalEarned },
		},
		{ new: true },
	);

	if (!updated) {
		const user = await User.findOrCreate(userId, guildId);
		const remaining =
			WORK_COOLDOWN - (Date.now() - new Date(user.lastWork).getTime());
		const mins = Math.ceil(remaining / 60000);
		return reply({
			embeds: [
				embed.warning(
					"Still Working",
					`You're still on the clock. Come back in **${mins}m**.`,
				),
			],
			ephemeral: true,
		});
	}

	const job = JOBS[Math.floor(Math.random() * JOBS.length)];
	await logAudit({
		guildId,
		actorId: userId,
		targetId: userId,
		action: "work_claim",
		amount: finalEarned,
		currency: "wallet",
		metadata: { job, wantedPenalty: wantedActive },
	});
	const penaltyText = wantedActive
		? `\n\nWanted status reduced your payout from ${fmt(earned)} to ${fmt(finalEarned)}.`
		: "";
	return reply({
		embeds: [
			embed.success(
				"Work Complete",
				`You ${job} and earned ${fmt(finalEarned)}.\n\nNew balance: ${fmt(updated.balance)}${penaltyText}`,
			),
		],
	});
};

export default {
	name: "work",
	aliases: ["hustle"],
	description: "Work a job and earn some raqs.",
	usage: "",
	category: "economy",
	guildOnly: true,

	slash: new SlashCommandBuilder()
		.setName("work")
		.setDescription("Work a job and earn some raqs"),

	async execute({ message }) {
		return run({
			userId: message.author.id,
			guildId: message.guild.id,
			reply: (data) => message.reply(data),
		});
	},

	async executeSlash({ interaction }) {
		return run({
			userId: interaction.user.id,
			guildId: interaction.guild.id,
			reply: (data) => interaction.reply(data),
		});
	},
};
