import util from "node:util";
import embed from "../../utils/embed.js";

function sanitizeOutput(value) {
	let text =
		typeof value === "string"
			? value
			: util.inspect(value, { depth: 2, maxArrayLength: 20 });

	const secrets = [process.env.BOT_TOKEN, process.env.MONGO_URI].filter(
		Boolean,
	);
	for (const secret of secrets) {
		text = text.split(secret).join("[REDACTED]");
	}

	if (text.length > 3500) {
		text = `${text.slice(0, 3500)}\n...`;
	}

	return text;
}

export default {
	name: "eval",
	aliases: ["evaluate"],
	description: "Evaluate JavaScript in the current bot context.",
	usage: "<code>",
	category: "dev",
	devOnly: true,

	async execute({ message, args, _client }) {
		const code = args.join(" ").trim();
		if (!code) {
			return message.reply({
				embeds: [embed.error("Usage: `rack eval <code>`")],
			});
		}

		try {
			let result: unknown;
			try {
				// biome-ignore lint/security/noGlobalEval: Dev-only eval command
				result = await eval(`(async () => (${code}))()`);
			} catch (e) {
				console.log("Expression eval failed:", e.message);
				// biome-ignore lint/security/noGlobalEval: Dev-only eval command
				result = await eval(`(async () => { return ${code} })()`);
			}
			const output = sanitizeOutput(result);
			return message.reply({
				embeds: [embed.info("Eval Result", `\`\`\`js\n${output}\n\`\`\``)],
			});
		} catch (error) {
			const output = sanitizeOutput(error);
			return message.reply({
				embeds: [embed.error(`\`\`\`js\n${output}\n\`\`\``)],
			});
		}
	},
};
