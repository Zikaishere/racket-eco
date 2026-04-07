import mongoose from "mongoose";
import { DEV_IDS, DEV_PREFIX } from "../../config.js";
import { clearDbWipeRequest, getDbWipeRequest } from "../../utils/devDanger.js";
import embed from "../../utils/embed.js";

const OWNER_ID = DEV_IDS[0];

export default {
	name: "confirmdbwipe",
	aliases: ["dbwipeconfirm"],
	description: "Confirm and execute the full database wipe.",
	usage: "<token>",
	category: "dev",
	devOnly: true,

	async execute({ message, args }) {
		if (message.author.id !== OWNER_ID) {
			return message.reply({
				embeds: [
					embed.error("Only the primary developer can use this command."),
				],
			});
		}

		const token = args[0];
		const pending = getDbWipeRequest(message.author.id);
		if (!pending) {
			return message.reply({
				embeds: [
					embed.error(
						`There is no active database wipe request. Run \`${DEV_PREFIX}dbwipe\` first.`,
					),
				],
			});
		}

		if (!token || token !== pending.token) {
			return message.reply({
				embeds: [
					embed.error(
						"That confirmation token is invalid. The database was not touched.",
					),
				],
			});
		}

		try {
			await mongoose.connection.db.dropDatabase();
			clearDbWipeRequest(message.author.id);
			return message.reply({
				embeds: [
					embed.success(
						"Database Wiped",
						"The entire Mongo database was deleted successfully.",
					),
				],
			});
		} catch (error) {
			return message.reply({
				embeds: [embed.error(`Database wipe failed: ${error.message}`)],
			});
		}
	},
};
