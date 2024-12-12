const { SlashCommandBuilder } = require('@discordjs/builders');
const schedule = require('node-schedule');
const moment = require('moment-timezone');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('registerwashingschedule')
        .setDescription('Đăng ký lịch tự động gửi tin nhắn.'),

    async execute(interaction, client) {
        try {
            await interaction.reply('Lịch gửi tin nhắn tự động vào thứ 5 hàng tuần lúc 20:20 (GMT+7) đã được thiết lập.');

            // Lên lịch chạy vào thứ 5 hàng tuần lúc 20:00 (GMT+7)
            schedule.scheduleJob('20 20 5 * *', async () => {
                const currentTime = moment.tz('Asia/Bangkok').format('HH:mm, DD/MM/YYYY');
                console.log(`[Scheduled Task] Bắt đầu gửi tin nhắn vào lúc: ${currentTime}`);

                try {
                    const channel = interaction.guild.channels.cache.find(ch => ch.name === 'lịch-sử-dụng-máy-giặt'); // Đảm bảo biến interaction có giá trị đúng
                    if (!channel) {
                        console.error('[Scheduled Task] Không tìm thấy kênh custom-command-bot.');
                        return;
                    }

                    const message = await channel.send({
                        content: "**ĐĂNG KÝ LỊCH SỬ DỤNG MÁY GIẶT**\n\n" +
                            "Lưu ý: Thời hạn đăng ký lịch sử dụng máy giặt cho tuần sau sẽ được mở trong khoảng thời gian 20:00 thứ 5 và **kết thúc sau 3 ngày**\n\n" +
                            "**[Click vào đây để mở link](https://docs.google.com/spreadsheets/d/1q3X50MNi9IpDHz5jXmDK5Jxq5s5HRsgxyoBYCAYLv6I/edit?usp=sharing)**\n" +
                            "Xin chân thành cảm ơn <@&1311598192357543998>!"
                    });

                    console.log('[Scheduled Task] Tin nhắn đã được gửi thành công.');

                    // Lên lịch để gửi tin nhắn "Đã khóa sheet" sau 3 ngày
                    const threeDaysLater = moment().add(3, 'days').toDate();
                    schedule.scheduleJob(threeDaysLater, async () => {
                        try {
                            await message.reply("Đã khóa sheet Lịch đăng ký sử dụng máy giặt tuần kế tiếp");
                            console.log('[Follow-up Task] Đã gửi tin nhắn khóa sheet sau 3 ngày.');
                        } catch (error) {
                            console.error(`[Follow-up Task] Lỗi khi gửi tin nhắn phản hồi: ${error.message}`);
                        }
                    });

                    console.log('[Scheduled Task] Tin nhắn đã được gửi thành công.');
                } catch (error) {
                    console.error(`[Scheduled Task] Lỗi khi gửi tin nhắn: ${error.message}`);
                }
            });

            console.log('[Scheduled Task] Lịch trình gửi tin nhắn đã được khởi động. Chờ đến 20:20 thứ 5 hàng tuần để thực hiện.');
        } catch (error) {
            console.error(`[Error] Lỗi khi thực thi lệnh registerwashingschedule: ${error.message}`);
            await interaction.reply({
                content: 'Đã xảy ra lỗi khi thiết lập lịch trình.',
                ephemeral: true,
            });
        }
    },
};
