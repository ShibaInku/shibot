// @ts-ignore
import {Events, BaseInteraction} from 'discord.js'



module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: BaseInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({content: `${error}`, ephemeral: true});
        }
    }
}