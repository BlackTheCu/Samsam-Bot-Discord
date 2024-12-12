/*

const schedule = require('node-schedule');
const { exec } = require('child_process');
const moment = require('moment-timezone');

module.exports.data = {
    name: 'schedulesentmessage', // Tên lệnh bạn sử dụng
    description: 'Lên lịch gửi tin nhắn tự động vào ngày mùng 5 hàng tháng lúc 20:00 (GMT+7)', // Mô tả lệnh
    type: 1, // Loại lệnh (1 là Slash command)
    options: [], // Các tham số nếu có
};

module.exports.execute = async (interaction) => {
    // Phản hồi khi người dùng gọi lệnh
    await interaction.reply('Đang thiết lập lịch gửi tin nhắn tự động vào ngày mùng 5 hàng tháng lúc 20:00 (GMT+7)...');
    // // Tính toán thời gian 3 phút sau
    // const now = moment();
    // const fiveMinutesLater = now.add(3, 'minutes'); // Thêm 3 phút vào thời gian hiện tại
    // const minutes = fiveMinutesLater.minute();
    // const hours = fiveMinutesLater.hour();
    //
    // schedule.scheduleJob(`${minutes} ${hours} * * *`, () => {
    //     const currentTime = moment.tz('Asia/Bangkok').format('HH:mm, DD/MM/YYYY');
    //     console.log(`[Scheduled Task] Bắt đầu thực hiện sentqrbanking.js vào lúc: ${currentTime}`);


        // Lịch chạy vào mùng 5 hàng tháng lúc 20:00 (GMT+7)
    schedule.scheduleJob('0 0 13 5 *', () => { // 20:00 GMT+7 là 13:00 UTC
        const currentTime = moment.tz('Asia/Bangkok').format('HH:mm, DD/MM/YYYY');
        console.log(`[Scheduled Task] Bắt đầu thực hiện sentqrbanking.js vào lúc: ${currentTime}`);
    
        
        // Thực hiện chạy file sentqrbanking.js
        exec('node "D:/worrrk/Personal Project/Samsam-Bot-Discord/commands/utility/sentqrbanking.js"', (error, stdout, stderr) => {
            if (error) {
                console.error(`[Scheduled Task] Lỗi khi chạy sentqrbanking.js: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`[Scheduled Task] Lỗi từ sentqrbanking.js: ${stderr}`);
                return;
            }
            console.log(`[Scheduled Task] Kết quả từ sentqrbanking.js:\n${stdout}`);
        });
    });

    console.log('[Scheduled Task] Hệ thống lịch đã được khởi động. Chờ đến ngày 5 hàng tháng lúc 20:00 (GMT+7) để thực hiện.');
};

*/

const schedule = require('node-schedule');
const moment = require('moment-timezone');
const sentQrBanking = require('./sentqrbanking'); // Import module sentqrbanking

module.exports.data = {
    name: 'schedulesentmessage', // Tên lệnh bạn sử dụng
    description: 'Lên lịch gửi tin nhắn tự động vào ngày mùng 5 hàng tháng lúc 19:00 (GMT+7)', // Mô tả lệnh
    type: 1, // Loại lệnh (1 là Slash command)
    options: [], // Các tham số nếu có
};

module.exports.execute = async (interaction) => {
    try {
        // Phản hồi khi người dùng gọi lệnh
        await interaction.reply('Lịch gửi tin nhắn tự động vào ngày mùng 5 hàng tháng lúc 19:00 (GMT+7) đã được thiết lập.');

        // Lên lịch chạy vào mùng 5 hàng tháng lúc 20:00 (GMT+7)
        schedule.scheduleJob('00 19 5 * *', async () => { // 19:00 PM mùng 5 hàng tháng //phút - giờ - ngày - tháng - năm
            const currentTime = moment.tz('Asia/Bangkok').format('HH:mm, DD/MM/YYYY');
            console.log(`[Scheduled Task] Bắt đầu thực hiện lệnh sentqrbanking vào lúc: ${currentTime}`);

            try {
                // Gọi thực thi lệnh sentqrbanking
                const fakeInteraction = {
                    guild: interaction.guild,
                    reply: async (message) => console.log(`[SentQRBanking Reply]: ${message}`),
                };
                await sentQrBanking.execute(fakeInteraction); // Giả lập interaction
                console.log('[Scheduled Task] Lệnh sentqrbanking đã hoàn tất.');
            } catch (error) {
                console.error(`[Scheduled Task] Lỗi khi thực thi lệnh sentqrbanking: ${error.message}`);
            }
        });

        console.log('[Scheduled Task] Lịch trình đã được khởi động. Chờ đến ngày 5 hàng tháng lúc 20:00 (GMT+7) để thực hiện.');
    } catch (error) {
        console.error(`[Error] Lỗi khi thực thi lệnh schedulesentmessage: ${error.message}`);
        await interaction.reply({
            content: 'Đã xảy ra lỗi khi thiết lập lịch trình.',
            ephemeral: true,
        });
    }
};
