// Import các lớp cần thiết từ thư viện discord.js
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // Nạp biến môi trường từ tệp .env

// Tạo một client mới với các quyền cần thiết
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Intent cần thiết để lấy danh sách thành viên
    ],
});

// Tạo collection để lưu trữ các lệnh
client.commands = new Collection();

// Đọc các thư mục và tệp lệnh
const foldersPath = path.join(__dirname, 'commands');
if (fs.existsSync(foldersPath)) {
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        if (fs.lstatSync(commandsPath).isDirectory()) {
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                // Đảm bảo lệnh có đầy đủ các thuộc tính cần thiết
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                } else {
                    console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
    }
} else {
    console.warn(`[WARNING] Commands folder "${foldersPath}" does not exist.`);
}
client.on(Events.InteractionCreate, async (interaction) => {
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
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
    }
});


// Khi bot sẵn sàng, chạy đoạn mã này (chỉ chạy một lần)
client.once(Events.ClientReady, async readyClient => {
    const commandsdata = await require("./deploy")(readyClient);
    console.log(commandsdata)
    console.log(`Bot đã sẵn sàng! Đăng nhập với tài khoản: ${client.user.tag}`);
});

// Đăng nhập vào Discord với token từ biến môi trường
client.login(process.env.TOKEN).catch(err => {
    console.error('Không thể đăng nhập bot. Hãy kiểm tra token của bạn:', err);
});
