const { ChannelType, ThreadAutoArchiveDuration } = require('discord.js');
const moment = require('moment-timezone');
const currentMonth = new Date().toLocaleString('vi-VN', { month: 'long' });

module.exports.data = {
    name: 'sentqrcode', // Tên lệnh
    description: 'Nhắc nhở đóng tiền nhà',
    type: 1, // Slash command type
    options: [], // Không yêu cầu tham số
};

module.exports.execute = async (interaction) => {
    try {
        // Danh sách các kênh đích
        const targetChannels = [
            'p101',
            'p201', 'p202',
            'p301','p302',
            'p401', 'p402',
        ];

        // Embed thông báo
        const embed = {
            author: { name: '*Wofl wofl* ĐÓNG TIỀN NHÀ THÔI!!' },
            title: 'Tiền nhà của bạn đã đến hạn, vui lòng thanh toán trước ngày 10 của tháng.',
            description: 'Thông tin chuyển khoản:\nAgribank - Chi nhánh Thăng Long\n1300556689999\nNguyễn Tiến Khang',
            footer: { text: 'Chân thành cảm ơn!' },
            image: { url: 'https://i.imgur.com/fSsaEmN.jpeg' }
        };

        const button = {
            type: 1, // Action row
            components: [
                {
                    type: 2, // Button type
                    style: 3, // Success style (màu xanh lá)
                    label: 'ĐÃ ĐÓNG',
                    custom_id: 'mark_paid',
                    emoji: { name: '💸' }
                }
            ]
        };

        const guild = interaction.guild;

        if (!guild) {
            return interaction.reply({
                content: 'Lệnh này chỉ có thể thực hiện trong server.',
                ephemeral: true,
            });
        }

        // Duyệt qua danh sách các kênh và tạo threads
        for (const channelName of targetChannels) {
            const channel = guild.channels.cache.find(
                ch => ch.type === ChannelType.GuildText && ch.name === channelName
            );

            if (channel) {
                try {
                    // Tạo thread trong kênh
                    const thread = await channel.threads.create({
                        name: `Tiền nhà tháng ${currentMonth}`,
                        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
                        type: ChannelType.PrivateThread,
                        reason: `Tạo thread trong kênh ${channelName} để nhắc nhở thanh toán tiền nhà`,
                    });
                    
                    // Thêm tất cả thành viên vào thread
                    const members = await guild.members.fetch();
                    const threadPromises = members.map(async (member) => {
                        try {
                            await thread.members.add(member.user.id);
                        } catch (error) {
                            console.error(`Không thể thêm ${member.user.tag} vào thread: ${error.message}`);
                        }
                    });
                    await Promise.all(threadPromises);

                    if (thread) {
                        // Gửi thông báo vào thread
                        await thread.send({
                            embeds: [embed],
                            components: [button],
                        });
                        
                        console.log(`Thread đã được tạo thành công trong kênh "${channelName}".`);
                    }
                } catch (error) {
                    console.error(`Lỗi khi tạo thread trong kênh "${channelName}": ${error.message}`);
                }
            } else {
                console.warn(`Không tìm thấy kênh "${channelName}" trong guild.`);
            }
        }

        // Phản hồi thành công
        await interaction.reply({
            content: 'Threads đã được tạo trong các kênh mục tiêu.',
            ephemeral: true,
        });
    } catch (error) {
        console.error(`Lỗi khi thực hiện lệnh /sentqrcode: ${error.message}`);
        await interaction.reply({
            content: 'Đã xảy ra lỗi khi thực hiện lệnh.',
            ephemeral: true,
        });
    }
};
