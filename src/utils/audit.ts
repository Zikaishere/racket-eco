import AuditLog from "../models/auditlog.js";

async function logAudit({
	guildId = null,
	actorId = null,
	targetId = null,
	action,
	amount = null,
	currency = null,
	metadata = {},
}) {
	try {
		await AuditLog.create({
			guildId,
			actorId,
			targetId,
			action,
			amount,
			currency,
			metadata,
		});
	} catch (error) {
		console.error("Failed to write audit log:", error);
	}
}

export { logAudit };
