const {SlashCommandBuilder } = require('discord.js');
const {axios} = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('credit')
    .setDescription('Register your credit')
    .setStringOption(option => option.setName('Username').setDescription('').setRequired(true))
    .setStringOption(option => option.setName('User_ID').setDescription('').setRequired(true))
    .setStringOption(option => option.setName('Credit_Name').setDescription('').setRequired(true))
    async execute (interaction) {
        await interaction.reply ({ content: 'You can now credit yourself', ephemeral = true})

        const Username = interaction.options.getString('Username')
        const User_ID = interaction.options.getString('User_ID')
        const Credit_Name = interaction.options.getString('Credit_Name')

        axios.post('https://sheetdb.io/api/v1/ddujjhi8q72bw'), {
             data {
                ${Username},
                ${User_ID},
                ${Credit_Name}
             }
        }


    }
}