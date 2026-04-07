import fs from "node:fs";
import path from "node:path";

class EventHandler {
	constructor(client) {
		this.client = client;
	}

	async load() {
		const eventsPath = path.join(__dirname, "../events");
		const files = fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"));

		for (const file of files) {
			const eventModule = await import(path.join(eventsPath, file));
			const event = eventModule.default || eventModule;

			if (!event.name) {
				console.warn(`⚠️  Event ${file} is missing a name, skipping.`);
				continue;
			}

			if (event.once) {
				this.client.once(event.name, (...args) =>
					event.execute(...args, this.client),
				);
			} else {
				this.client.on(event.name, (...args) =>
					event.execute(...args, this.client),
				);
			}

			console.log(`  ✅ Loaded event: ${event.name}`);
		}
	}
}

export default EventHandler;
