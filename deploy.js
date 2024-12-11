/*

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Hàm để load và deploy các lệnh
module.exports = async (client) => {
    const commands = [];
    const foldersPath = path.join(__dirname, 'commands');

    // Kiểm tra thư mục 'commands' có tồn tại hay không
    if (!fs.existsSync(foldersPath)) {
        console.warn(`[WARNING] Commands folder "${foldersPath}" does not exist.`);
        return;
    }

    // Lấy tất cả các thư mục trong 'commands'
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);

        // Kiểm tra thư mục hợp lệ
        if (fs.lstatSync(commandsPath).isDirectory()) {
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            // Load từng lệnh trong thư mục
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);

                // Kiểm tra tính hợp lệ của lệnh
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data);
                } else {
                    console.warn(`[WARNING] The command at "${filePath}" is missing a required "data" or "execute" property.`);
                }
            }
        }
    }

    // Tạo một instance của REST module
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log(`Started refreshing ${commands.length} application [/] commands.`);

        // Refresh tất cả các lệnh trong guild
        const data = await rest.put(
            Routes.applicationCommands(client.user.id, process.env.GUILD_ID),
            { body: commands }
        );

        console.log(`Successfully reloaded ${data.length} application [/] commands.`);
    } catch (error) {
        // Bắt lỗi và in ra console
        console.error(`Failed to deploy commands: ${error.message}`);
    }

    // Đăng ký lệnh lên lịch
    const scheduleCommand = {
        name: 'schedulesentmessage', // Tên lệnh bạn sử dụng
        description: 'Lên lịch gửi tin nhắn tự động vào ngày mùng 5 hàng tháng lúc 20:00 (GMT+7)', // Mô tả lệnh
        type: 1, // Loại lệnh (1 là Slash command)
        options: [], // Các tham số nếu có
    };

    // Đảm bảo bạn đã lấy đúng client và đã có token
    try {
        console.log('Đang đăng ký lệnh schedulesentmessage...');

        // Đăng ký thêm lệnh lịch gửi tin nhắn vào Discord
        const result = await rest.put(
            Routes.applicationCommands(client.user.id, process.env.GUILD_ID),
            { body: [scheduleCommand] }
        );

//         console.log(`Đã đăng ký lệnh "schedulesentmessage" thành công.`);
//     } catch (error) {
//         console.error(`Lỗi khi đăng ký lệnh lịch: ${error.message}`);
//     }
// };

*/

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Hàm để load và deploy các lệnh
module.exports = async (client) => {
    const commands = [];
    const foldersPath = path.join(__dirname, 'commands');

    // Kiểm tra thư mục 'commands' có tồn tại hay không
    if (!fs.existsSync(foldersPath)) {
        console.warn(`[WARNING] Commands folder "${foldersPath}" does not exist.`);
        return;
    }

    // Lấy tất cả các thư mục trong 'commands'
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);

        // Kiểm tra thư mục hợp lệ
        if (fs.lstatSync(commandsPath).isDirectory()) {
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            // Load từng lệnh trong thư mục
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);

                // Kiểm tra tính hợp lệ của lệnh
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data);
                } else {
                    console.warn(`[WARNING] The command at "${filePath}" is missing a required "data" or "execute" property.`);
                }
            }
        }
    }

    // Tạo một instance của REST module
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log(`Started refreshing ${commands.length} application [/] commands.`);

        // Refresh tất cả các lệnh trong guild
        const data = await rest.put(
            Routes.applicationCommands(client.user.id, process.env.GUILD_ID),
            { body: commands }
        );

        console.log(`Successfully reloaded ${data.length} application [/] commands.`);
    } catch (error) {
        // Bắt lỗi và in ra console
        console.error(`Failed to deploy commands: ${error.message}`);
    }
};
